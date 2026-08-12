/**
 * Tiny server-side byte→base64 helper for image providers. Node's Buffer is used
 * when available (server runtime); a pure fallback keeps it dependency-free.
 */
export function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  // btoa exists in edge/browser runtimes.
  return typeof btoa !== "undefined" ? btoa(binary) : binary;
}
