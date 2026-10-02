"use client";

import { ArrowRight, ArrowUpRight, Check, Phone } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Planche de test de goût : de petits échantillons côte à côte, à cocher
// sans se justifier. Les choix restent dans ce navigateur et se copient.

type Sample = { id: string; name: string; node: ReactNode; dark?: boolean };
type Row = {
  id: string;
  title: string;
  hint: string;
  cols: string;
  samples: Sample[];
};

const STORAGE_KEY = "gout-choix";

/* ——— Boutons ——— */

const BUTTONS: Sample[] = [
  {
    id: "b1",
    name: "Lien appuyé",
    node: (
      <span className="group inline-flex items-center gap-2 border-b border-encre pb-1 font-medium">
        Voir le bien
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    ),
  },
  {
    id: "b2",
    name: "Pilule pleine",
    node: (
      <span className="inline-flex rounded-full bg-encre px-6 py-3 font-medium text-blanc">
        Voir le bien
      </span>
    ),
  },
  {
    id: "b3",
    name: "Rectangle sobre",
    node: (
      <span className="inline-flex rounded-[6px] bg-rouge px-6 py-3 font-medium text-blanc">
        Voir le bien
      </span>
    ),
  },
  {
    id: "b4",
    name: "Contour pilule",
    node: (
      <span className="inline-flex rounded-full border border-encre/80 px-6 py-3 font-medium transition-colors hover:bg-encre hover:text-blanc">
        Voir le bien
      </span>
    ),
  },
  {
    id: "b5",
    name: "Pastille flèche",
    node: (
      <span className="group inline-flex items-center gap-3 rounded-full bg-encre py-1.5 pr-1.5 pl-6 font-medium text-blanc">
        Voir le bien
        <span className="flex size-9 items-center justify-center rounded-full bg-blanc text-encre transition-transform group-hover:rotate-45">
          <ArrowUpRight size={17} aria-hidden />
        </span>
      </span>
    ),
  },
  {
    id: "b6",
    name: "Bouton double",
    node: (
      <span className="inline-flex items-stretch overflow-hidden rounded-[8px] border border-encre/80">
        <span className="flex items-center px-4 text-gris">
          <Phone size={16} aria-hidden />
        </span>
        <span className="border-l border-encre/80 px-5 py-3 font-medium">
          01 73 64 56 10
        </span>
      </span>
    ),
  },
  {
    id: "b7",
    name: "Souligné épais",
    node: (
      <span className="inline-flex font-medium underline decoration-rouge decoration-[3px] underline-offset-[6px]">
        Voir le bien
      </span>
    ),
  },
  {
    id: "b8",
    name: "Remplissage glissé",
    node: (
      <span className="group relative inline-flex overflow-hidden rounded-[4px] bg-pierre px-6 py-3 font-medium">
        <span className="absolute inset-0 -translate-x-[101%] bg-encre transition-transform duration-500 group-hover:translate-x-0" />
        <span className="relative transition-colors duration-500 group-hover:text-blanc">
          Voir le bien
        </span>
      </span>
    ),
  },
];

/* ——— Section recherche ——— */

function MiniField({
  className,
  children = "Ex. 3 pièces avec balcon",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span className={cn("block truncate text-[0.8125rem]", className)}>
      {children}
    </span>
  );
}

