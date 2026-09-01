"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  as = "h2",
  id,
  className,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  action?: ReactNode;
}) {
  const Heading = as;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex w-full items-end justify-between gap-4">
        <div className={cn(align === "center" && "w-full")}>
          {eyebrow && (
            <p
              className={cn(
                "flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wide text-primary-600",
                align === "center" && "justify-center",
              )}
            >
              {/* Filet réservé aux eyebrows texte — un eyebrow composé (ex.
                  pastille + libellé) apporte déjà son propre ornement. */}
              {typeof eyebrow === "string" && (
                <motion.span
                  aria-hidden="true"
                  className="h-px w-7 origin-left bg-primary-600/60"
                  variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              )}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
              >
                {eyebrow}
              </motion.span>
            </p>
          )}
          <Heading
            id={id}
            className={cn(
              "font-display text-3xl font-semibold tracking-tight text-primary",
              as === "h1" && "text-4xl",
              eyebrow && "mt-3",
            )}
          >
            {/* Line-mask reveal — le titre monte depuis un masque.
               Le padding em (compensé par la marge négative) évite de rogner
               accents et jambages au repos. */}
            <span className="block overflow-hidden py-[0.15em] -my-[0.15em]">
              <motion.span
                className="block"
                variants={{
                  hidden: { y: "150%" },
                  visible: { y: "0%" },
                }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              >
                {title}
              </motion.span>
            </span>
          </Heading>
        </div>
        {action && <div className="hidden md:block">{action}</div>}
      </div>
      {lede && (
        <motion.p
          className="max-w-2xl text-base text-body"
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          {lede}
        </motion.p>
      )}
      {action && <div className="md:hidden">{action}</div>}
    </motion.div>
  );
}
