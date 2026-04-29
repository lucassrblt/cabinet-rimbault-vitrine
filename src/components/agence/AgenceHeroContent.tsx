"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  } as const;
}

export function AgenceHeroContent({
  agencyName,
  tagline,
  subtitle,
}: {
  agencyName: string;
  tagline: string;
  subtitle: string;
}) {
  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col justify-end px-4 pb-16 pt-14 md:px-6 md:pb-20">
      <motion.p
        {...reveal(0)}
        className="absolute right-4 top-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/60 md:right-6 md:top-8 md:text-sm"
      >
        {agencyName}
      </motion.p>

      <motion.h1
        {...reveal(0.2)}
        className="max-w-2xl whitespace-pre-line font-serif text-4xl font-semibold leading-[1.1] text-white md:text-5xl lg:text-display"
      >
        {tagline}
      </motion.h1>

      <motion.div {...reveal(0.4)} className="mt-6 h-px w-16 bg-white/40" />

      <motion.p
        {...reveal(0.5)}
        className="mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
