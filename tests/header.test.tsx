// tests/header.test.tsx
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../src/components/Header";
import { ProgressProvider } from "../src/context/ProgressContext";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider>
        <Header />
      </ProgressProvider>
    </MemoryRouter>
  );
}

describe("Header", () => {
  afterEach(() => cleanup());
  it("marque le lien actif avec aria-current", () => {
    renderAt("/accords");
    const link = screen.getByRole("link", { name: "Accords" });
    expect(link.getAttribute("aria-current")).toBe("page");
  });
  it("affiche la progression X/12", () => {
    localStorage.clear();
    renderAt("/");
    expect(screen.getByText(/Progression/).textContent).toMatch(/0\/12/);
  });
});
