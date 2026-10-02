import { Motion } from "@/components/site/Motion";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StyleSwitcher } from "@/components/site/StyleSwitcher";

export default function MaquettesLayout({
  children,
}: LayoutProps<"/maquettes">) {
  return (
    <>
      <SiteHeader base="/maquettes" />
      {children}
      <SiteFooter />
      <Motion />
      <StyleSwitcher />
    </>
  );
}
