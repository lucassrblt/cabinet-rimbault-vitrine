"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { PropertyCardEditorial } from "@/components/property/cards/PropertyCardEditorial";
import type { Property } from "@/lib/api/types";
import { EASE, STAGGER_STEP, VIEWPORT } from "@/lib/motion";
import { useDragScroll } from "@/lib/useDragScroll";
import { cn } from "@/lib/utils";

export function FeaturedCarousel({ properties }: { properties: Property[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useDragScroll(scrollRef);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.6 },
    );

    for (const card of cardRefs.current) {
      if (card) observer.observe(card);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, []);

  return (
    <div>
      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-2 flex cursor-grab snap-x snap-mandatory select-none gap-6 overflow-x-auto overflow-y-visible px-2 py-4"
      >
        {properties.map((property, i) => (
          <motion.div
            key={property.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-card
            className="w-[85%] flex-shrink-0 snap-start sm:w-[45%] lg:w-[calc(33.333%-1rem)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{
              duration: 0.6,
              delay: Math.min(i, 3) * STAGGER_STEP,
              ease: EASE,
            }}
          >
            <PropertyCardEditorial property={property} />
          </motion.div>
        ))}
      </div>

      {properties.length > 1 && (
        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {properties.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Aller au bien ${i + 1}`}
              onClick={() => scrollToCard(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-6 bg-primary-600"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
