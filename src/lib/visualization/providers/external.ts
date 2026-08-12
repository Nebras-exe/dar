/**
 * External image-generation provider (SERVER-ONLY, §6/§7/§8).
 *
 * The vendor-agnostic seam for the REAL After-image render. It assembles the
 * full provider payload — the original room photo, the server-resolved catalog
 * ALLOW-LIST (each selected product's SELECTED-variant reference image), the
 * versioned RenderSpec prompt, and hard negative constraints — and POSTs it to a
 * configurable image endpoint. Anthropic is NEVER used for image output (it stays
 * the reasoning/vision provider); this provider targets a dedicated image API.
 *
 * SECRET RULES:
 * - `IMAGE_API_KEY` is read here only, sent solely in the auth header, and never
 *   logged, returned, embedded in output, or exposed to the client. No NEXT_PUBLIC.
 * - When the key/provider are absent `isConfigured()` is false, so the service
 *   never selects this provider and the deterministic Demo path runs instead.
 * - This module makes a network call ONLY when `generate()` runs at request time
 *   with the env configured. It is never called during tests or the build, and no
 *   paid image call is made until the operator adds real credentials.
 */

import { buildVisualizationPrompt } from "../prompt";
import { buildCatalogReferences, VISUALIZATION_NEGATIVE_CONSTRAINTS } from "../references";
import { toBase64 } from "./codec";
import type { VisualizationRequest } from "../types";
import type {
  ProviderOutput,
  VisualizationImageInput,
  VisualizationProvider,
} from "./types";

/** Non-secret provider label (e.g. "replicate" | "stability" | "openai-images"). */
function providerLabel(): string {
  return process.env.IMAGE_PROVIDER?.trim() || "external";
}

/** Model id for provenance (never a secret). */
function imageModel(): string {
  return process.env.IMAGE_MODEL?.trim() || "unspecified-image-model";
}

/**
 * The vendor endpoint. Kept configurable (`IMAGE_API_URL`) so a specific vendor
 * contract can be wired without code changes; there is no default live endpoint,
 * so nothing is ever called until the operator provides one alongside the key.
 */
function endpoint(): string | null {
  return process.env.IMAGE_API_URL?.trim() || null;
}

export const externalImageProvider: VisualizationProvider = {
  name: providerLabel(),
  get model() {
    return imageModel();
  },
  /**
   * Configured only when BOTH a provider label + an API key exist. Without a key
   * this stays false, so the demo path runs and no paid call can happen.
   */
  isConfigured(): boolean {
    return Boolean(process.env.IMAGE_API_KEY) && Boolean(process.env.IMAGE_PROVIDER);
  },

  async generate(
    request: VisualizationRequest,
    image: VisualizationImageInput | null,
    signal: AbortSignal,
  ): Promise<ProviderOutput> {
    const apiKey = process.env.IMAGE_API_KEY;
    const url = endpoint();
    // Structural guards — the service already enforces image+consent, but never
    // attempt a call without a key or a configured endpoint.
    if (!apiKey) throw new Error("external: not configured");
    if (!url) throw new Error("external: no endpoint configured");
    if (!image || image.bytes.length === 0) throw new Error("external: missing room image");

    // Server-resolved catalog allow-list (catalog truth) + the render prompt.
    const references = buildCatalogReferences(request);
    const payload = {
      model: imageModel(),
      prompt: buildVisualizationPrompt(request),
      originalRoomImage: {
        mediaType: image.mimeType,
        data: toBase64(image.bytes),
      },
      catalogReferences: references,
      negativeConstraints: [...VISUALIZATION_NEGATIVE_CONSTRAINTS],
      // A belt-and-braces allow-list the provider can enforce directly.
      allowList: references.map((r) => r.slug),
      options: { preserveArchitecture: request.options.preserveArchitecture },
    };

    const res = await fetch(url, {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        // Vendors differ; send the common shapes without ever logging the key.
        authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Never surface the raw provider body; the service maps this to a safe code.
      throw new Error(`external: http ${res.status}`);
    }

    const data = (await res.json()) as {
      imageDataUrl?: string;
      image?: string;
      output?: string;
    };
    const imageDataUrl = data.imageDataUrl || data.image || data.output || "";
    return { kind: "generated", imageDataUrl };
  },
};
