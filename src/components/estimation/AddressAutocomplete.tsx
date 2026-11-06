"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import type { FieldControlProps } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import {
  ADDRESS_MIN_CHARS,
  type AddressSuggestion,
  searchAddresses,
} from "@/lib/estimation/address";
import { cn } from "@/lib/utils";

// Champ d'adresse avec propositions de la Base Adresse Nationale (motif
// « combobox » de l'ARIA 1.2, liste sans sélection automatique) :
// - les propositions arrivent 250 ms après la dernière frappe, à partir de
//   3 caractères ; leur nombre est annoncé aux lecteurs d'écran ;
// - flèches haut et bas pour parcourir, Entrée pour choisir, Échap pour
//   fermer ; la souris et le toucher choisissent d'un clic ;
// - choisir une adresse remplit aussi le code postal et la ville ;
// - la saisie libre reste toujours possible (service indisponible, adresse
//   absente de la base) : rien ne bloque.
// Liste sans ombre (brief §6.1) : filet fort, fond lait, apparition sans
// mouvement.

type Props = {
  control: FieldControlProps;
  name: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  onBlur: () => void;
};

function announcement(count: number): string {
  if (count === 0) return "";
  const n =
    count === 1 ? "Une adresse proposée" : `${count}\u00a0adresses proposées`;
  return `${n}. Flèches haut et bas pour parcourir, Entrée pour choisir.`;
}

export function AddressAutocomplete({
  control,
  name,
  value,
  maxLength,
  onChange,
  onSelect,
  onBlur,
}: Props) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [message, setMessage] = useState("");
  // Seule une frappe déclenche une recherche (pas une reprise ni un choix).
  const typed = useRef(false);

  useEffect(() => {
    if (!typed.current) return;
    if (value.trim().length < ADDRESS_MIN_CHARS) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchAddresses(value, controller.signal).then(
        (found) => {
          setSuggestions(found);
          setOpen(found.length > 0);
          setActive(-1);
          setMessage(announcement(found.length));
        },
        () => {
          // Service indisponible ou requête annulée : saisie libre.
        },
      );
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  function choose(suggestion: AddressSuggestion) {
    typed.current = false;
    setOpen(false);
    setActive(-1);
    setMessage(
      `Adresse choisie\u202f: ${suggestion.name}, ${suggestion.postcode} ${suggestion.city}.`,
    );
    onSelect(suggestion);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(event.key === "ArrowDown" ? 0 : suggestions.length - 1);
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => {
        const next = current + step;
        if (next < 0) return suggestions.length - 1;
        if (next >= suggestions.length) return 0;
        return next;
      });
    } else if (event.key === "Enter") {
      if (open && active >= 0 && suggestions[active]) {
        event.preventDefault();
        choose(suggestions[active]);
      }
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    }
  }

  const optionId = (index: number) => `${listId}-${index}`;
  const expanded = open && suggestions.length > 0;

  return (
    <div className="relative">
      <Input
        {...control}
        name={name}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={
          expanded && active >= 0 ? optionId(active) : undefined
        }
        autoComplete="street-address"
        autoCapitalize="sentences"
        spellCheck={false}
        enterKeyHint="next"
        maxLength={maxLength}
        value={value}
        onChange={(event) => {
          typed.current = true;
          onChange(event.target.value);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setOpen(false);
          setActive(-1);
          onBlur();
        }}
      />
      <div
        id={listId}
        role="listbox"
        aria-label="Adresses proposées"
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-[3px] border border-filet-fort bg-lait py-1"
      >
        {suggestions.map((suggestion, index) => (
          // Motif combobox : le focus reste dans le champ, qui pilote la liste
          // au clavier (aria-activedescendant) ; l'option ne prend jamais le focus.
          // biome-ignore lint/a11y/useFocusableInteractive: focus géré par le champ (ARIA 1.2).
          // biome-ignore lint/a11y/useKeyWithClickEvents: clavier géré par le champ (flèches, Entrée).
          <div
            key={suggestion.id}
            id={optionId(index)}
            role="option"
            aria-selected={index === active}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(suggestion)}
            onMouseMove={() => setActive(index)}
            className={cn(
              "t-ui flex min-h-12 cursor-pointer flex-col justify-center px-[14px] py-2",
              index === active && "bg-creme-soutenu",
            )}
          >
            <span>{suggestion.name}</span>
            <span className="t-petit text-encre-douce">
              {suggestion.postcode}&nbsp;{suggestion.city}
            </span>
          </div>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
