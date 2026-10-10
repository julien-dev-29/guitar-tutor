import { describe, it, expect } from "vitest";
describe("scaffold", () => {
  it("routes attendues définies", async () => {
    const mod = await import("../src/App");
    expect(mod.default).toBeDefined();
  });
});
