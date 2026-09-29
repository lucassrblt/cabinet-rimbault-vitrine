/**
 * Déploiement non-production Netlify (Deploy Preview, Branch deploy).
 *
 * `CONTEXT` est fourni par Netlify (`production`, `deploy-preview`,
 * `branch-deploy`, `dev`). Absent en local → non concerné.
 * Sert à rendre les previews lisibles par un agent/LLM (robots.txt permissif)
 * tout en les gardant hors des moteurs de recherche (noindex).
 */
export const isPreviewDeploy =
  Boolean(process.env.CONTEXT) && process.env.CONTEXT !== "production";
