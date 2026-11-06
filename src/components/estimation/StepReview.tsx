"use client";

import { CircleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { DataList } from "@/components/ui/DataList";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { buildRecap } from "@/lib/estimation/recap";
import type { EstimationStep } from "@/lib/forms/estimation-schema";
import { MESSAGES } from "@/lib/forms/validators";
import { fieldId, StepHeading, type StepProps } from "./shared";

// Étape 4, vérification et envoi (doc 04 §3.3, §3.5 ; doc 03 §6.3) :
// récapitulatif en trois blocs modifiables, consentement RGPD non coché et
// obligatoire juste au-dessus du bouton, bandeau si l'envoi échoue.

type Props = StepProps & {
  onEdit: (step: EstimationStep) => void;
  /** Échec d'envoi : change à chaque tentative (reprise du focus). */
  failedAt: number | null;
};

function SendFailed({ at }: { at: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: le focus est repris à chaque échec.
  useEffect(() => {
    ref.current?.focus();
  }, [at]);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="ui-resume mb-8 flex gap-2 text-erreur"
    >
      <CircleAlert
        aria-hidden="true"
        strokeWidth={1.5}
        className="mt-1 size-4 flex-none"
      />
      <p className="t-ui font-medium">{MESSAGES.sendFailed}</p>
    </div>
  );
}

export function StepReview({
  state,
  errors,
  update,
  summary,
  onEdit,
  failedAt,
}: Props) {
  const sections = buildRecap(state);
  return (
    <>
      <StepHeading
        title="Vérifiez votre demande"
        intro="Relisez vos réponses avant l’envoi. Chaque partie reste modifiable."
        summary={summary}
      />
      {failedAt !== null ? <SendFailed at={failedAt} /> : null}
      <div className="space-y-10">
        {sections.map((section) => {
          const headingId = `recapitulatif-${section.step}`;
          return (
            <section key={section.step} aria-labelledby={headingId}>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 id={headingId} className="t-nav text-encre">
                  {section.title}
                </h3>
                <button
                  type="button"
                  className="ui-btn ui-btn--tertiaire t-petit -my-3"
                  onClick={() => onEdit(section.step)}
                >
                  Modifier
                  <span className="sr-only">
                    {"\u202f: "}
                    {section.title.toLowerCase()}
                  </span>
                </button>
              </div>
              <DataList items={section.items} />
              {section.texts.map((text) => (
                <div key={text.label} className="mt-4">
                  <p className="t-petit text-encre-douce">{text.label}</p>
                  <p className="t-ui mt-1 whitespace-pre-line break-words">
                    {text.value}
                  </p>
                </div>
              ))}
            </section>
          );
        })}
      </div>
      <div className="mt-10">
        <Checkbox
          id={fieldId("rgpd")}
          name="rgpd"
          checked={state.rgpd}
          error={errors.rgpd}
          aria-describedby={[
            errors.rgpd ? `${fieldId("rgpd")}-erreur` : null,
            `${fieldId("rgpd")}-precision`,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-required
          onChange={(event) => update({ rgpd: event.target.checked })}
        >
          Vous acceptez que le {agency.name} utilise ces informations pour vous
          recontacter au sujet de cette estimation. Elles ne sont ni cédées ni
          utilisées à d’autres fins.
        </Checkbox>
        <p
          id={`${fieldId("rgpd")}-precision`}
          className="ui-aide mt-2 pl-[30px]"
        >
          Vous pouvez les faire rectifier ou supprimer à tout moment
          {agency.email ? (
            <>
              {" "}
              en écrivant à{" "}
              <TextLink href={`mailto:${agency.email}`}>
                {agency.email}
              </TextLink>
            </>
          ) : null}
          . Le détail est dans notre{" "}
          <TextLink href="/confidentialite">
            politique de confidentialité
          </TextLink>
          .
        </p>
      </div>
    </>
  );
}
