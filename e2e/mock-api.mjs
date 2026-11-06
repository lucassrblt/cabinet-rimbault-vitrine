#!/usr/bin/env node
// Mock de l'API publique Cabinet Rimbault pour les tests de bout en bout.
//
// - POST /api/public/evaluation et /api/public/contact : JAMAIS transmis à
//   l'API réelle. Les corps reçus sont enregistrés en mémoire et validés comme
//   le fait l'API réelle (mêmes codes 400/422/201), pour que les tests
//   vérifient le payload envoyé par la vitrine.
// - GET /api/public/properties/** : servis depuis e2e/fixtures/ (par défaut)
//   ou relayés vers l'API réelle si MOCK_API_MODE=proxy (lecture seule).
//
// Routes de pilotage (utilisées par les tests, pas par la vitrine) :
//   GET    /__mock/health
//   GET    /__mock/requests[?path=/evaluation]  -> corps POST reçus
//   DELETE /__mock/requests                     -> remise à zéro
//   POST   /__mock/scenario {"name": "..."}     -> default | empty | error | edge
//                                                  | n1 | n2 | n4 | n5 | n12 (volumes)
//   POST   /__mock/fail-next {"path": "/evaluation", "status": 500[, "body": {…}]}
//
// Statuts, comme l'API réelle (lib/public-properties + route properties) :
// les listes ne montrent par défaut que DISPONIBLE, SOUS_OFFRE et
// SOUS_COMPROMIS ; GET /properties accepte ?status= (multiple) pour lire
// VENDU et LOUE (archive), refuse ARCHIVE, BROUILLON et toute autre valeur
// (400) ; une fiche VENDU ou LOUE répond 404 « Bien non disponible ».
//
// Variables : MOCK_API_PORT (3101), MOCK_API_KEY (e2e-test-key),
//             MOCK_API_MODE (fixtures | proxy), REAL_API_URL, REAL_API_KEY.

import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.MOCK_API_PORT ?? 3101);
const API_KEY = process.env.MOCK_API_KEY ?? "e2e-test-key";
const MODE = process.env.MOCK_API_MODE ?? "fixtures";
const REAL_API_URL = process.env.REAL_API_URL; // ex. https://…/api/public
const REAL_API_KEY = process.env.REAL_API_KEY;
const PREFIX = "/api/public";

const loadJson = (name) =>
  JSON.parse(readFileSync(join(here, "fixtures", name), "utf8"));
const LIST = loadJson("properties.json").properties;
const DETAILS = loadJson("details.json").properties;
const EDGE = loadJson("edge-cases.json").properties;

const state = { scenario: "default", requests: [], failNext: new Map() };

const VISIBLE_STATUSES = ["DISPONIBLE", "SOUS_OFFRE", "SOUS_COMPROMIS"];
const PUBLIC_STATUSES = [...VISIBLE_STATUSES, "VENDU", "LOUE"];
const isVisible = (p) => VISIBLE_STATUSES.includes(p.status);

// Variantes de volume pour la grille (brief A21 : 1, 2, 4, 5 et 12 biens) :
// scénarios `n1`, `n2`, `n4`, `n5`, `n12`. Uniquement des ventes
// DISPONIBLE, prises dans l'ordre de `properties.json` ; au-delà de 5, des
// copies aux références suffixées (« 10.131-c6 »), dont la fiche est celle
// du bien d'origine.
const VOLUMES = { n1: 1, n2: 2, n4: 4, n5: 5, n12: 12 };
const SCENARIOS = [
  "default",
  "empty",
  "error",
  "edge",
  ...Object.keys(VOLUMES),
];

function volume(n) {
  const base = LIST.filter(
    (p) => p.transactionType === "VENTE" && p.status === "DISPONIBLE",
  );
  return Array.from({ length: n }, (_, i) => {
    const source = base[i % base.length];
    if (i < base.length) return source;
    // createdAt décalé pour garder un ordre stable et distinct.
    const createdAt = new Date(
      Date.parse(source.createdAt) - (i + 1) * 60_000,
    ).toISOString();
    return { ...source, reference: `${source.reference}-c${i + 1}`, createdAt };
  });
}

/** Tous les biens du scénario, archive comprise (VENDU, LOUE). */
function catalogue() {
  if (state.scenario === "empty") return [];
  if (state.scenario === "edge") return [...LIST, ...EDGE];
  if (state.scenario in VOLUMES) return volume(VOLUMES[state.scenario]);
  return LIST;
}

/** Fiche brute, quel que soit le statut (le 404 d'archive est fait à l'appel). */
function detailOf(reference) {
  if (state.scenario === "empty") return null;
  if (DETAILS[reference]) return DETAILS[reference];
  const copie = reference.match(/^(.+)-c\d+$/);
  if (state.scenario in VOLUMES && copie && DETAILS[copie[1]])
    return { ...DETAILS[copie[1]], reference };
  if (state.scenario === "edge") {
    return EDGE.find((p) => p.reference === reference) ?? null;
  }
  return null;
}

const byDateDesc = (a, b) => b.createdAt.localeCompare(a.createdAt);

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return { raw, json: raw ? JSON.parse(raw) : null };
  } catch {
    return { raw, json: undefined };
  }
}

