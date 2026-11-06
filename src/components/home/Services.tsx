import { fr } from "@/components/owners/typo";
import { TextLink } from "@/components/ui/TextLink";
import { HomeSection } from "./HomeSection";

// Ce que nous faisons (doc 04 §2.1-3) : les trois métiers en texte, sans
// tuile ni icône, séparés par des filets, sans numéro (A15). Les phrases ne
// disent que ce qui est établi ailleurs sur le site (Vendre, Louer) : rien
// sur la gratuité de l'estimation, un avis de valeur écrit ou le périmètre
// exact de la location, tant que l'agent ne l'a pas confirmé (brief §10-9,
// §10-10).

const SERVICES = [
  {
    title: "Vente",
    text: "Nous vendons des appartements et des maisons à Asnières-sur-Seine et dans les communes voisines, de la première visite jusqu'à la signature chez le notaire.",
    href: "/vendre",
    link: "Vendre avec nous",
  },
  {
    title: "Location",
    text: "Pour les propriétaires, nous estimons le loyer, trouvons le locataire et préparons le bail.",
    href: "/louer",
    link: "Louer avec nous",
  },
  {
    title: "Estimation",
    text: "Nous ne donnons pas de prix en ligne. Nous venons voir votre bien, puis nous vous disons à quel prix nous pensons pouvoir le vendre, ou à quel loyer le louer.",
    href: "/estimation",
    link: "Faire estimer",
  },
] as const;

export function Services() {
  return (
    <HomeSection id="metiers" title="Ce que nous faisons">
      <ul className="border-filet border-b">
        {SERVICES.map((service) => (
          <li
            key={service.title}
            className="grid gap-y-3 border-filet border-t py-8 md:grid-cols-8 md:gap-x-6 md:py-10"
          >
            <h3 className="t-h3 md:col-span-2">{service.title}</h3>
            <div className="md:col-span-6">
              <p className="t-texte mesure">{fr(service.text)}</p>
              <p className="t-ui mt-4">
                <TextLink href={service.href} className="hyphens-manual">
                  {service.link}
                </TextLink>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
