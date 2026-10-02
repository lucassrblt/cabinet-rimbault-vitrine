// Horaires de l'agence (à confirmer par l'agent, cf. docs/brief.md §9).
// Jours : 0 = dimanche … 6 = samedi. Heures décimales, heure de Paris.
type Day = { open: number; close: number } | "rdv" | null;

const SCHEDULE: Record<number, Day> = {
  0: null,
  1: "rdv",
  2: { open: 9, close: 19 },
  3: { open: 9, close: 19 },
  4: { open: 9, close: 19 },
  5: { open: 9, close: 19 },
  6: { open: 9, close: 18 },
};

const DAY_NAMES = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

function hourLabel(h: number) {
  const minutes = Math.round((h % 1) * 60);
  return minutes
    ? `${Math.floor(h)} h ${String(minutes).padStart(2, "0")}`
    : `${Math.floor(h)} h`;
}

export type OpeningStatus = { open: boolean; label: string };

/** Prochaine ouverture après le jour `from` (exclu). */
function nextOpening(from: number) {
  for (let i = 1; i <= 7; i++) {
    const day = (from + i) % 7;
    const slot = SCHEDULE[day];
    if (slot && slot !== "rdv") {
      const when = i === 1 ? "demain" : DAY_NAMES[day];
      return `réouverture ${when} à ${hourLabel(slot.open)}`;
    }
  }
  return "";
}

/** Statut affiché dans l'affichette, calculé à l'heure de Paris. */
export function openingStatus(date = new Date()): OpeningStatus {
  const paris = new Date(
    date.toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  const day = paris.getDay();
  const hour = paris.getHours() + paris.getMinutes() / 60;
  const slot = SCHEDULE[day];

  if (slot === "rdv")
    return {
      open: false,
      label: `Aujourd’hui sur rendez-vous, ${nextOpening(day)}`,
    };
  if (!slot)
    return { open: false, label: `Fermé aujourd’hui, ${nextOpening(day)}` };
  if (hour < slot.open)
    return {
      open: false,
      label: `Ouvre aujourd’hui à ${hourLabel(slot.open)}`,
    };
  if (hour < slot.close)
    return {
      open: true,
      label: `Ouvert aujourd’hui jusqu’à ${hourLabel(slot.close)}`,
    };
  return { open: false, label: `Fermé, ${nextOpening(day)}` };
}
