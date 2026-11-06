import { Logotype } from "@/components/brand/Logotype";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Grid } from "@/components/ui/Grid";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { getGoogleReviews } from "@/lib/reviews/google";
import { FOOTER_INFO_NAV, FOOTER_SITE_NAV } from "./navigation";
import { ProfessionalInfo } from "./ProfessionalInfo";
import { cityLine, formatRating, hoursLine, streetLine } from "./typo";

// Pied de page (brief A20, doc 03 §6.10, doc 04 §4.2). Seul aplat grenat du
// site. Dans l'ordre : phrase ; trois colonnes Nous trouver, Le
// site, Informations ; filet crème à 22 % puis mentions professionnelles en
// pleine largeur ; logotype crème (A26) et « © 2009-<année> Cabinet
// Rimbault ». Le logotype signe le bas du pied : au-dessus de la phrase, qui
// commence par le nom du cabinet, il l'aurait répété deux fois de suite.
// La note Google vient de l'API Places (mise en cache 24 h, ne lève jamais),
// avec repli sur agency.ts.

const NOTE_DEUX_POINTS = " :";

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-full md:col-span-4">
      <h2 className="t-nav text-grenat-sur-fond">{title}</h2>
      <div className="mt-3 font-sans text-[15px] leading-6">{children}</div>
    </div>
  );
}

export async function SiteFooter() {
  const reviews = await getGoogleReviews();
  const rating = reviews ? formatRating(reviews.rating) : agency.google.rating;
  const count = reviews ? reviews.totalCount : agency.google.count;
  const reviewsHref =
    reviews?.sourceUrl ?? agency.google.profileUrl ?? agency.google.href;
  const year = new Date().getFullYear();

  return (
    <footer
      id="pied"
      className="sur-grenat bg-grenat pt-16 pb-8 text-creme md:pt-24"
    >
      <Container>
        <p className="t-h2 max-w-[16em] text-balance">
          {agency.name}, transactions immobilières à{"\u00A0"}
          <span className="whitespace-nowrap">{agency.address.city}</span>{" "}
          depuis {agency.since}.
        </p>

        <Grid className="mt-12 gap-y-10 md:mt-16">
          <Column title="Nous trouver">
            <address>
              {streetLine()}
              <br />
              {cityLine()}
            </address>
            <p className="mt-2">
              <TextLink
                href={agency.phone.href}
                variant="discret"
                className="chiffres whitespace-nowrap"
              >
                {agency.phone.display}
              </TextLink>
            </p>
            {agency.hoursConfirmed ? (
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4">
                {agency.hours.map((line) => (
                  <div key={line.days} className="contents">
                    <dt>{line.days}</dt>
                    <dd className="chiffres">{hoursLine(line.time)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </Column>

          <Column title="Le site">
            <ul className="space-y-1">
              {FOOTER_SITE_NAV.map((entry) => (
                <li key={entry.href}>
                  <TextLink href={entry.href} variant="discret">
                    {entry.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Informations">
            <ul className="space-y-1">
              {FOOTER_INFO_NAV.map((entry) => (
                <li key={entry.href}>
                  <TextLink href={entry.href} variant="discret">
                    {entry.label}
                  </TextLink>
                </li>
              ))}
              <li>
                <TextLink href={reviewsHref} variant="discret">
                  Avis Google{NOTE_DEUX_POINTS} {rating}
                  {" "}sur 5, {count}
                  {" "}avis
                </TextLink>
              </li>
            </ul>
          </Column>
        </Grid>

        <Divider tone="sur-grenat" className="mt-12 md:mt-16" />
        <ProfessionalInfo className="mt-6 text-grenat-sur-fond" />
        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Logotype tone="creme" className="h-auto w-[158px] md:w-[182px]" />
          <p className="t-legal chiffres text-grenat-sur-fond">
            © {agency.since}-{year} {agency.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
