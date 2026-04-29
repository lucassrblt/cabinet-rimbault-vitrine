import { HandHeart, Handshake, Search, ShieldCheck, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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
    <section className="border-t border-subtle bg-header">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Un accompagnement à chaque étape.
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-5">
          {items.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200">
                  <item.icon
                    className="h-6 w-6 text-neutral-500"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
