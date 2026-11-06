import { PageTransition } from "@/components/motion/PageTransition";

// Lot I (Iniesta) : fondu du contenu du <main> entre deux pages, brief §7.
// Le <main> lui-même appartient à (site)/layout.tsx ; seul son contenu
// participe à la transition.

export default function SiteTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PageTransition>{children}</PageTransition>;
}
