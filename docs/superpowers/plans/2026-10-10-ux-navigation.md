# UX Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un header desktop avec navigation active + mini-progression, et appliquer les petits fixes FR/404/titres.

**Architecture:** Nouveau composant `Header` (NavLink + `useProgress`), intégré dans `App` au-dessus des Routes ; bottom-bar existante enrichie d'états actifs ; page `NotFound` pour la route `*`.

**Tech Stack:** React 19 + TypeScript, react-router-dom 6, Tailwind 3, Vitest 5 + jsdom + @testing-library/react 16 (déjà installés).

## Global Constraints

- Langue UI : FR uniquement.
- Routes inchangées : `/`, `/lecons`, `/lecons/:id`, `/accords`, `/accords/:nom`, `/outils`, `/chansons`, `/chansons/:id`, `*`.
- Style : Tailwind, dark zinc-950 + ambre, boutons/liens tactiles ≥44px sur mobile.
- YAGNI : pas de recherche, pas de sidebar, pas de favoris dans le header, aucun changement métier.
- Aucune donnée JSON modifiée.
- Tests existants (6 fichiers / 13 tests) doivent rester verts ; commit par tâche.

---

## File Structure

- `src/components/Header.tsx` — NOUVEAU : header sticky desktop (logo, 5 NavLink actifs, mini-progression). Responsabilité unique : navigation haut-desktop.
- `src/App.tsx` — MODIFIÉ : rend `<Header />`, bottom-bar avec états actifs, route `*` → `<NotFound />`.
- `src/pages/NotFound.tsx` — NOUVEAU : page 404 FR avec liens Accueil + Leçons.
- `src/pages/Chords.tsx` — MODIFIÉ : ajoute titre principal (seule page sans h1/h2).
- `index.html` — MODIFIÉ : `lang="fr"` + meta description FR + theme-color.
- `tests/header.test.tsx` — NOUVEAU : rendu Header sous MemoryRouter, lien actif + progression.

---

### Task 1: Header desktop + états actifs

**Files:**
- Create: `src/components/Header.tsx`
- Create: `tests/header.test.tsx`
- Modify: `src/App.tsx:1-38`

**Interfaces:**
- Consumes: `useProgress(): { progress: Progress }` (`src/context/ProgressContext.tsx`), `Progress { lessonsDone: string[] }` (`src/lib/storage.ts`), `lessons.length` via `src/data/lessons.json` (12 entrées).
- Produces: `Header()` (aucune prop) — utilisé par `App`. Classe active partagée : `navLinkClass({ isActive }: { isActive: boolean }): string` exportée depuis `Header.tsx` et réutilisée par la bottom-bar.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/header.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/header.test.tsx`
Expected: FAIL with "Cannot find module '../src/components/Header'".

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/Header.tsx
import { NavLink } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import lessons from "../data/lessons.json";

export function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? "px-3 py-2 text-sm font-semibold text-amber-400 border-b-2 border-amber-500"
    : "px-3 py-2 text-sm text-zinc-300 hover:text-white border-b-2 border-transparent";
}

const LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/lecons", label: "Leçons" },
  { to: "/accords", label: "Accords" },
  { to: "/outils", label: "Outils" },
  { to: "/chansons", label: "Chansons" },
];

export default function Header() {
  const { progress } = useProgress();
  const done = progress.lessonsDone.length;
  const total = lessons.length;
  return (
    <header className="hidden md:flex sticky top-0 z-40 h-14 items-center gap-2 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-6">
      <NavLink to="/" className="font-bold text-amber-400 hover:text-amber-300 mr-4">
        🎸 Guitar Tutor
      </NavLink>
      <nav className="flex items-center gap-1" aria-label="Navigation principale">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navLinkClass}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2 text-xs text-zinc-400">
        <span>Progression {done}/{total}</span>
        <div className="h-1.5 w-20 bg-zinc-800 rounded" role="progressbar" aria-valuenow={total ? Math.round((done / total) * 100) : 0} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-1.5 bg-amber-500 rounded" style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} />
        </div>
      </div>
    </header>
  );
}
```

Puis modifier `src/App.tsx` : importer `Header` + `navLinkClass` + `NotFound` (Task 2), rendre `<Header />` comme premier enfant de `ProgressProvider`, remplacer `const link = ...` par `navLinkClass` pour la bottom-bar (ajouter `end` sur `/`, `aria-current` est automatique via NavLink), route `*` → `<NotFound />`, ajouter `md:pt-0` (le header sticky ne chevauche pas, aucun padding requis).

