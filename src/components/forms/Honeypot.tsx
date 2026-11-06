"use client";

import { useEffect, useState } from "react";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/forms/spam";

// Anti-spam des formulaires (doc 04 §3.5) : un champ piège que seul un robot
// remplit, et l'heure d'affichage du formulaire.
//
// L'heure est écrite au rendu (HTML statique : heure de génération, donc un
// envoi sans JavaScript passe), puis remplacée au montage par l'heure réelle
// d'affichage dans le navigateur : un envoi moins de 4 s après est refusé
// en silence par la Server Action. Le champ est contrôlé : la remise à zéro
// du formulaire par React après un envoi (React 19) ne doit pas le rajeunir,
// sinon un second essai après un échec de l'API passerait pour un robot.

export function Honeypot() {
  const [startedAt, setStartedAt] = useState(() => String(Date.now()));

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir ce champ</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input
        type="hidden"
        name={STARTED_AT_FIELD}
        value={startedAt}
        suppressHydrationWarning
      />
    </>
  );
}
