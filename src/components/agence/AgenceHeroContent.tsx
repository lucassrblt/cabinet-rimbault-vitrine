"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  } as const;
}

export function AgenceHeroContent({
  badgeLabel,
  tagline,
  subtitle,
  ctaLabel,
  ctaHref,
}: {
  badgeLabel: string;
  tagline: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col justify-end px-4 pb-20 pt-14 md:px-6 md:pb-24">
      <motion.span
        {...reveal(0)}
        className="absolute left-4 top-6 inline-block rounded-sm bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white md:left-6 md:top-8 md:text-xs"
      >
        {badgeLabel}
      </motion.span>

      <motion.h1
        {...reveal(0.2)}
        className="max-w-2xl whitespace-pre-line font-serif text-4xl font-semibold leading-[1.1] text-white md:text-5xl lg:text-display"
      >
        {tagline}
      </motion.h1>

      <motion.p
        {...reveal(0.4)}
        className="mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg"
      >
        {subtitle}
      </motion.p>

      <motion.div {...reveal(0.6)} className="mt-8">
        <LinkButton href={ctaHref}>{ctaLabel}</LinkButton>
      </motion.div>

      <motion.div
        {...reveal(0.8)}
        className="absolute inset-x-0 bottom-6 flex justify-center"
      >
        <a
          href="#notre-histoire"
          aria-label="Défiler vers le contenu"
          className="animate-bounce text-white/60 transition-colors hover:text-white"
        >
          <ChevronDown className="h-7 w-7" />
        </a>
      </motion.div>
    </div>
  );
}
