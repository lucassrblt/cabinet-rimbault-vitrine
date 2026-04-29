# TASK-04 — Carte de localisation sur la fiche bien

**Priorité : 🟡 Important**
**Phase : 1 (amélioration UX)**
**Statut : ⏳ À décider + implémenter**

---

## État actuel

`LocationSection` dans `/bien/[reference]/page.tsx` affiche un placeholder visuel statique
(fond gris + icône MapPin + texte "Zone approximative"). Aucune vraie carte.

Les champs `location.latitude` et `location.longitude` sont typés et disponibles côté API.

## Question ouverte

**Les coordonnées GPS retournées par l'API sont-elles exactes ou floutées ?**
(§5.10 Q2 de `docs/implementation-plan.md`)

- Si **exactes** → afficher un cercle de 500 m centré sur le point pour préserver la confidentialité.
- Si **floutées d'emblée** → afficher directement sans précaution supplémentaire.

À confirmer avec l'admin avant de modifier le comportement.

## Option retenue (recommandation)

**iframe OpenStreetMap statique**, sans lib JS côté client :

```tsx
function MapEmbed({ lat, lon, city }: { lat: number; lon: number; city: string }) {
  // bbox = 500 m autour du point flou
  const delta = 0.005;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
  return (
    <iframe
      title={`Localisation approximative — ${city}`}
      src={src}
      width="100%"
      height="100%"
      className="h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
```

Afficher uniquement si `latitude && longitude` sont fournis — sinon garder le placeholder actuel.

**Avantages** : zéro dépendance JS, SEO-neutre, gratuit, conforme OpenStreetMap.
**Inconvénient** : pas de cercle d'approximation dessiné (acceptable pour un MVP).

## Implémentation

Dans `LocationSection` (`src/app/bien/[reference]/page.tsx`) :

```tsx
function LocationSection({ property }: { property: Property }) {
  const loc = property.location;
  if (!loc) return null;
  const hasCoords = loc.latitude != null && loc.longitude != null;

  return (
    <section ...>
      ...
      <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-sm border border-subtle bg-section">
        {hasCoords ? (
          <MapEmbed lat={loc.latitude!} lon={loc.longitude!} city={loc.city} />
        ) : (
          <PlaceholderMap city={loc.city} postalCode={loc.postalCode} />
        )}
      </div>
      ...
    </section>
  );
}
```

## Notes

- L'iframe OpenStreetMap ne nécessite pas de clé API.
- Ajouter `loading="lazy"` pour ne pas bloquer le LCP.
- La mention "Localisation approximative (rayon ~500 m)" doit rester visible sous la carte.
- Pas besoin de Leaflet, Mapbox ou Google Maps pour ce cas d'usage.
