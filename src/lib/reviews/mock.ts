import type { GoogleReview, ReviewsData } from "./types";

/**
 * Repli **développement uniquement**.
 *
 * Servies par `getReviewsData()` (cf. `./index`) quand la clé Google n'est pas
 * configurée et que `NODE_ENV !== "production"` — afin de garder l'itération
 * design possible en local. Ces données ne sont jamais affichées en production.
 */

const MOCK_REVIEWS: GoogleReview[] = [
  {
    id: "g1",
    authorName: "Claire Fontaine",
    rating: 5,
    relativeTime: "il y a 3 semaines",
    publishedAt: "2026-04-28",
    text: "Xavier nous a accompagnés pour la vente de notre appartement à Asnières. Estimation juste, photos très soignées et un vrai suivi à chaque étape. Vendu en trois semaines au prix annoncé. Un interlocuteur disponible et honnête, je recommande vivement.",
  },
  {
    id: "g2",
    authorName: "Thomas Mercier",
    rating: 5,
    relativeTime: "il y a 2 mois",
    publishedAt: "2026-03-15",
    text: "Très à l'écoute de notre recherche, Xavier a parfaitement cerné nos critères. Sa connaissance du quartier et des copropriétés a fait la différence, notamment lors de la négociation. Premier achat réussi et sans stress.",
  },
  {
    id: "g3",
    authorName: "Nadia Belkacem",
    rating: 5,
    relativeTime: "il y a 5 mois",
    publishedAt: "2025-12-10",
    text: "Après une expérience décevante avec une grande enseigne, j'ai confié la vente de mon bien à Xavier sur recommandation d'une amie. Quel changement. Tout a été clair dès le premier rendez-vous : la méthode, le calendrier, la stratégie de prix. Il ne promet pas la lune pour décrocher un mandat, il dit les choses honnêtement. Les visites étaient qualifiées, les retours systématiques, et il a négocié avec fermeté pour défendre mon prix. Vente signée chez le notaire en un peu plus de trois mois. Je ne peux que le recommander.",
  },
  {
    id: "g4",
    authorName: "Jean-Pierre Vasseur",
    rating: 4,
    relativeTime: "il y a 7 mois",
    publishedAt: "2025-10-20",
    text: "Accompagnement sérieux et conseils pertinents sur le secteur. Xavier est réactif et de bon conseil. Seul bémol, quelques délais un peu longs pour caler certaines visites en période chargée, mais rien qui remette en cause la qualité du suivi.",
  },
  {
    id: "g5",
    authorName: "Sophie Aubert",
    rating: 5,
    relativeTime: "il y a 9 mois",
    publishedAt: "2025-08-05",
    text: "Mise en location de mon studio gérée de A à Z : annonce, visites, sélection du dossier. Locataire trouvé en dix jours. Efficace et professionnel.",
  },
];

export const MOCK_REVIEWS_DATA: ReviewsData = {
  rating: 4.9,
  totalCount: 47,
  sourceUrl:
    "https://www.google.com/maps/search/?api=1&query=Cabinet+Rimbault+Asni%C3%A8res-sur-Seine",
  reviews: MOCK_REVIEWS,
};
