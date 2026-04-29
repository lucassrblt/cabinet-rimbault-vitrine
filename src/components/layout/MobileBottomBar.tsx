import { Pencil, Phone } from "lucide-react";
import Link from "next/link";
import { AGENT } from "@/lib/config/agent";

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-subtle bg-card md:hidden">
      <a
        href={`tel:${AGENT.phoneE164}`}
        className="flex items-center justify-center gap-2 py-3 text-sm font-medium"
      >
        <Phone className="h-4 w-4" />
        Appeler
      </a>
      <Link
        href="/estimation"
        className="flex items-center justify-center gap-2 bg-primary-600 py-3 text-sm font-medium text-on-primary"
      >
        <Pencil className="h-4 w-4" />
        Estimer
      </Link>
    </div>
  );
}