const clampLimit = (raw, def, max) => {
  const n = raw ? Number.parseInt(raw, 10) : def;
  return Math.max(1, Math.min(Number.isNaN(n) ? def : n, max));
};

// --- Validation calquée sur cabinet-rimbault-api/src/app/api/public/* ---
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEvaluation(b) {
  if (!b || typeof b !== "object")
    return [400, { success: false, error: "Corps JSON invalide" }];
  for (const f of [
    "propertyType",
    "postalCode",
    "firstName",
    "lastName",
    "email",
  ]) {
    if (!b[f])
      return [400, { success: false, error: `Le champ ${f} est requis` }];
  }
  if (!/^\d{5}$/.test(b.postalCode))
    return [
      400,
      { success: false, error: "Le code postal doit contenir 5 chiffres" },
    ];
  if (!EMAIL.test(b.email))
    return [400, { success: false, error: "L'adresse email n'est pas valide" }];
  const conditions = [
    "NEUF",
    "TRES_BON_ETAT",
    "BON_ETAT",
    "A_RAFRAICHIR",
    "A_RENOVER",
    "A_RESTAURER",
  ];
  if (b.condition != null && !conditions.includes(b.condition))
    return [
      400,
      { success: false, error: "La valeur de `condition` est invalide" },
    ];
  return null;
}

function validateContact(b) {
  if (!b || typeof b !== "object")
    return [400, { success: false, error: "Corps JSON invalide" }];
  const fields = {};
  const subjects = [
    "BIEN_SALE",
    "BIEN_RENT",
    "ESTIMATION",
    "APPOINTMENT",
    "OTHER",
  ];
  if (!b.subject) fields.subject = "Required";
  else if (!subjects.includes(b.subject))
    fields.subject = `Invalid enum value (attendu : ${subjects.join(", ")})`;
  if (
    b.profile != null &&
    !["BUYER", "INVESTOR", "CURIOUS", "TENANT"].includes(b.profile)
  )
    fields.profile = "Invalid enum value";
  if (
    b.financing != null &&
    !["APPROVED", "IN_PROGRESS", "TO_STUDY", "CASH"].includes(b.financing)
  )
    fields.financing = "Invalid enum value";
  const c = b.contact ?? {};
  if (!c.firstName) fields["contact.firstName"] = "firstName est requis";
  if (!c.lastName) fields["contact.lastName"] = "lastName est requis";
  if (!c.email || !EMAIL.test(c.email))
    fields["contact.email"] = "L'adresse email n'est pas valide";
  if (!c.message) fields["contact.message"] = "message est requis";
  else if (c.message.length > 500)
    fields["contact.message"] = "message limité à 500 caractères";
  if (typeof b.consent?.rgpd !== "boolean") fields["consent.rgpd"] = "Required";
  const keys = Object.keys(fields);
  if (keys.length)
    return [400, { success: false, error: fields[keys[0]], fields }];
  if (b.consent.rgpd !== true)
    return [
      422,
      {
        success: false,
        error: "Consentement RGPD requis",
        code: "RGPD_REQUIRED",
      },
    ];
  return null;
}

async function handlePost(req, res, path) {
  const { raw, json } = await readBody(req);
  const record = {
    at: new Date().toISOString(),
    path,
    headers: { "content-type": req.headers["content-type"] ?? null },
    body: json === undefined ? raw : json,
  };
  state.requests.push(record);

  const forced = state.failNext.get(path);
  if (forced) {
    state.failNext.delete(path);
    return send(
      res,
      forced.status,
      forced.body ?? { success: false, error: "Erreur simulée par le mock" },
    );
  }
  const error =
    path === "/evaluation" ? validateEvaluation(json) : validateContact(json);
  if (error) return send(res, error[0], error[1]);
  const id = `mock_${state.requests.length}`;
  const message =
    path === "/evaluation"
      ? "Votre demande d'estimation a été enregistrée avec succès"
      : "Votre demande a été enregistrée avec succès";
  return send(res, 201, {
    success: true,
    message,
    data: { id, createdAt: record.at },
  });
}

