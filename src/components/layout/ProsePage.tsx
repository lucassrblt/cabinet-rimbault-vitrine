import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { TextLink } from "@/components/ui/TextLink";

// Gabarit des pages de texte : mentions légales, confidentialité (doc 04
// §2.10, interface figée du §7). `h1`, date de mise à jour, puis le texte
// dans <Prose> (colonne de 34em, soit 60 à 72 signes). Au-delà de 4
// sections, un sommaire en ancres : à gauche en desktop (colonnes 1 à 3,
// non collant, texte sur 4 à 11), au-dessus du texte en mobile. Sans
// sommaire, titre et texte partent de la colonne 1 (alignement à gauche).
//
// Les `h2` du texte portent les `id` cités dans `toc`.

export type ProseSection = { id: string; title: string };

type ProsePageProps = {
  title: string;
  /** Date ISO « AAAA-MM-JJ » ; écrite « 31 octobre 2026 ». */
  updatedAt: string;
  /** Sections du texte, pour le sommaire (affiché au-delà de 4). */
  toc?: readonly ProseSection[];
  children: ReactNode;
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** « 1er octobre 2026 », « 31 octobre 2026 » ; null si la date est invalide. */
function formatDate(iso: string): string | null {
  const match = ISO_DATE.exec(iso);
  if (!match) return null;
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== +match[3]) {
    return null;
  }
  const parts = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);
  return parts
    .map((part) =>
      part.type === "day" && part.value === "1"
        ? "1er"
        : part.type === "literal"
          ? " "
          : part.value,
    )
    .join("");
}

export function ProsePage({ title, updatedAt, toc, children }: ProsePageProps) {
  const updated = formatDate(updatedAt);
  const showToc = toc !== undefined && toc.length > 4;
  return (
    <Container className="pt-16 pb-16 md:pt-32 md:pb-24">
      <Grid className="gap-y-10">
        <header className="col-span-full lg:col-span-8">
          <Heading level={1}>{title}</Heading>
          {updated ? (
            <p className="t-petit mt-4 text-gris">
              Mise à jour le <time dateTime={updatedAt}>{updated}</time>.
            </p>
          ) : null}
        </header>

        {showToc ? (
          <nav
            aria-labelledby="sommaire"
            className="col-span-full lg:col-span-3 lg:row-start-2"
          >
            <h2 id="sommaire" className="t-nav text-encre-douce">
              Sommaire
            </h2>
            <ol className="t-petit mt-3 space-y-2 border-l border-filet pl-4">
              {toc.map((section) => (
                <li key={section.id}>
                  <TextLink href={`#${section.id}`} variant="discret">
                    {section.title}
                  </TextLink>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Prose
          className={
            showToc
              ? "col-span-full lg:col-span-8 lg:col-start-4 lg:row-start-2"
              : "col-span-full lg:col-span-8"
          }
        >
          {children}
        </Prose>
      </Grid>
    </Container>
  );
}
