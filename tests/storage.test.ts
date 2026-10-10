import { describe, it, expect } from "vitest";
import { loadProgress, saveProgress } from "../src/lib/storage";
describe("storage", () => {
  it("défaut vide", () => {
    localStorage.clear();
    expect(loadProgress()).toEqual({ lessonsDone: [], favorites: [], lastTempo: 90, lastVisited: "/" });
  });
  it("round-trip favoris", () => {
    saveProgress({ lessonsDone: [], favorites: ["Em"], lastTempo: 100, lastVisited: "/accords" });
    expect(loadProgress().favorites).toEqual(["Em"]);
  });
});
