import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function PropertyEstimationCTA() {
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <div className="relative overflow-hidden rounded-sm bg-inverse text-on-inverse">
          {/* Decorative photo — right side, masked into the panel */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[44%] bg-cover bg-center md:block"
            style={{
              backgroundImage: "url(/hero-agence.jpg)",
            }}
          />
          {/* Soft gradient bridging text → photo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(28,27,25,1) 0%, rgba(28,27,25,1) 52%, rgba(28,27,25,0.88) 60%, rgba(28,27,25,0.55) 70%, rgba(28,27,25,0.18) 84%, rgba(28,27,25,0) 100%)",
            }}
          />
          {/* Mobile soft photo header */}
          <div
            aria-hidden="true"
            className="aspect-[16/8] w-full bg-cover bg-center md:hidden"
            style={{
              backgroundImage: "url(/hero-agence.jpg)",
            }}
          />
          {/* Burgundy hairline accent — signature gesture */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 hidden h-full w-px bg-primary-600 md:block"
          />

          <div className="relative grid grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1fr_auto] md:items-end md:px-12 md:py-14 lg:px-16 lg:py-16">
            <div className="md:max-w-xl">
              <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-200">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-6 bg-primary-300"
                />
                Vous vendez&nbsp;?
              </span>
              <h2 className="mt-4 font-display text-3xl leading-[1.05] tracking-tight md:text-[2.6rem] lg:text-5xl">
                Estimez votre bien
                <span className="block italic text-primary-200">
                  en quelques minutes.
                </span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-on-inverse/80 md:text-base">
                Nos estimations sont gratuites et sans engagemen. Nous vous
                répondons dans les meilleurs délais.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <Link
                href="/estimation"
                className="group inline-flex items-center justify-center gap-2 rounded-sm bg-primary-600 px-5 py-3 text-sm font-semibold text-on-primary transition-all hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-inverse)]"
              >
                Demander une estimation
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-on-inverse/50">
                Gratuit · sans engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
