/// <reference types="react/canary" />

import { ViewTransition } from "react";
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
        <div className="flex min-h-full flex-1 flex-col pt-20 pb-14 md:pb-0">
          <Header />
          <div className="flex flex-1 flex-col">
            <ViewTransition>{children}</ViewTransition>
          </div>
          <Footer />
          <MobileBottomBar />
        </div>
      </SmoothScroll>
    </ContactProvider>
  );
}
