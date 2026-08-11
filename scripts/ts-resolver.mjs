/**
 * Minimal ESM resolve hook so `node --test` can run the app's TypeScript
 * sources unchanged. Node's native type-stripping executes `.ts` files but the
 * ESM resolver requires explicit extensions; our app code uses extensionless
 * relative imports (idiomatic for Next.js/tsc). This hook appends `.ts` (or
 * `/index.ts`) to bare relative specifiers so both toolchains stay happy with
 * zero extra dependencies.
 */
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

/** Resolve a base path to `<base>.ts` or `<base>/index.ts` if either exists. */
function tryTs(base, context, nextResolve) {
  const asFile = base + ".ts";
  const asIndex = resolvePath(base, "index.ts");
  if (existsSync(asFile)) return nextResolve(pathToFileURL(asFile).href, context);
  if (existsSync(asIndex)) return nextResolve(pathToFileURL(asIndex).href, context);
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  // Map the app's "@/…" path alias to <cwd>/src/… (mirrors tsconfig paths).
  if (specifier.startsWith("@/")) {
    const base = resolvePath(process.cwd(), "src", specifier.slice(2));
    const hit = tryTs(base, context, nextResolve);
    if (hit) return hit;
  }

  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExt = /\.[cm]?[jt]s$|\.json$/.test(specifier);
  if (isRelative && !hasExt && context.parentURL) {
    const parentDir = dirname(fileURLToPath(context.parentURL));
    const asFile = resolvePath(parentDir, specifier + ".ts");
    const asIndex = resolvePath(parentDir, specifier, "index.ts");
    if (existsSync(asFile)) {
      return nextResolve(pathToFileURL(asFile).href, context);
    }
    if (existsSync(asIndex)) {
      return nextResolve(pathToFileURL(asIndex).href, context);
    }
  }
  return nextResolve(specifier, context);
}
