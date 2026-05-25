import { ContactProvider } from "@/components/contact/ContactProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ContactProvider>
      <SmoothScroll>
        {/* pb : hauteur de la MobileBottomBar + safe-area iPhone (annulé en md). */}
        <div className="flex min-h-full flex-1 flex-col pt-20 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <MobileBottomBar />
        </div>
      </SmoothScroll>
    </ContactProvider>
  );
}