function handleGetFixtures(res, path, query) {
  if (state.scenario === "error")
    return send(res, 500, {
      success: false,
      error: "Erreur simulée par le mock",
    });

  const all = catalogue();
  const visible = all.filter(isVisible);
  const limit = (def, max) => clampLimit(query.get("limit"), def, max);

  if (path === "/properties") {
    const statuses = query.getAll("status");
    const invalid = statuses.find((s) => !PUBLIC_STATUSES.includes(s));
    if (invalid)
      return send(res, 400, {
        success: false,
        error: `Invalid value for status: ${invalid}`,
      });
    let items = (
      statuses.length ? all.filter((p) => statuses.includes(p.status)) : visible
    ).sort(byDateDesc);
    const tt = query.get("transactionType");
    if (tt) items = items.filter((p) => p.transactionType === tt);
    const total = items.length;
    const offset = Math.max(
      0,
      Number.parseInt(query.get("offset") ?? "0", 10) || 0,
    );
    const lim = limit(50, 100);
    const data = items.slice(offset, offset + lim);
    return send(res, 200, {
      success: true,
      count: data.length,
      total,
      offset,
      limit: lim,
      filters: {
        ...(tt && { transactionType: tt }),
        ...(statuses.length === 1 && { status: statuses[0] }),
        ...(statuses.length > 1 && { status: statuses }),
      },
      data,
    });
  }
  if (path === "/properties/sale" || path === "/properties/rent") {
    const tt = path.endsWith("sale") ? "VENTE" : "LOCATION";
    const data = visible
      .filter((p) => p.transactionType === tt)
      .sort(byDateDesc)
      .slice(0, limit(50, 100));
    return send(res, 200, {
      success: true,
      count: data.length,
      filters: { transactionType: tt },
      data,
    });
  }
  if (path === "/properties/recent") {
    const data = [...visible].sort(byDateDesc).slice(0, limit(5, 20));
    return send(res, 200, { success: true, count: data.length, data });
  }
  const similar = path.match(/^\/properties\/([^/]+)\/similar$/);
  if (similar) {
    const ref = decodeURIComponent(similar[1]);
    const source = detailOf(ref);
    if (!source)
      return send(res, 404, { success: false, error: "Bien non trouvé" });
    if (!isVisible(source))
      return send(res, 404, { success: false, error: "Bien non disponible" });
    const data = visible
      .filter(
        (p) =>
          p.reference !== ref &&
          p.transactionType === source.transactionType &&
          p.propertyType === source.propertyType,
      )
      .sort(byDateDesc)
      .slice(0, limit(3, 10));
    return send(res, 200, { success: true, count: data.length, data });
  }
  const detail = path.match(/^\/properties\/([^/]+)$/);
  if (detail) {
    const p = detailOf(decodeURIComponent(detail[1]));
    if (!p) return send(res, 404, { success: false, error: "Bien non trouvé" });
    if (!isVisible(p))
      return send(res, 404, { success: false, error: "Bien non disponible" });
    return send(res, 200, { success: true, data: p });
  }
  return send(res, 404, { success: false, error: "Route inconnue du mock" });
}

async function handleGetProxy(res, path, search) {
  if (!REAL_API_URL || !REAL_API_KEY)
    return send(res, 500, {
      success: false,
      error: "REAL_API_URL / REAL_API_KEY manquantes (mode proxy)",
    });
  // Note : GET /properties/[reference] incrémente le compteur de vues réel.
  const upstream = await fetch(`${REAL_API_URL}${path}${search}`, {
    headers: { "X-API-Key": REAL_API_KEY },
  });
  res.writeHead(upstream.status, {
    "Content-Type": upstream.headers.get("content-type") ?? "application/json",
  });
  res.end(Buffer.from(await upstream.arrayBuffer()));
}

async function handleControl(req, res, url) {
  const path = url.pathname;
  if (path === "/__mock/health")
    return send(res, 200, { ok: true, mode: MODE, scenario: state.scenario });
  if (path === "/__mock/requests" && req.method === "GET") {
    const filter = url.searchParams.get("path");
    return send(
      res,
      200,
      state.requests.filter((r) => !filter || r.path === filter),
    );
  }
  if (path === "/__mock/requests" && req.method === "DELETE") {
    state.requests = [];
    state.failNext.clear();
    return send(res, 200, { ok: true });
  }
  if (path === "/__mock/scenario" && req.method === "POST") {
    const { json } = await readBody(req);
    const name = json?.name ?? "default";
    if (!SCENARIOS.includes(name))
      return send(res, 400, { error: `Scénario inconnu : ${name}` });
    state.scenario = name;
    return send(res, 200, { ok: true, scenario: name });
  }
  if (path === "/__mock/fail-next" && req.method === "POST") {
    const { json } = await readBody(req);
    // `body` facultatif : réponse imposée (ex. 400 avec `fields`).
    state.failNext.set(json?.path ?? "/evaluation", {
      status: Number(json?.status ?? 500),
      body: json?.body,
    });
    return send(res, 200, { ok: true });
  }
  return send(res, 404, { error: "Route de pilotage inconnue" });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
    if (url.pathname.startsWith("/__mock/"))
      return await handleControl(req, res, url);
    if (!url.pathname.startsWith(PREFIX))
      return send(res, 404, { error: "Hors /api/public" });

    if (req.headers["x-api-key"] !== API_KEY)
      return send(res, 401, {
        error: "Non autorisé - API Key invalide ou manquante",
      });

    const path = url.pathname.slice(PREFIX.length) || "/";
    if (
      req.method === "POST" &&
      (path === "/evaluation" || path === "/contact")
    )
      return await handlePost(req, res, path);
    if (req.method === "GET" && path.startsWith("/properties")) {
      return MODE === "proxy"
        ? await handleGetProxy(res, path, url.search)
        : handleGetFixtures(res, path, url.searchParams);
    }
    return send(res, 405, {
      error: "Méthode ou route non prise en charge par le mock",
    });
  } catch (error) {
    send(res, 500, { error: String(error) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[mock-api] http://127.0.0.1:${PORT}${PREFIX} (mode ${MODE})`);
});
