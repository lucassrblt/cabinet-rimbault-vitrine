import { Pencil, Phone } from "lucide-react";
import Link from "next/link";
import { AGENT } from "@/lib/config/agent";

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-subtle bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      <a
        href={`tel:${AGENT.phoneE164}`}
        aria-label="Appeler l'agence"
        className="flex items-center justify-center gap-2 py-3 text-sm font-medium"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Appeler
      </a>
      <Link
        href="/estimation"
        aria-label="Estimer mon bien gratuitement"
        className="flex items-center justify-center gap-2 bg-primary-600 py-3 text-sm font-medium text-on-primary"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
        Estimer
      </Link>
    </div>
  );
}
