"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  badge: string;
  title: string;
  subtitle: string;
  image?: string;
}

export function ListingHero({
  badge,
  title,
  subtitle,
  image = "/hero-agence.jpg",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-header">
      <div className="relative min-h-[340px] md:min-h-[420px]">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[340px] w-full max-w-7xl flex-col justify-center px-4 py-16 md:min-h-[420px] md:px-8 md:py-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-block w-fit rounded-sm bg-primary-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-on-primary"
          >
            {badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-4 max-w-xl font-serif text-3xl font-semibold italic leading-tight text-white md:text-5xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease }}
            className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 md:text-base"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
