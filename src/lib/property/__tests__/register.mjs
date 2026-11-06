// Tests unitaires de src/lib/property (lot 2), lancés par Node seul :
//   node --test --import ./src/lib/property/__tests__/register.mjs src/lib/property/__tests__/*.test.ts
// Node 22 retire les types nativement ; ce crochet résout seulement les
// imports sans extension (« ./format ») et l'alias « @/ » vers src/.
import { register } from "node:module";

register(
  `data:text/javascript,${encodeURIComponent(`
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const src = new URL("../../../", ${JSON.stringify(import.meta.url)});
export async function resolve(specifier, context, next) {
  let target = specifier;
  if (specifier.startsWith("@/")) target = new URL(specifier.slice(2), src).href;
  if (target.startsWith("./") || target.startsWith("../") || target.startsWith("file:")) {
    const base = target.startsWith("file:") ? target : new URL(target, context.parentURL).href;
    if (!/\\.[cm]?[jt]sx?$/.test(base)) {
      for (const ext of [".ts", ".tsx"]) {
        if (existsSync(fileURLToPath(base + ext))) return next(base + ext, context);
      }
    }
    return next(base, context);
  }
  return next(specifier, context);
}
`)}`,
);
