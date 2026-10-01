import Link from "next/link";
import { getProperties } from "@/lib/api/properties";

export const metadata = { title: "Explorations visuelles" };

export default async function Explorations() {
  const properties = await getProperties();
  const sample = properties[0]?.reference;

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 font-sans">
      <h1 className="text-2xl font-semibold">Explorations visuelles</h1>
      <p className="mt-2 text-neutral-600">
        Deux directions sur le même brief, avec les biens réels de l’API.
      </p>
      {[
        {
          id: "a",
          name: "A. L’enseigne",
          text: "Le bandeau rouge de la devanture devient l’en-tête. Serif classique modernisé, très sobre en dessous.",
        },
        {
          id: "b",
          name: "B. Le plan",
          text: "Typographie d’architecte, chiffres en grand, le losange rouge de la façade comme seul ornement.",
        },
      ].map((d) => (
        <section key={d.id} className="mt-10 border-t border-neutral-200 pt-6">
          <h2 className="text-lg font-semibold">{d.name}</h2>
          <p className="mt-1 text-neutral-600">{d.text}</p>
          <ul className="mt-3 flex gap-6 underline underline-offset-4">
            <li>
              <Link href={`/exploration/${d.id}`}>Accueil</Link>
            </li>
            {sample && (
              <li>
                <Link href={`/exploration/${d.id}/biens/${sample}`}>
                  Fiche bien
                </Link>
              </li>
            )}
          </ul>
        </section>
      ))}
    </main>
  );
}
