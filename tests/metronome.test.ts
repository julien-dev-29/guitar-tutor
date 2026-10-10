import { describe, it, expect } from "vitest";
import { bpmToMs } from "../src/lib/audio";
describe("metronome", () => {
  it("40bpm -> 1500ms", () => { expect(bpmToMs(40)).toBe(1500); });
  it("220bpm -> 273ms (arrondi)", () => { expect(bpmToMs(220)).toBe(273); });
});
