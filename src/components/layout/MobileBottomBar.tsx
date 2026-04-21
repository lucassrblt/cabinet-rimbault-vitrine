import { Pencil, Phone } from "lucide-react";
import Link from "next/link";

const AGENT_PHONE = "+33000000000";

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-zinc-200 bg-white md:hidden">
      <a
        href={`tel:${AGENT_PHONE}`}
        className="flex items-center justify-center gap-2 py-3 text-sm font-medium"
      >
        <Phone className="h-4 w-4" />
        Appeler
      </a>
      <Link
        href="/estimation"
        className="flex items-center justify-center gap-2 bg-zinc-900 py-3 text-sm font-medium text-white"
      >
        <Pencil className="h-4 w-4" />
        Estimer
      </Link>
    </div>
  );
}
