import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AGENT } from "@/lib/config/agent";

const ITEMS: AccordionItem[] = [
  {
    id: "deplacement",
    question: "Vous déplacez-vous pour une estimation ?",
    answer: (
      <p>
        Oui, gratuitement et sans engagement, à {AGENT.address.city} et dans les
        communes limitrophes (Gennevilliers, Colombes, Courbevoie,
        Bois-Colombes…). Nous convenons d&apos;un créneau qui vous arrange, en
        semaine ou le samedi.
      </p>
    ),
  },
  {
    id: "samedi",
    question: "L'agence est-elle ouverte le samedi ?",
    answer: (
      <p>
        Oui —{" "}
        {AGENT.hours.saturday?.toLowerCase() ?? "le samedi sur rendez-vous"}. Le
        lundi, nous restons disponibles sur rendez-vous.
      </p>
    ),
  },
  {
    id: "delai",
    question: "Sous combien de temps obtient-on un retour ?",
    answer: (
      <p>
        Toute demande adressée via le formulaire ou par email reçoit une réponse
        sous 24 h ouvrées. Pour une question urgente, le plus simple reste
        l&apos;appel au {AGENT.phoneDisplay}.
      </p>
    ),
  },
  {
    id: "preparation",
    question: "Que préparer pour un premier échange ?",
    answer: (
      <p>
        Rien d&apos;obligatoire. Pour un projet de vente ou une estimation, un
        titre de propriété, le dernier procès-verbal d&apos;AG ou des
        diagnostics récents permettent d&apos;affiner l&apos;analyse — mais nous
        pouvons aussi partir d&apos;une simple conversation.
      </p>
    ),
  },
];

export function ContactFAQ() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-gutter py-16 md:py-20">
        <SectionHeader
          eyebrow="Questions fréquentes"
          title="Avant de nous écrire"
        />
        <ScrollReveal delay={0.15} className="mt-10">
          <Accordion items={ITEMS} />
        </ScrollReveal>
      </div>
    </section>
  );
}
