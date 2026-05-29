import { ArrowRight, Phone } from "lucide-react";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealMask } from "@/components/ui/RevealMask";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AGENT } from "@/lib/config/agent";

export type ContactHeroVariant = "a" | "b";

const COPY: Record<
  ContactHeroVariant,
  { eyebrow: string; title: React.ReactNode; subtitle: string }
> = {
  a: {
    eyebrow: "Contact",
    title: (
      <>
        Parlons de
        <br />
        votre projet.
      </>
    ),
    subtitle:
      "Le Cabinet vous répond sous 24 h ouvrées, par téléphone, email ou directement à l'agence.",
  },
  b: {
    eyebrow: "Nous contacter",
    title: (
      <>
        Un cabinet,
        <br />
        un interlocuteur.
      </>
    ),
    subtitle: `Achat, vente, location ou simple question : nous échangeons sans engagement, à votre rythme, depuis ${AGENT.address.city}.`,
  },
};

export function ContactHero({
  variant = "a",
}: {
  variant?: ContactHeroVariant;
}) {
  const copy = COPY[variant];

  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-gutter pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:items-start md:gap-14">
          <div>
            <ScrollReveal index={0}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
                {copy.eyebrow}
              </p>
            </ScrollReveal>
            <ScrollReveal index={1} className="mt-4">
              <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-primary md:text-5xl">
                {copy.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal index={2} className="mt-6 max-w-md">
              <p className="text-base leading-relaxed text-body">
                {copy.subtitle}
              </p>
            </ScrollReveal>
            <ScrollReveal index={3} className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${AGENT.phoneE164}`}
                  className="group inline-flex items-center gap-2 rounded-sm bg-primary-600 px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-700"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Appeler {AGENT.phoneDisplay}
                </a>
                <a
                  href="#formulaire"
                  className="group inline-flex items-center gap-2 rounded-sm border border-default px-5 py-3 text-sm font-semibold text-primary transition hover:border-strong"
                >
                  Écrire un message
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <RevealMask delay={0.12} direction="left">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-subtle bg-neutral-100 md:aspect-auto md:h-[420px]">
              <ParallaxImage
                src="/hero-agence.jpg"
                alt=""
                settle={false}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </RevealMask>
        </div>
      </div>
    </section>
  );
}
