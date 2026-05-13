"use client";

import { Loader2, MapPin, X } from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface AddressSuggestion {
  label: string;
  street: string;
  postalCode: string;
  city: string;
}

interface BanFeature {
  properties: {
    label: string;
    name?: string;
    postcode?: string;
    city?: string;
    context?: string;
    type?: string;
  };
}

interface BanResponse {
  features?: BanFeature[];
}

interface AddressAutocompleteProps {
  value: AddressSuggestion | null;
  onChange: (value: AddressSuggestion | null) => void;
  placeholder?: string;
  autoFocus?: boolean;
  error?: string;
}

const BAN_URL = "https://api-adresse.data.gouv.fr/search/";

function featureToSuggestion(f: BanFeature): AddressSuggestion {
  return {
    label: f.properties.label,
    street: f.properties.name ?? f.properties.label,
    postalCode: f.properties.postcode ?? "",
    city: f.properties.city ?? "",
  };
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "12 rue de la Paix, Asnières-sur-Seine",
  autoFocus,
  error,
}: AddressAutocompleteProps) {
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;
  const [query, setQuery] = useState(value?.label ?? "");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);
  const blurTimerRef = useRef<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-sync only when controlled value changes
  useEffect(() => {
    if (value && value.label !== query) {
      setQuery(value.label);
    }
  }, [value]);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    if (value && query === value.label) {
      setSuggestions([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const url = `${BAN_URL}?q=${encodeURIComponent(query)}&limit=6&autocomplete=1`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("BAN error");
        const data = (await res.json()) as BanResponse;
        const list = (data.features ?? []).map(featureToSuggestion);
        setSuggestions(list);
        setActiveIndex(list.length > 0 ? 0 : -1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query, value]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (blurTimerRef.current) window.clearTimeout(blurTimerRef.current);
    };
  }, []);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
    if (value) onChange(null);
  }

  function pick(s: AddressSuggestion) {
    onChange(s);
    setQuery(s.label);
    setOpen(false);
    setSuggestions([]);
  }

  function clear() {
    onChange(null);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (
        e.key === "ArrowDown" &&
        suggestions.length === 0 &&
        query.length >= 3
      ) {
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        pick(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showList = open && (loading || suggestions.length > 0);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-2 rounded-sm border bg-card px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-focus",
          error
            ? "border-red-300"
            : "border-default focus-within:border-primary-500",
        )}
      >
        <MapPin className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${inputId}-opt-${activeIndex}` : undefined
          }
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          // biome-ignore lint/a11y/noAutofocus: souhaité pour micro-étape onboarding
          autoFocus={autoFocus}
          value={query}
          placeholder={placeholder}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimerRef.current = window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={handleKey}
          className="w-full bg-transparent text-base text-primary placeholder:text-muted focus:outline-none"
        />
        {loading && (
          <Loader2
            className="h-4 w-4 shrink-0 animate-spin text-muted"
            aria-hidden="true"
          />
        )}
        {value && !loading && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clear}
            className="rounded-full p-1 text-muted transition-colors hover:bg-neutral-100 hover:text-primary"
            aria-label="Effacer l'adresse"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {showList && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Suggestions d'adresses"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-sm border border-default bg-card shadow-lg"
        >
          {loading && suggestions.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted">Recherche…</div>
          )}
          {suggestions.map((s, i) => (
            <button
              key={s.label}
              type="button"
              id={`${inputId}-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition",
                i === activeIndex
                  ? "bg-primary-50 text-primary"
                  : "text-body hover:bg-neutral-50",
              )}
            >
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                aria-hidden="true"
              />
              <span className="leading-tight">{s.label}</span>
            </button>
          ))}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
      <p className="mt-1.5 text-xs text-muted">
        Suggestions issues de l&apos;API Adresse de l&apos;État —{" "}
        <span className="text-subtle">api-adresse.data.gouv.fr</span>
      </p>
    </div>
  );
}
