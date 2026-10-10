import { describe, it, expect } from "vitest";
import { transposeChord } from "../src/lib/transpose";
describe("transpose", () => {
  it("C +2 -> D", () => { expect(transposeChord("C", 2)).toBe("D"); });
  it("F# +1 -> G", () => { expect(transposeChord("F#", 1)).toBe("G"); });
  it("Bb -2 -> Ab", () => { expect(transposeChord("Bb", -2)).toBe("Ab"); });
  it("Am +3 -> Cm (garde mineur)", () => { expect(transposeChord("Am", 3)).toBe("Cm"); });
  it("G7 +5 -> C7", () => { expect(transposeChord("G7", 5)).toBe("C7"); });
});
