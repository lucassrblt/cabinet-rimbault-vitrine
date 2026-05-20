import { Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site en cours de développement",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-gradient-to-b from-bg-page via-bg-page to-bg-section px-6 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="font-familjen text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl md:text-7xl">
          Site en cours de développement
        </h1>
        <span
          aria-hidden="true"
          className="mt-8 inline-block h-[3px] w-28 rounded-full bg-primary-600"
        />
        <p className="mt-10 max-w-xl text-base text-body sm:text-lg">
          Nous travaillons actuellement sur notre nouveau site web. Il sera
          bientôt disponible avec de nombreuses améliorations.
        </p>
        <div className="mt-20 inline-flex items-center gap-2 text-sm text-muted">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Revenez bientôt</span>
        </div>
      </div>
    </main>
  );
}
