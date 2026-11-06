// Anti-spam des formulaires (doc 04 §3.5) : champ piège + délai minimal.
// En cas de spam présumé, la Server Action répond « succès » sans appeler l'API.
// Pur, utilisable côté client (noms de champs) et serveur (décision).

/** Champ piège, rendu hors écran (`aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`). */
export const HONEYPOT_FIELD = "site_web";

/** Horodatage (ms depuis l'epoch) du premier affichage du formulaire. */
export const STARTED_AT_FIELD = "form_started_at";

/** Un envoi plus rapide que ce délai est considéré comme automatique. */
export const MIN_FILL_MS = 4_000;

export type SpamCheck = {
  honeypot: string;
  /** Valeur brute du champ `form_started_at`. */
  startedAt: string;
  now?: number;
};

/**
 * Vrai si l'envoi ressemble à un robot : champ piège rempli, horodatage absent
 * ou illisible, ou envoi moins de 4 s après l'affichage.
 */
export function isLikelySpam({
  honeypot,
  startedAt,
  now = Date.now(),
}: SpamCheck): boolean {
  if (honeypot.trim() !== "") return true;
  const started = Number(startedAt);
  if (!Number.isFinite(started) || started <= 0) return true;
  return now - started < MIN_FILL_MS;
}

/** Lecture des deux champs anti-spam depuis un FormData. */
export function spamFieldsFrom(form: FormData): SpamCheck {
  const read = (name: string) => {
    const v = form.get(name);
    return typeof v === "string" ? v : "";
  };
  return { honeypot: read(HONEYPOT_FIELD), startedAt: read(STARTED_AT_FIELD) };
}
