"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: "actuelle", name: "Actuelle" },
  { id: "stricte", name: "Stricte" },
  { id: "nuancee", name: "Nuancée" },
];
const KEY = "style-maquette";

/** Bascule entre les styles à comparer ; le choix suit la navigation. */
export function StyleSwitcher() {
  const [current, setCurrent] = useState("actuelle");

  useEffect(() => {
    setCurrent(document.documentElement.dataset.style ?? "actuelle");
  }, []);

  const apply = (id: string) => {
    if (id === "actuelle") delete document.documentElement.dataset.style;
    else document.documentElement.dataset.style = id;
    try {
      window.localStorage.setItem(KEY, id);
    } catch {}
    setCurrent(id);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-encre/92 p-1 text-[0.8125rem] text-blanc shadow-[0_12px_30px_-12px_rgb(36_31_30/0.6)] backdrop-blur-md md:bottom-6">
      <span className="px-3 text-blanc/60">Style</span>
      {STYLES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => apply(s.id)}
          aria-pressed={current === s.id}
          className={cn(
            "rounded-full px-3.5 py-1.5 transition-colors",
            current === s.id ? "bg-blanc text-encre" : "hover:bg-blanc/15",
          )}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