const SEARCH: Sample[] = [
  {
    id: "r1",
    name: "Carte pierre arrondie",
    node: (
      <div className="rounded-[18px] bg-pierre p-6">
        <p className="titre text-[1.25rem] leading-tight">
          Vous ne trouvez pas votre bien ?
        </p>
        <p className="mt-1 text-[0.8125rem] text-gris">
          Nous vous appelons dès qu’un bien correspond.
        </p>
        <div className="mt-4 flex gap-2">
          <MiniField className="flex-1 rounded-full bg-blanc px-4 py-2.5 text-gris" />
          <span className="rounded-full bg-encre px-4 py-2.5 text-[0.8125rem] text-blanc">
            Envoyer
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "r2",
    name: "Sans cadre, champs soulignés",
    node: (
      <div className="border-t border-encre pt-5">
        <p className="titre text-[1.25rem] leading-tight">
          Vous ne trouvez pas votre bien ?
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <MiniField className="border-b border-encre/40 pb-2 text-gris" />
          <MiniField className="border-b border-encre/40 pb-2 text-gris">
            Votre téléphone
          </MiniField>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 border-b border-encre pb-0.5 text-[0.875rem] font-medium">
          Être rappelé <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    ),
  },
  {
    id: "r3",
    name: "Fond sombre",
    dark: true,
    node: (
      <div className="rounded-[12px] bg-encre p-6 text-blanc">
        <p className="titre text-[1.25rem] leading-tight">
          Vous ne trouvez pas votre bien ?
        </p>
        <p className="mt-1 text-[0.8125rem] text-blanc/60">
          Nous vous appelons dès qu’un bien correspond.
        </p>
        <div className="mt-4 flex gap-2">
          <MiniField className="flex-1 rounded-[8px] bg-blanc/10 px-4 py-2.5 text-blanc/50" />
          <span className="rounded-[8px] bg-blanc px-4 py-2.5 text-[0.8125rem] text-encre">
            Envoyer
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "r4",
    name: "Carte blanche flottante",
    node: (
      <div className="rounded-[22px] bg-blanc p-6 shadow-[0_24px_60px_-28px_rgb(36_31_30/0.45)] ring-1 ring-filet">
        <p className="titre text-[1.25rem] leading-tight">
          Vous ne trouvez pas votre bien ?
        </p>
        <div className="mt-4 space-y-2">
          <MiniField className="rounded-[12px] bg-pierre px-4 py-2.5 text-gris" />
          <MiniField className="rounded-[12px] bg-pierre px-4 py-2.5 text-gris">
            Votre téléphone
          </MiniField>
        </div>
        <span className="mt-3 block rounded-[12px] bg-rouge py-2.5 text-center text-[0.8125rem] text-blanc">
          Être rappelé
        </span>
      </div>
    ),
  },
  {
    id: "r5",
    name: "Photo et formulaire",
    node: (
      <div className="grid grid-cols-5 overflow-hidden rounded-[14px] bg-pierre">
        <div className="col-span-2 bg-[url(/maquettes/devanture-provisoire.jpg)] bg-cover bg-center" />
        <div className="col-span-3 p-5">
          <p className="titre text-[1.125rem] leading-tight">
            Tous nos biens ne sont pas en ligne.
          </p>
          <MiniField className="mt-3 rounded-[8px] bg-blanc px-3 py-2 text-gris" />
          <span className="mt-2 inline-flex rounded-[8px] bg-encre px-4 py-2 text-[0.8125rem] text-blanc">
            Être rappelé
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "r6",
    name: "Centré, champ unique",
    node: (
      <div className="py-4 text-center">
        <p className="titre text-[1.375rem] leading-tight">
          Dites-nous ce que vous cherchez.
        </p>
        <div className="mx-auto mt-4 flex max-w-[22rem] items-center gap-2 rounded-full border border-filet bg-blanc py-1.5 pr-1.5 pl-5">
          <MiniField className="flex-1 text-left text-gris" />
          <span className="flex size-9 items-center justify-center rounded-full bg-rouge text-blanc">
            <ArrowRight size={16} aria-hidden />
          </span>
        </div>
      </div>
    ),
  },
];

/* ——— Pied de page ——— */

const FOOTERS: Sample[] = [
  {
    id: "f1",
    name: "Une ligne",
    node: (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-filet py-4 text-[0.75rem] text-gris">
        <span className="font-medium text-encre">Cabinet Rimbault</span>
        <span>117 bd Voltaire, Asnières</span>
        <span>01 73 64 56 10</span>
        <span>Mentions légales</span>
      </div>
    ),
  },
  {
    id: "f2",
    name: "Grand et sombre",
    dark: true,
    node: (
      <div className="rounded-[10px] bg-encre p-6 text-blanc">
        <p className="titre text-[1.75rem] leading-none">Cabinet Rimbault</p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-[0.6875rem] text-blanc/60">
          <span>117 boulevard Voltaire</span>
          <span>01 73 64 56 10</span>
          <span>Mentions légales</span>
        </div>
      </div>
    ),
  },
  {
    id: "f3",
    name: "Colonnes claires",
    node: (
      <div className="bg-pierre p-5">
        <div className="grid grid-cols-3 gap-4 text-[0.6875rem] text-gris">
          {[
            ["L’agence", "117 bd Voltaire"],
            ["Contact", "01 73 64 56 10"],
            ["Légal", "Mentions légales"],
          ].map(([t, v]) => (
            <div key={t}>
              <p className="font-medium text-encre">{t}</p>
              <p className="mt-1">{v}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "f4",
    name: "Nom géant",
    node: (
      <div className="overflow-hidden border-t border-filet pt-4">
        <div className="flex justify-between text-[0.6875rem] text-gris">
          <span>117 boulevard Voltaire</span>
          <span>01 73 64 56 10</span>
        </div>
        <p className="titre mt-3 text-[3.25rem] leading-[0.8] tracking-[-0.04em] whitespace-nowrap">
          Rimbault
        </p>
      </div>
    ),
  },
  {
    id: "f5",
    name: "Bloc arrondi flottant",
    node: (
      <div className="rounded-[20px] bg-pierre p-5">
        <div className="flex items-start justify-between">
          <span className="font-medium">Cabinet Rimbault</span>
          <span className="rounded-full bg-blanc px-3 py-1 text-[0.6875rem]">
            01 73 64 56 10
          </span>
        </div>
        <p className="mt-6 text-[0.6875rem] text-gris">
          117 boulevard Voltaire · Mentions légales
        </p>
      </div>
    ),
  },
  {
    id: "f6",
    name: "Adresse et horaires",
    node: (
      <div className="grid grid-cols-2 gap-4 border-t border-encre pt-4">
        <div>
          <p className="titre text-[1.125rem] leading-tight">
            117 boulevard Voltaire
          </p>
          <p className="text-[0.75rem] text-gris">92600 Asnières-sur-Seine</p>
        </div>
        <dl className="space-y-1 text-[0.6875rem]">
          {[
            ["Mar.–ven.", "9 h – 19 h"],
            ["Samedi", "9 h – 18 h"],
            ["Lundi", "sur RDV"],
          ].map(([d, h]) => (
            <div
              key={d}
              className="flex justify-between border-b border-filet pb-1"
            >
              <dt className="text-gris">{d}</dt>
              <dd>{h}</dd>
            </div>
          ))}
        </dl>
      </div>
    ),
  },
];

/* ——— Ambiances ——— */

function Mood({
  bg,
  fg,
  muted,
  accent,
  card,
  radius,
  font,
}: {
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  card: string;
  radius: string;
  font: "serif" | "sans";
}) {
  return (
    <div
      className="p-5"
      style={{ background: bg, color: fg, borderRadius: radius }}
    >
      <p
        className={cn(
          "text-[1.375rem] leading-tight",
          font === "serif" ? "titre" : "font-semibold tracking-tight",
        )}
      >
        Nos biens
      </p>
      <p className="mt-1 text-[0.75rem]" style={{ color: muted }}>
        Cinq appartements à Asnières
      </p>
      <div
        className="mt-4 flex gap-3 p-3"
        style={{ background: card, borderRadius: radius }}
      >
        <span
          className="h-12 w-16 shrink-0 bg-[url(/maquettes/ouverture-quai-dervaux.jpg)] bg-cover"
          style={{ borderRadius: radius }}
        />
        <span className="text-[0.75rem]">
          Appartement 3 pièces
          <span className="block font-semibold">375 000 €</span>
        </span>
      </div>
      <span
        className="mt-4 inline-flex px-4 py-2 text-[0.75rem]"
        style={{ background: accent, color: bg, borderRadius: radius }}
      >
        Voir le bien
      </span>
    </div>
  );
}

const MOODS: Sample[] = [
  {
    id: "a1",
    name: "Clair et neutre",
    node: (
      <Mood
        bg="#ffffff"
        fg="#1f1f1f"
        muted="#7a7a7a"
        accent="#1f1f1f"
        card="#f4f4f4"
        radius="10px"
        font="sans"
      />
    ),
  },
  {
    id: "a2",
    name: "Sombre",
    dark: true,
    node: (
      <Mood
        bg="#1c1a19"
        fg="#f3efea"
        muted="#a39d97"
        accent="#f3efea"
        card="#2a2725"
        radius="10px"
        font="serif"
      />
    ),
  },
  {
    id: "a3",
    name: "Chaud",
    node: (
      <Mood
        bg="#f4efe8"
        fg="#2b211e"
        muted="#8a7c73"
        accent="#7f1a24"
        card="#ffffff"
        radius="14px"
        font="serif"
      />
    ),
  },
  {
    id: "a4",
    name: "Très contrasté",
    node: (
      <Mood
        bg="#ffffff"
        fg="#000000"
        muted="#555555"
        accent="#000000"
        card="#ffffff"
        radius="0px"
        font="serif"
      />
    ),
  },
];

const ROWS: Row[] = [
  {
    id: "boutons",
    title: "Boutons",
    hint: "Survolez-les : certains ont un mouvement.",
    cols: "sm:grid-cols-2 lg:grid-cols-4",
    samples: BUTTONS,
  },
  {
    id: "recherche",
    title: "Section « Vous ne trouvez pas votre bien ? »",
    hint: "Même contenu, six présentations.",
    cols: "md:grid-cols-2 lg:grid-cols-3",
    samples: SEARCH,
  },
  {
    id: "pied",
    title: "Pied de page",
    hint: "En miniature.",
    cols: "md:grid-cols-2 lg:grid-cols-3",
    samples: FOOTERS,
  },
  {
    id: "ambiance",
    title: "Ambiance générale",
    hint: "Couleurs, arrondis, typographie.",
    cols: "sm:grid-cols-2 lg:grid-cols-4",
    samples: MOODS,
  },
];

export function TasteBoard() {
  const [picked, setPicked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setPicked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const summary = ROWS.map((row) => {
    const names = row.samples
      .filter((s) => picked.includes(s.id))
      .map((s) => s.name);
    return `${row.title} : ${names.length ? names.join(", ") : "aucun"}`;
  }).join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="conteneur pt-12 pb-48 md:pt-16">
      <h1 className="titre text-page leading-none">Test de goût</h1>
      <p className="mt-4 max-w-[60ch] text-gris">
        Cliquez ce qui vous plaît, autant que vous voulez, sans vous justifier.
        Les choix sont gardés dans ce navigateur. En bas, copiez le
        récapitulatif et renvoyez-le.
      </p>

      {ROWS.map((row) => (
        <section key={row.id} className="mt-16">
          <h2 className="titre text-intertitre">{row.title}</h2>
          <p className="text-mention text-gris">{row.hint}</p>
          <div className={cn("mt-5 grid gap-4", row.cols)}>
            {row.samples.map((s) => {
              const on = picked.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(s.id)}
                  className={cn(
                    "relative flex min-h-36 flex-col rounded-[12px] border bg-blanc p-4 text-left transition-[border-color,box-shadow] duration-200",
                    on
                      ? "border-rouge shadow-[0_0_0_3px_rgb(127_26_36/0.15)]"
                      : "border-filet hover:border-gris",
                  )}
                >
                  <span className="flex flex-1 items-center justify-center py-3 [&>*]:w-full [&>span]:w-auto">
                    {s.node}
                  </span>
                  <span className="mt-3 flex items-center justify-between text-mention">
                    <span className={on ? "text-encre" : "text-gris"}>
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border transition-colors",
                        on
                          ? "border-rouge bg-rouge text-blanc"
                          : "border-filet",
                      )}
                      aria-hidden
                    >
                      {on && <Check size={13} />}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-filet bg-blanc/95 backdrop-blur">
        <div className="conteneur flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-mention text-gris">
            {picked.length} choix sélectionné{picked.length > 1 ? "s" : ""}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPicked([]);
                try {
                  window.localStorage.removeItem(STORAGE_KEY);
                } catch {}
              }}
              className="text-mention text-gris hover:text-encre"
            >
              Tout effacer
            </button>
            <button
              type="button"
              onClick={copy}
              className="rounded-full bg-encre px-5 py-2.5 text-[0.875rem] font-medium text-blanc"
            >
              {copied ? "Copié" : "Copier mes choix"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
