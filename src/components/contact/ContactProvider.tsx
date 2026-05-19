"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Drawer } from "@/components/ui/Drawer";
import type { ContactSubject } from "@/lib/validation";
import { QuickContactForm } from "./QuickContactForm";

interface ContactOptions {
  /** Pré-remplit l'objet de la demande selon le contexte du déclencheur. */
  subject?: ContactSubject;
  /** Référence d'un bien, si la demande en concerne un. */
  reference?: string;
}

interface ContactContextValue {
  open: (options?: ContactOptions) => void;
  close: () => void;
}

const ContactContext = createContext<ContactContextValue | null>(null);

/** Ouvre / ferme le drawer de contact depuis n'importe quel composant client. */
export function useContact(): ContactContextValue {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContact doit être utilisé dans <ContactProvider>.");
  }
  return ctx;
}

/** Phrase d'accroche du drawer selon l'objet de la demande. */
const INTRO: Record<ContactSubject, string> = {
  vente: "Une question sur un bien à vendre ? Laissez-moi vos coordonnées.",
  location: "Une question sur un bien à louer ? Laissez-moi vos coordonnées.",
  estimation:
    "Vous souhaitez estimer votre bien ? Laissez-moi vos coordonnées.",
  rdv: "Échangeons sur votre projet — je vous réponds sous 24 h ouvrées.",
  autre: "Une question ? Laissez-moi vos coordonnées, je reviens vers vous.",
};

/**
 * Monté une seule fois dans le layout. Fournit `useContact()` à toute l'app et
 * rend le drawer latéral de prise de contact (overlay : ferme sans quitter la
 * page).
 */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ContactOptions>({});

  const open = useCallback((opts?: ContactOptions) => {
    setOptions(opts ?? {});
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  const subject: ContactSubject = options.subject ?? "rdv";

  return (
    <ContactContext.Provider value={value}>
      {children}
      <Drawer
        open={isOpen}
        onClose={close}
        title="Me contacter"
        side="right"
        size="md"
      >
        <p className="flex items-center gap-2.5 text-sm leading-relaxed text-muted">
          <span
            aria-hidden="true"
            className="h-px w-7 shrink-0 bg-primary-600/60"
          />
          {INTRO[subject]}
        </p>
        <div className="mt-5">
          <QuickContactForm
            key={`${subject}|${options.reference ?? ""}`}
            subject={subject}
            reference={options.reference}
            onClose={close}
          />
        </div>
      </Drawer>
    </ContactContext.Provider>
  );
}
