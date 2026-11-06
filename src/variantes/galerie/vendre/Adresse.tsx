"use client";

// Champ d'adresse à saisie automatique (motif « combobox » ARIA 1.2) :
// suggestions de la Géoplateforme de l'IGN (`lib/estimation/address.ts`),
// choisies à la souris ou au clavier (flèches, Entrée, Échap). Choisir une
// adresse remplit aussi le code postal et la commune, qui restent des champs
// visibles et modifiables : si le service ne répond pas, on continue à la main.
// Le numéro de rue tapé est conservé même quand le service ne propose que la
// voie (`streetWithNumber`).

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import {
  ADDRESS_MIN_CHARS,
  type AddressSuggestion,
  searchAddresses,
  streetWithNumber,
} from "@/lib/estimation/address";
import b from "../base.module.css";
import t from "./tunnel.module.css";

type Etat = "repos" | "recherche" | "pret" | "vide" | "panne";

const DELAI_MS = 250;

export function Adresse({
  id,
  value,
  maxLength,
  invalid,
  describedBy,
  onChange,
  onPick,
}: {
  id: string;
  value: string;
  maxLength: number;
  invalid: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
  onPick: (picked: {
    address: string;
    postalCode: string;
    city: string;
  }) => void;
}) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(-1);
  const [etat, setEtat] = useState<Etat>("repos");
  // La recherche ne part que sur une saisie (pas sur une valeur reprise du
  // brouillon ni après un choix).
  const [requete, setRequete] = useState<string | null>(null);
  const abandon = useRef<AbortController | null>(null);

  useEffect(() => {
    if (requete === null) return;
    if (requete.trim().length < ADDRESS_MIN_CHARS) {
      setSuggestions([]);
      setOuvert(false);
      setEtat("repos");
      return;
    }
    const minuterie = window.setTimeout(() => {
      abandon.current?.abort();
      const controleur = new AbortController();
      abandon.current = controleur;
      setEtat("recherche");
      searchAddresses(requete, controleur.signal)
        .then((found) => {
          if (controleur.signal.aborted) return;
          setSuggestions(found);
          setActif(-1);
          setOuvert(found.length > 0);
          setEtat(found.length > 0 ? "pret" : "vide");
        })
        .catch(() => {
          if (controleur.signal.aborted) return;
          setSuggestions([]);
          setOuvert(false);
          setEtat("panne");
        });
    }, DELAI_MS);
    return () => window.clearTimeout(minuterie);
  }, [requete]);

  useEffect(() => () => abandon.current?.abort(), []);

  function choisir(s: AddressSuggestion) {
    abandon.current?.abort();
    setRequete(null);
    setOuvert(false);
    setActif(-1);
    setEtat("repos");
    onPick({
      address: streetWithNumber(value, s),
      postalCode: s.postcode,
      city: s.city,
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setOuvert(true);
      setActif((n) => (n + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setOuvert(true);
      setActif((n) => (n <= 0 ? suggestions.length - 1 : n - 1));
    } else if (event.key === "Enter" && ouvert && actif >= 0) {
      // Entrée choisit la suggestion au lieu d'envoyer l'écran.
      event.preventDefault();
      choisir(suggestions[actif]);
    } else if (event.key === "Escape" && ouvert) {
      event.preventDefault();
      setOuvert(false);
      setActif(-1);
    }
  }

  const annonce =
    etat === "recherche"
      ? ""
      : etat === "pret"
        ? `${suggestions.length} adresse${suggestions.length > 1 ? "s" : ""} proposée${suggestions.length > 1 ? "s" : ""}. Flèche bas pour les parcourir.`
        : etat === "vide"
          ? "Aucune adresse proposée : complétez le code postal et la commune."
          : etat === "panne"
            ? "La saisie automatique ne répond pas : complétez le code postal et la commune."
            : "";

  return (
    <div className={t.combo}>
      <input
        id={id}
        name="address"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={ouvert}
        aria-controls={listId}
        aria-activedescendant={
          ouvert && actif >= 0 ? `${listId}-${actif}` : undefined
        }
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        spellCheck={false}
        maxLength={maxLength}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setRequete(e.target.value);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setOuvert(false)}
        onFocus={() => {
          if (suggestions.length > 0 && requete !== null) setOuvert(true);
        }}
      />
      {/* Motif combobox ARIA 1.2 : le focus reste dans le champ, l'option
          active est désignée par aria-activedescendant ; les options ne sont
          donc pas focalisables, et le clavier passe par le champ. */}
      <div
        id={listId}
        role="listbox"
        aria-label="Adresses proposées"
        className={t.suggestions}
        hidden={!ouvert}
      >
        {suggestions.map((s, n) => (
          // biome-ignore lint/a11y/useFocusableInteractive: option désignée par aria-activedescendant
          // biome-ignore lint/a11y/useKeyWithClickEvents: le clavier agit sur le champ (flèches, Entrée)
          <div
            key={s.id}
            id={`${listId}-${n}`}
            role="option"
            aria-selected={n === actif}
            className={t.suggestion}
            // Garde le focus dans le champ : le clic choisit sans le fermer avant.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => choisir(s)}
          >
            <span>{streetWithNumber(value, s)}</span>{" "}
            <span className={t.commune}>
              {s.postcode} {s.city}
            </span>
          </div>
        ))}
      </div>
      {/* Le nombre de suggestions n'est dit qu'aux lecteurs d'écran ; l'absence
          de réponse est montrée à tous. */}
      <output className={etat === "pret" ? b.sr : t.annonce}>{annonce}</output>
    </div>
  );
}
