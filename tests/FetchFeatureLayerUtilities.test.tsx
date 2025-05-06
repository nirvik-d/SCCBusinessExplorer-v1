import { describe, it, expect, vi } from "vitest";
import { createPlaceGraphics } from "../src/components/FetchFeatureLayers";

describe("createPlaceGraphics", () => {
  it("creates the matching city graphic for coastal towns and cities", () => {
    const mockGraphic = {
      attributes: { CDTFA_CITY: "Santa Monica" },
      symbol: {
        type: "simple-fill",
        color: [0, 120, 255, 0.5],
        outline: {
          color: [0, 0, 0, 0.6],
          width: 1,
        },
      },
    };
    const mockLayer = [mockGraphic];
    const result = createPlaceGraphics(mockLayer);
    expect(result[0].attributes.CDTFA_CITY).toBe("Santa Monica");
    expect(result[0].symbol.type).toBe("simple-fill");
  });
});
