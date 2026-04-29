import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function AlertCtaSection() {
  return (
    <section className="bg-primary-600">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 items-center md:grid-cols-[1fr_auto]">
            <div className="py-12 md:py-16">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-white md:text-3xl">
                Vous ne trouvez pas le bien idéal ?
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-100">
                Recevez en avant-première nos nouveaux biens correspondant à vos
                critères.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/50 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  Créer une alerte
                  <Bell className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="relative hidden h-full min-h-[200px] w-[340px] md:block">
              <Image
                src="/hero-home.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="340px"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
