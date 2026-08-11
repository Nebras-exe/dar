import type { VisionProvider } from "./types";

/**
 * Demo provider. Returns a fixed, plausible SAMPLE analysis so the flow can be
 * demonstrated when no real Vision credential is configured. It does NOT look at
 * the image — the service marks the result `source: "demo"` and the UI labels it
 * clearly as a sample, so nothing is presented as a real detection. Confidences
 * are deliberately modest to reinforce "review and correct me".
 */
export const demoProvider: VisionProvider = {
  name: "demo",
  model: "demo-sample",
  isConfigured: () => true,
  async analyze() {
    // A representative warm-modern living room. Raw model-style shape — the
    // service runs it through the same parser/validator as a real provider.
    return {
      roomType: "living-room",
      roomTypeConfidence: 0.72,
      style: { primary: "warm-modern", secondary: "contemporary", confidence: 0.6 },
      palette: [
        { raw: "warm white", confidence: 0.7 },
        { raw: "beige", confidence: 0.66 },
        { raw: "walnut", confidence: 0.58 },
      ],
      existingFurniture: [
        {
          category: "sofa",
          confidence: 0.8,
          approximateColor: "beige",
          approximateMaterial: "linen",
          suggestion: "keep",
        },
        {
          category: "coffee table",
          confidence: 0.68,
          approximateColor: "walnut",
          approximateMaterial: "wood",
          suggestion: "keep",
        },
        {
          category: "rug",
          confidence: 0.55,
          approximateColor: "grey",
          approximateMaterial: "wool",
          suggestion: "replace",
        },
        {
          category: "tv unit",
          confidence: 0.5,
          approximateColor: "walnut",
          approximateMaterial: "wood",
          suggestion: "unsure",
        },
      ],
      architecturalFeatures: ["window", "major-empty-wall", "ceiling-light"],
      dimensionsStatus: "unknown",
    };
  },
};