```tsx
// src/App.tsx (fichier complet après modif)
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Chords from "./pages/Chords";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Songs from "./pages/Songs";
import SongView from "./pages/SongView";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
import Header, { navLinkClass } from "./components/Header";
import { ProgressProvider } from "./context/ProgressContext";
const bottomLink = ({ isActive }: { isActive: boolean }) =>
  `flex-1 py-3 min-h-[44px] flex items-center justify-center text-sm ${isActive ? "text-amber-400 font-semibold" : "text-zinc-300"}`;
export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <Header />
        <div className="min-h-screen pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lecons" element={<Lessons />} />
            <Route path="/lecons/:id" element={<LessonView />} />
            <Route path="/accords" element={<Chords />} />
            <Route path="/accords/:nom" element={<Chords />} />
            <Route path="/outils" element={<Tools />} />
            <Route path="/chansons" element={<Songs />} />
            <Route path="/chansons/:id" element={<SongView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <nav className="fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 flex md:hidden" aria-label="Navigation mobile">
            <NavLink to="/" end className={bottomLink}>Accueil</NavLink>
            <NavLink to="/lecons" className={bottomLink}>Leçons</NavLink>
            <NavLink to="/accords" className={bottomLink}>Accords</NavLink>
            <NavLink to="/outils" className={bottomLink}>Outils</NavLink>
            <NavLink to="/chansons" className={bottomLink}>Chansons</NavLink>
          </nav>
        </div>
      </ProgressProvider>
    </BrowserRouter>
  );
}
```

Note : `NotFound` est créé en Task 2 — si Task 1 est exécutée seule, créer d'abord un placeholder `<div className="p-6">Page introuvable.</div>` est interdit (placeholder) : exécuter Task 1 et Task 2 dans cet ordre mais commiter Task 1 seulement quand `NotFound` existe, ou créer `NotFound` dès Task 1 Step 3 avec le code exact de la Task 2. Recommandé : implémenter `src/pages/NotFound.tsx` (code Task 2) pendant Task 1 et le laisser listé dans les deux commits de fichiers.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/header.test.tsx && npx vitest run`
Expected: PASS (2 nouveaux + 13 existants = 15 passed).

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx tests/header.test.tsx src/App.tsx src/pages/NotFound.tsx
git commit -m "feat: header desktop + liens actifs + page 404"
```

### Task 2: Fixes FR/SEO/titres + vérification finale

**Files:**
- Modify: `index.html:1-13`
- Modify: `src/pages/Chords.tsx` (ajout titre)
- Test: existing suite + `npx vite build`

**Interfaces:**
- Consumes: rien de nouveau.
- Produces: rien (polish seul).

- [ ] **Step 1: Modifier index.html**

```html
<!-- index.html : remplacer les lignes 2, 6-7 -->
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Guitar Tutor — apprends la guitare étape par étape : accords, leçons, métronome et chansons." />
    <meta name="theme-color" content="#09090b" />
    <title>Guitar Tutor</title>
  </head>
```

Fichier complet attendu : doctype, `lang="fr"`, head avec charset/icon/viewport/description/theme-color/title, body avec `#root` + script `/src/main.tsx` — le reste inchangé.

- [ ] **Step 2: Ajouter le titre manquant à Chords.tsx**

Lire `src/pages/Chords.tsx`, puis envelopper : ajouter `<h1 className="text-xl font-bold mb-3">Accords</h1>` comme premier enfant du `<main>`, sans toucher au reste (grille, ChordDiagram, ChordPlayer). Vérifier ensuite qu'aucune page n'a deux h1 : Home a déjà h1 (conservé) ; Lessons, Songs, Tools, LessonView, SongView ont h2 (conservés tels quels — le spec demande un cap logique unique par page, déjà le cas).

- [ ] **Step 3: Vérification finale**

Run: `npx vitest run && npx vite build`
Expected: 15 passed, `✓ built` sans erreur.

Manuel : `npm run dev` → desktop ≥768px : header visible, lien actif ambre, bottom-bar absente ; mobile : bottom-bar visible + actif, header absent ; `/nimportequoi` → NotFound avec boutons ; onglet navigateur : titre + `lang="fr"` dans le DOM.

- [ ] **Step 4: Commit**

```bash
git add index.html src/pages/Chords.tsx
git commit -m "feat: lang fr + meta + titre accords"
```

---

## Self-Review

- Spec §3 Header : Task 1 (sticky, hidden md:flex, logo, 5 NavLink isActive ambre + border, aria-current auto via NavLink — le test vérifie `aria-current="page"`, mini-progression X/12 + barre). §4 Bottom-bar : Task 1 (états actifs, pb-20 conservé). §5 Fixes : Task 2 (lang fr + description + theme-color, NotFound avec 2 boutons, titre Chords ; autres pages déjà à un cap unique — vérifié par grep : Home h1, 5 pages h2, Chords aucun → corrigé). §6 Non-régression : aucune route/donnée/composant métier touché ; 13 tests existants + 2 nouveaux ; vérif manuelle listée. Pas de TBD/TODO. Types cohérents : `navLinkClass({isActive})` partagé header/bottom-bar desktop ; bottom-bar a sa propre fonction tactile (min-h-44px) — noms distincts, pas de collision.
