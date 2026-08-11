/** Registers the .ts resolve hook. Used via: node --import ./scripts/register-ts-resolver.mjs */
import { register } from "node:module";
register("./ts-resolver.mjs", import.meta.url);
