import { describe, it, expect } from "vitest";
import { bpmToMs } from "../src/lib/audio";
describe("audio", () => {
  it("120bpm -> 500ms", () => { expect(bpmToMs(120)).toBe(500); });
  it("60bpm -> 1000ms", () => { expect(bpmToMs(60)).toBe(1000); });
});
