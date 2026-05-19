import { HandHeart, Handshake, Search, ShieldCheck, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface ReassuranceItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const SALE_ITEMS: ReassuranceItem[] = [
  {
    icon: HandHeart,
    title: "Conseil personnalisé",
    description:
      "Nous prenons le temps de comprendre votre projet et vos besoins.",
  },
  {
    icon: Search,
    title: "Sélection rigoureuse",
    description:
      "Des biens visités et sélectionnés avec soin pour leur qualité et leur potentiel.",
  },
  {
    icon: Handshake,
    title: "Négociation juste",
    description:
      "Nous défendons vos intérêts pour obtenir le meilleur prix dans les meilleures conditions.",
  },
  {
    icon: Users,
    title: "Accompagnement complet",
    description:
      "De la première visite à la signature chez le notaire, nous restons à vos côtés.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & sérénité",
    description:
      "Un interlocuteur unique et une gestion transparente de votre dossier.",
  },
];

const RENT_ITEMS: ReassuranceItem[] = [
  {
    icon: HandHeart,
    title: "Écoute attentive",
    description:
      "Nous comprenons vos critères pour cibler les biens qui vous correspondent.",
  },
  {
    icon: Search,
    title: "Biens vérifiés",
    description:
      "Chaque logement est contrôlé : diagnostics, conformité, état des lieux.",
  },
  {
    icon: Handshake,
    title: "Dossier accompagné",
    description:
      "Nous vous guidons dans la constitution d'un dossier solide et complet.",
  },
  {
    icon: Users,
    title: "Réactivité",
    description: "Réponse sous 48 à 72 h et organisation rapide des visites.",
  },
  {
    icon: ShieldCheck,
    title: "Transparence totale",
    description:
      "Honoraires clairs, état des lieux rigoureux, gestion sans surprise.",
  },
];

export function ListingReassurance({ mode }: { mode: "sale" | "rent" }) {
  const items = mode === "sale" ? SALE_ITEMS : RENT_ITEMS;
  const eyebrow = mode === "sale" ? "Pour bien acheter" : "Pour bien louer";

  return (
    <section className="bg-cream-light">
      <div className="mx-auto w-full max-w-6xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeader
          eyebrow={eyebrow}
          title="Un accompagnement à chaque étape."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5">
          {items.map((item, i) => (
            <ScrollReveal
              key={item.title}
              delay={0.15 + i * 0.08}
              className={`flex flex-col items-center px-6 py-10 text-center ${
                i < items.length - 1
                  ? "border-b border-neutral-200/70 md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <item.icon
                className="h-10 w-10 text-primary-600"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
