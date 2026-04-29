export interface Review {
  id: string;
  author: string;
  commune: string | null;
  rating: 1 | 2 | 3 | 4 | 5;
  transaction: "Vendu" | "Acheté" | "Loué" | null;
  date: string;
  excerpt: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Marie D.",
    commune: "Boulogne-Billancourt",
    rating: 5,
    transaction: "Vendu",
    date: "2026-02-15",
    excerpt:
      "Sophie nous a accompagnés de A à Z pour la vente de notre appartement. Estimation juste, photos professionnelles, et un suivi impeccable. Vendu en 3 semaines au prix demandé. Je recommande sans hésitation.",
  },
  {
    id: "r2",
    author: "Thomas L.",
    commune: "Issy-les-Moulineaux",
    rating: 5,
    transaction: "Acheté",
    date: "2026-01-22",
    excerpt:
      "Très à l'écoute de nos critères, Sophie a su nous orienter vers des biens correspondant vraiment à notre recherche. Sa connaissance du quartier a fait la différence dans la négociation.",
  },
  {
    id: "r3",
    author: "Camille et Julien R.",
    commune: "Meudon",
    rating: 5,
    transaction: "Acheté",
    date: "2025-11-08",
    excerpt:
      "Premier achat, beaucoup de questions… Sophie a pris le temps de tout nous expliquer, sans jamais nous presser. Nous avons trouvé notre maison en deux mois. Merci !",
  },
  {
    id: "r4",
    author: "Nathalie B.",
    commune: "Boulogne-Billancourt",
    rating: 5,
    transaction: "Vendu",
    date: "2025-10-03",
    excerpt:
      "Deuxième vente avec le Cabinet Rimbault. Toujours la même rigueur dans l'estimation et le même professionnalisme. Un vrai plaisir de travailler avec quelqu'un d'aussi carré.",
  },
  {
    id: "r5",
    author: "Alexandre M.",
    commune: "Sèvres",
    rating: 4,
    transaction: "Acheté",
    date: "2025-09-17",
    excerpt:
      "Bon accompagnement global, conseils pertinents sur le quartier et les copropriétés. Seul petit bémol : un délai un peu long pour organiser certaines visites, mais rien de bloquant.",
  },
  {
    id: "r6",
    author: "Émilie V.",
    commune: "Issy-les-Moulineaux",
    rating: 5,
    transaction: "Loué",
    date: "2025-08-25",
    excerpt:
      "Location trouvée en moins de deux semaines. Sophie a été très réactive et le dossier a été traité rapidement. Appartement conforme aux photos, pas de mauvaise surprise.",
  },
  {
    id: "r7",
    author: "Laurent P.",
    commune: "Clamart",
    rating: 5,
    transaction: "Vendu",
    date: "2025-07-12",
    excerpt:
      "Après une première expérience décevante avec un réseau de mandataires, j'ai confié la vente à Sophie. Résultat : vendu en 5 semaines, avec un accompagnement irréprochable jusqu'à la signature.",
  },
  {
    id: "r8",
    author: "Sarah K.",
    commune: "Boulogne-Billancourt",
    rating: 5,
    transaction: "Acheté",
    date: "2025-06-30",
    excerpt:
      "Connaissance exceptionnelle du marché boulonnais. Sophie savait exactement quels immeubles correspondaient à nos critères. Transaction fluide et sans stress.",
  },
  {
    id: "r9",
    author: "Marc et Céline G.",
    commune: "Vanves",
    rating: 5,
    transaction: "Vendu",
    date: "2025-05-18",
    excerpt:
      "Estimation réaliste dès le départ, pas de promesses en l'air. Le bien a été vendu au prix estimé. Communication claire à chaque étape. On referait appel à elle sans hésiter.",
  },
  {
    id: "r10",
    author: "Olivier T.",
    commune: "Meudon",
    rating: 5,
    transaction: "Loué",
    date: "2025-04-05",
    excerpt:
      "Mise en location de mon studio : photos, annonce et sélection des dossiers gérés de main de maître. Locataire trouvé en 10 jours. Très satisfait du service.",
  },
];
