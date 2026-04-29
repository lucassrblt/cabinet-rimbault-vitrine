"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers navigation reset
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-bg-page)",
            zIndex: 9999,
          }}
        >
          {/*<Image
            src="/logo-cabinet-rimbault.png"
            alt="Cabinet Rimbault"
            width={280}
            height={100}
            priority
            className="h-auto w-[200px] md:w-[280px]"
          />*/}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
