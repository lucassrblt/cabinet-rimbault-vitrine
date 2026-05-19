import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  ClipboardList,
  Clock,
  PhoneCall,
  Search,
  ShieldCheck,
} from "lucide-react";

/** Micro-réassurances affichées sous le hero, près du tunnel. */
export const HERO_REASSURANCES: { icon: LucideIcon; label: string }[] = [
  { icon: BadgeCheck, label: "Gratuit" },
  { icon: ShieldCheck, label: "Sans engagement" },
  { icon: Clock, label: "Réponse rapide" },
];

/** Déroulé de l'estimation — bloc « Comment ça se passe » sous le tunnel. */
export const PROCESS_STEPS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ClipboardList,
    title: "Vous décrivez votre bien",
    description:
      "Quelques questions sur votre logement. L'adresse exacte reste confidentielle.",
  },
  {
    icon: Search,
    title: "L'agent étudie votre secteur",
    description:
      "Il analyse les ventes réelles comparables de votre quartier. Pas un algorithme : un professionnel local.",
  },
  {
    icon: PhoneCall,
    title: "L'agent vous rappelle",
    description:
      "Dans les plus brefs délais : une première fourchette de prix argumentée, les atouts de votre bien et ses conseils. Gratuit, sans engagement.",
  },
];
