// Sauvegarde du tunnel dans sessionStorage (doc 04 §3.5) : clé
// `cr:estimation:v1`, durée de vie 24 h. Tout accès est protégé : en
// navigation privée ou avec un stockage bloqué, le tunnel fonctionne sans
// reprise, rien ne casse.

import type { EstimationState } from "@/lib/forms/estimation-schema";
import { type Echeance, isEcheance } from "./echeance";
import { sanitizeEstimationState } from "./form-data";

export const STORAGE_KEY = "cr:estimation:v1";
const TTL_MS = 24 * 60 * 60 * 1000;

export type SavedEstimation = {
  state: EstimationState;
  /** Premier affichage du tunnel (ms depuis l'epoch), pour l'anti-spam. */
  startedAt: number;
  /** Page interne d'entrée dans le tunnel (`/vendre`), ou « ». */
  referer: string;
  /** Échéance du projet (question hors de `EstimationState`). */
  echeance: Echeance;
  /** Question affichée au moment de la sauvegarde. */
  question: number;
};

type Stored = SavedEstimation & { v: 1; savedAt: number };

export function loadEstimation(now = Date.now()): SavedEstimation | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Stored>;
    if (data?.v !== 1 || typeof data.savedAt !== "number") return null;
    if (now - data.savedAt > TTL_MS) {
      clearEstimation();
      return null;
    }
    const state = sanitizeEstimationState(data.state);
    if (!state) return null;
    return {
      state,
      startedAt: typeof data.startedAt === "number" ? data.startedAt : now,
      referer: typeof data.referer === "string" ? data.referer : "",
      echeance: isEcheance(data.echeance) ? data.echeance : "",
      question:
        typeof data.question === "number" && Number.isInteger(data.question)
          ? data.question
          : 1,
    };
  } catch {
    return null;
  }
}

export function saveEstimation(data: SavedEstimation): void {
  try {
    const stored: Stored = { v: 1, savedAt: Date.now(), ...data };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Stockage indisponible ou plein : la saisie continue sans reprise.
  }
}

export function clearEstimation(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Rien à faire.
  }
}
