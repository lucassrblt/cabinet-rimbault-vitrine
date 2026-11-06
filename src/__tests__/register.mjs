// Crochet de résolution des tests de `src/proxy.ts`, lancés par Node seul :
//   node --test --import ./src/__tests__/register.mjs src/__tests__/proxy.test.ts
// Reprend celui de lib/property (alias « @/ », imports sans extension) et
// ajoute les sous-chemins de `next` (« next/server »), que Node ne résout pas
// sans extension : le paquet n'a pas de champ `exports`.
import { register } from "node:module";
import "../lib/property/__tests__/register.mjs";

// `node --test` ne pose pas NODE_ENV : sans lui, `src/lib/site-url.ts` refuse
// le repli localhost (règle de la production). Les tests sont en `test`.
process.env.NODE_ENV ??= "test";

register(
  `data:text/javascript,${encodeURIComponent(`
export async function resolve(specifier, context, next) {
  if (/^next\\/[\\w/-]+$/.test(specifier)) return next(specifier + ".js", context);
  return next(specifier, context);
}
`)}`,
);
