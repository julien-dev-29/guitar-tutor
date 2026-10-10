import { describe, it, expect } from "vitest";
describe("progress logic", () => {
  it("toggle ajoute puis retire", async () => {
    const { loadProgress, saveProgress } = await import("../src/lib/storage");
    localStorage.clear();
    const p = loadProgress();
    saveProgress({ ...p, lessonsDone: ["l1"] });
    expect(loadProgress().lessonsDone).toEqual(["l1"]);
  });
});
