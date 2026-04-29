# TASK-02 — Déploiement Vercel + variables d'environnement

**Priorité : 🔴 BLOQUANT**
**Phase : Ops**
**Statut : ⏳ À faire**

---

## Variables d'environnement requises

### Server-only (jamais préfixées `NEXT_PUBLIC_`)

| Var | Description | Exemple |
|-----|-------------|---------|
| `ADMIN_API_URL` | Base URL du back-office admin | `https://admin.cabinet-rimbault.fr/api/public` |
| `PUBLIC_API_KEY` | Clé `X-API-Key` pour l'API admin | `sk_live_...` |

### Publiques (visibles dans le bundle)

| Var | Description | Exemple |
|-----|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | URL de production sans slash final | `https://cabinet-rimbault.fr` |

`NEXT_PUBLIC_SITE_URL` est utilisée par `sitemap.ts` et `robots.ts`.
Si absente, fallback sur `https://cabinet-rimbault.fr` (hardcodé — à ne pas changer).

## Fichier `.env.local` (dev)

Créer à la racine (non commité — déjà dans `.gitignore`) :

```bash
ADMIN_API_URL=http://localhost:3001/api/public
PUBLIC_API_KEY=votre_cle_api_dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Déploiement Vercel

### Étapes

1. Connecter le repo GitHub à Vercel (ou `vercel deploy` en CLI).
2. Framework preset : **Next.js** (détecté automatiquement).
3. Ajouter les 3 variables d'environnement dans Settings → Environment Variables.
4. Domain : configurer `cabinet-rimbault.fr` + `www.cabinet-rimbault.fr` → redirect vers l'apex.

### Preview deploys

Chaque PR crée un preview Vercel automatiquement.
Mettre `NEXT_PUBLIC_SITE_URL` = URL preview dans les variables "Preview" de Vercel.

## Vérification post-déploiement

- [ ] `https://cabinet-rimbault.fr/sitemap.xml` retourne un XML valide avec les biens
- [ ] `https://cabinet-rimbault.fr/robots.txt` retourne le bon contenu
- [ ] `PUBLIC_API_KEY` absent du bundle : `grep -r "PUBLIC_API_KEY" .next/static/` → aucun résultat
- [ ] Les formulaires envoient vraiment des leads côté admin
- [ ] Les biens s'affichent sur `/acheter` et `/louer`

## Phase 2 — Revalidation webhook

Ajouter `REVALIDATION_SECRET` quand le webhook `/api/revalidate` sera implémenté (TASK-06).
Documenter côté admin le secret partagé.

## Référence

Voir `docs/deployment.md` pour les détails supplémentaires.
