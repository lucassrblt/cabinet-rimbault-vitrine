import Link from "next/link";
import "./wf.css";

export const metadata = { title: "Wireframes" };

export default function WireframesLayout({
  children,
}: LayoutProps<"/wireframes">) {
  return (
    <div className="wf">
      <div className="flex items-center justify-between gap-4 bg-[#222] px-4 py-2 text-[0.75rem] text-white md:px-10">
        <span className="flex gap-4">
          <Link href="/wireframes/accueil" className="underline">
            Accueil
          </Link>
          <Link href="/wireframes/bien" className="underline">
            Fiche bien
          </Link>
        </span>
        <label className="flex items-center gap-2">
          <input id="wf-hide" type="checkbox" />
          Masquer les repères
        </label>
      </div>
      {children}
    </div>
  );
}
