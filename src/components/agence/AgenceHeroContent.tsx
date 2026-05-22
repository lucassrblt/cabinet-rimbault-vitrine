"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { heroContainer, heroLine } from "@/lib/motion";

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroContainer}
      className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col justify-end px-gutter pb-20 pt-14 md:pb-24"
    >
      <motion.span
        variants={heroLine}
        className="absolute left-4 top-6 inline-block rounded-sm bg-primary-600 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white md:left-6 md:top-8 md:text-xs"
      >
        {badgeLabel}
      </motion.span>

      <motion.h1
        variants={heroLine}
        className="max-w-2xl whitespace-pre-line font-display text-4xl font-semibold leading-[1.1] text-white md:text-5xl lg:text-display"
      >
        {tagline}
      </motion.h1>

      <motion.p
        variants={heroLine}
        className="mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg"
      >
        {subtitle}
      </motion.p>

      <motion.div variants={heroLine} className="mt-8">
        <LinkButton href={ctaHref}>{ctaLabel}</LinkButton>
      </motion.div>

      <motion.div
        variants={heroLine}
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
    </motion.div>
  );
}
