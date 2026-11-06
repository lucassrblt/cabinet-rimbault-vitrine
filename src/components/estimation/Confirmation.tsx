"use client";

import { useEffect, useRef } from "react";
import { ConfirmationCheck } from "@/components/motion/ConfirmationCheck";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { type DataItem, DataList } from "@/components/ui/DataList";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import {
  placeLabel,
  preferenceText,
  propertySummary,
} from "@/lib/estimation/recap";
import {
  type EstimationState,
  INTENT_LABELS,
} from "@/lib/forms/estimation-schema";
import { normalizeEmail } from "@/lib/forms/validators";

// Écran de confirmation (doc 04 §3.6, doc 03 §6.3) : même URL, il remplace
// le formulaire. Colonne centrée, coche tracée une fois (Iniesta), focus sur
// le h1. Aucun délai de réponse n'est annoncé tant qu'il n'est pas validé
// par l'agent (brief §10-9).

export function Confirmation({ state }: { state: EstimationState }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    titleRef.current?.focus();
  }, []);

  const items: DataItem[] = [
    { label: "À estimer", value: INTENT_LABELS[state.intent] },
    { label: "Bien", value: propertySummary(state) },
  ];
  const where = [state.address.trim(), placeLabel(state)]
    .filter((part) => part !== "")
    .join(", ");
  if (where) items.push({ label: "Adresse", value: where });

  const how = preferenceText(state);
  const object =
    state.intent === "ESTIMATION_LOYER" ? "du loyer" : "du prix de vente";

  return (
    <Container className="pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mv-apparition mx-auto max-w-[640px]">
        <div className="text-center">
          <ConfirmationCheck taille={40} className="mx-auto" />
          <h1 ref={titleRef} tabIndex={-1} className="t-h1 mt-6 text-balance">
            Votre demande est bien arrivée.
          </h1>
          <p className="t-chapo mt-4 text-encre-douce">
            Merci, {state.firstName.trim()}. Un e-mail de confirmation vient de
            vous être envoyé à{" "}
            <span className="text-encre [overflow-wrap:anywhere]">
              {normalizeEmail(state.email)}
            </span>
            .
          </p>
        </div>

        <DataList items={items} className="mt-10" />

        <h2 className="t-h3 mt-12">Ce qui va se passer</h2>
        {/* Même convention que les déroulés de Vendre et Louer
            (owners/StepsList) : chiffre sans point en Hanken 500, colonne de
            2 rem, texte aligné sur le bord gauche du tableau et du titre. */}
        <ol className="mt-4 border-filet border-b [counter-reset:etape]">
          {[
            `Nous vous recontactons${how ? ` ${how}` : ""} pour convenir d’une visite.`,
            "Nous visitons le bien avec vous.",
            `Nous vous donnons notre estimation ${object}, et ce sur quoi elle repose.`,
          ].map((step) => (
            <li
              key={step}
              className="t-ui grid grid-cols-[2rem_minmax(0,1fr)] items-baseline border-filet border-t py-4 [counter-increment:etape] before:font-medium before:font-sans before:text-[15px] before:text-encre before:tabular-nums before:content-[counter(etape)] md:grid-cols-[2.5rem_minmax(0,1fr)]"
            >
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <p className="t-ui mt-10 text-encre-douce">
          Une question d’ici là&#8239;? Appelez-nous au{" "}
          <TextLink
            href={agency.phone.href}
            className="chiffres whitespace-nowrap"
          >
            {agency.phone.display}
          </TextLink>
          .
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <ButtonLink href="/" variant="secondaire">
            Retour à l’accueil
          </ButtonLink>
          <TextLink href="/biens" className="t-ui self-start sm:self-auto">
            Voir nos biens
          </TextLink>
        </div>
      </div>
    </Container>
  );
}
