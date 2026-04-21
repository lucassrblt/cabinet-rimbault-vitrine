export interface Review {
  id: string;
  author: string;
  commune: string | null;
  rating: 1 | 2 | 3 | 4 | 5;
  transaction: "Vendu" | "Acheté" | "Loué" | null;
  date: string;
  excerpt: string;
}

// Source : Google Business Profile. Au MVP, pas de fallback : si le tableau
// est vide (ou < 5 sur la home, < 6 sur /a-propos), la section est masquée.
export const REVIEWS: Review[] = [];
