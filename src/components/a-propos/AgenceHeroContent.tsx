"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
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
    <div className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col justify-end px-4 pb-16 pt-14 md:min-h-[75vh] md:px-6 md:pb-20">
      <motion.p
        {...reveal(0)}
        className="absolute right-4 top-6 text-xs font-medium uppercase tracking-[0.2em] text-white/70 md:right-6 md:top-8 md:text-sm"
      >
        {agencyName}
      </motion.p>

      <motion.h1
        {...reveal(0.15)}
        className="max-w-xl font-serif text-3xl font-semibold leading-tight text-white md:text-5xl lg:text-display"
      >
        {tagline}
      </motion.h1>

      <motion.p
        {...reveal(0.3)}
        className="mt-4 max-w-lg text-base text-white/70 md:text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
