import type { Metadata } from "next";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import {
  ContactHero,
  type ContactHeroVariant,
} from "@/components/contact/ContactHero";
import { ContactMap } from "@/components/contact/ContactMap";
import { ContactReassuranceBar } from "@/components/contact/ContactReassuranceBar";
import { ContactSidebar } from "@/components/contact/ContactSidebar";
import { ContactForm } from "@/components/forms/ContactForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AGENT } from "@/lib/config/agent";
import type { ContactInput } from "@/lib/validation";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export const metadata: Metadata = {
  title: `Contact — Cabinet Rimbault à ${AGENT.address.city}`,
  description: `Joindre le Cabinet Rimbault : téléphone, email, adresse et horaires. Formulaire de prise de contact, réponse sous 24 h ouvrées.`,
};

const SUBJECT_VALUES: ContactInput["subject"][] = [
  "vente",
  "location",
  "estimation",
  "rdv",
  "autre",
];

function resolveSubject(
  v: string | undefined,
): ContactInput["subject"] | undefined {
  return SUBJECT_VALUES.find((s) => s === v);
}

function resolveVariant(v: string | undefined): ContactHeroVariant {
  return v === "b" ? "b" : "a";
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const rawSubject = typeof sp.subject === "string" ? sp.subject : undefined;
  const rawVariant = typeof sp.v === "string" ? sp.v : undefined;
  const defaultSubject = resolveSubject(rawSubject);
  const defaultReference = typeof sp.ref === "string" ? sp.ref : undefined;
  const variant = resolveVariant(rawVariant);

  return (
    <main className="flex flex-1 flex-col">
      <ContactHero variant={variant} />
      <ContactReassuranceBar />

      <section id="formulaire" className="bg-cream">
        <div className="mx-auto w-full max-w-6xl px-gutter py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.6fr_1fr] md:gap-14">
            <div>
              <SectionHeader
                eyebrow="Nous écrire"
                title="Votre message"
                lede="Quelques informations pour qu'on puisse préparer notre échange. Tous les champs marqués d'un astérisque sont nécessaires."
              />
              <ScrollReveal
                delay={0.2}
                className="mt-10 rounded-lg border border-subtle bg-card p-6 shadow-sm md:p-10"
              >
                <ContactForm
                  defaultSubject={defaultSubject}
                  defaultReference={defaultReference}
                />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.3}>
              <ContactSidebar />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ContactMap />
      <ContactFAQ />
    </main>
  );
}
