// Description normalisée (doc 04 §2.3-5, `lib/property/description.ts`) :
// paragraphes en Spectral 18/30, 34em au plus, sans « Lire la suite ».

export function PropertyDescription({
  paragraphs,
}: {
  paragraphs: readonly string[];
}) {
  if (paragraphs.length === 0) return null;
  return (
    <div className="t-texte mesure saisie space-y-[1lh] text-encre">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
