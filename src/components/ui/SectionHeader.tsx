"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-80px 0px" } as const;
const MOTION_HEADING = { h1: motion.h1, h2: motion.h2, h3: motion.h3 } as const;

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
  const Heading = MOTION_HEADING[as];

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
              <motion.span
                aria-hidden="true"
                className="h-px w-7 origin-left bg-primary-600/60"
                variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
                transition={{ duration: 0.5, ease: EASE }}
              />
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
              "font-display text-2xl font-semibold tracking-tight text-primary md:text-3xl",
              as === "h1" && "text-3xl md:text-4xl",
              eyebrow && "mt-3",
            )}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            {title}
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
