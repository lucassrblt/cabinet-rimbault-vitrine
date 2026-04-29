# Tâches — Cabinet Rimbault Vitrine

> Diagnostic établi le 2026-04-29. Base : lecture complète du code + cahier des charges.

## Résumé : état du projet

**MVP Phase 1 : 100 % implémenté côté code.**

Tout ce qui était prévu dans `docs/implementation-plan.md` est livré :
- Infrastructure (Next.js 16, Tailwind v4, Biome, Husky) ✅
- API layer complet (`client.ts`, `types.ts`, `properties.ts`, `leads.ts`) ✅
- 4 Server Actions câblées (`submitContactLead`, `submitQuickContact`, `submitVisitRequest`, `submitEvaluation`) ✅
- 12 pages opérationnelles (11 statiques + `/bien/[reference]`) ✅
- Tous les formulaires câblés — plus aucune soumission factice ✅
- Filtrage listings côté API (`searchProperties`) ✅
- Fiche bien enrichie (énergie, copro, documents, proximités) ✅
- `sitemap.xml` dynamique + `robots.txt` ✅
- ISR 60 s avec cache tags ✅

## Ce qui reste (priorité décroissante)

| # | Fichier | Priorité | Phase |
|---|---------|----------|-------|
| 01 | `task-01-infos-agent.md` | 🔴 BLOQUANT | Contenu client |
| 02 | `task-02-deploiement.md` | 🔴 BLOQUANT | Ops |
| 03 | `task-03-json-ld.md` | 🟡 Important | Phase 1.5 SEO |
| 04 | `task-04-carte-localisation.md` | 🟡 Important | UX |
| 05 | `task-05-static-params.md` | 🟢 Nice-to-have | SEO optionnel |
| 06 | `task-06-revalidate-webhook.md` | ⚪ Phase 2 | Ops avancé |
| 07 | `task-07-secteur-commune.md` | ⚪ Phase 2 | SEO local |

## Définition de "done" commune

Avant chaque merge :
- `npm run typecheck` passe
- `npm run lint` passe
- Test manuel sur `npm run dev` : page charge, cas d'erreur affichent un message lisible
- Pas de `PUBLIC_API_KEY` dans le bundle client
