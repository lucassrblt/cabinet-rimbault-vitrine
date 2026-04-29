# TASK-06 — Webhook de revalidation de cache (Phase 2)

**Priorité : ⚪ Phase 2**
**Phase : 2**
**Statut : ⏳ À faire après déploiement stable**

---

## Contexte

Actuellement, les pages se revalident automatiquement toutes les 60 secondes (ISR).
Ce mécanisme est suffisant pour le MVP.

En Phase 2, l'admin back-office devra déclencher une revalidation immédiate dès qu'un
bien est publié, modifié, vendu ou archivé — pour que le site reflète l'état réel en temps réel.

## À créer

### Route handler `src/app/api/revalidate/route.ts`

```ts
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { event, reference, transactionType } = body;

  // Toujours invalider la liste globale
  revalidateTag("properties");

  if (reference) {
    revalidateTag(`property:${reference}`);
  }

  if (transactionType === "VENTE") {
    revalidateTag("properties:sale");
  } else if (transactionType === "LOCATION") {
    revalidateTag("properties:rent");
  }

  revalidateTag("properties:recent");

  return NextResponse.json({ revalidated: true, event });
}
```

### Variable d'environnement à ajouter

```
REVALIDATION_SECRET=un_secret_aleatoire_fort
```

Ce secret doit être partagé avec le projet `cabinet-rimbault-admin` (webhook sortant).

## Côté admin

L'admin doit envoyer un `POST` vers `https://cabinet-rimbault.fr/api/revalidate` avec :
- Header : `x-revalidate-secret: <secret>`
- Body :
  ```json
  {
    "event": "property.published",
    "reference": "CR-2024-001",
    "transactionType": "VENTE"
  }
  ```

Événements à gérer : `property.published`, `property.updated`, `property.unpublished`,
`property.sold`, `property.rented`, `property.archived`.

## Notes

- Documenter le secret dans `docs/deployment.md` (section Phase 2).
- Ajouter `REVALIDATION_SECRET` aux variables d'environnement Vercel (production uniquement).
- Le webhook ne doit **pas** figurer dans `robots.txt` — `/api/*` est déjà disallowé.
