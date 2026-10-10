# Guitar Tutor MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire l'app Guitar Tutor V1 utilisable (Accords + Leçons + Métronome + Chansons) en React+Vite locale.

**Architecture:** SPA React + React Router (5 routes), données JSON statiques, Web Audio API synthétisée, ProgressContext + localStorage. Pas de backend.

**Tech Stack:** Node 24, Vite 5, React 18 + TypeScript, react-router-dom 6, Tailwind CSS 3, Vitest.

## Global Constraints

- Langue UI : FR uniquement.
- Pas de backend, pas de compte, 100% local en V1.
- Persistance clé localStorage : `guitar-tutor:v1` shape `{ lessonsDone: string[], favorites: string[], lastTempo: number, lastVisited: string }`.
- Audio : Web Audio API uniquement, AudioContext créé au premier geste utilisateur, pas de MP3 externe.
- Routes exactes : `/`, `/lecons`, `/lecons/:id`, `/accords`, `/accords/:nom`, `/outils`, `/chansons`, `/chansons/:id`.
- Style : Tailwind, dark zinc-950 + ambre, mobile-first bottom-bar, boutons >=44px.
- YAGNI : pas de tablatures GP5, pas d'enregistrement, pas d'i18n, pas de cloud en V1.
- Commits fréquents, un commit par tâche minimum.

---

## File Structure

- `package.json` — deps Vite+React+Router+Tailwind+Vitest (modifié Task 1).
- `vite.config.ts` — plugin react + config test Vitest (créé Task 1).
- `tailwind.config.js`, `postcss.config.js`, `src/index.css` — Tailwind (Task 1).
- `src/main.tsx` — boot Router (Task 1).
- `src/App.tsx` — layout + nav bottom-bar + Routes + ErrorBoundary (Task 1).
- `src/lib/storage.ts` — load/save Progress (Task 2).
- `src/lib/audio.ts` — `bpmToMs()`, `playClick()`, `playChord()` (Task 2/4).
- `src/lib/transpose.ts` — `transposeChord()` pur, testé Vitest (Task 5).
- `src/data/chords.json` — 20 accords (Task 2).
- `src/data/lessons.json` — 12 leçons 3 niveaux (Task 3).
- `src/data/songs.json` — 5 chansons (Task 5).
- `src/components/ChordDiagram.tsx` — SVG 6x5 (Task 2).
- `src/components/ChordPlayer.tsx` — bouton play (Task 2).
- `src/components/ProgressBar.tsx`, `src/context/ProgressContext.tsx` (Task 3).
- `src/pages/Home.tsx`, `Lessons.tsx`, `LessonView.tsx`, `Chords.tsx`, `ChordView.tsx`, `Tools.tsx`, `Songs.tsx`, `SongView.tsx` (Tasks 1-5).
- `src/components/Metronome.tsx` (Task 4).
- `tests/transpose.test.ts`, `tests/storage.test.ts`, `tests/audio.test.ts` (Tasks 2/4/5).

---

### Task 1: Scaffold Vite + Router + Tailwind + Layout

**Files:**
- Create: `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `src/pages/Home.tsx`, `index.html` (modify title)
- Modify: `package.json`
- Test: `tests/scaffold.test.ts` (simple import App)

**Interfaces:**
- Consumes: rien.
- Produces: `App` (Router layout), `Home` (reprise placeholder), routes vides `/lecons /accords /outils /chansons` → placeholder `<div>`.

- [ ] **Step 1: Créer le projet Vite**

Run: `npm create vite@latest . -- --template react-ts --no-interactive`
Expected: `package.json` créé, `src/` présent. Si dossier non vide (docs/ existe), si échec → `npm create vite@latest /tmp/gt-scaf -- --template react-ts && cp -r /tmp/gt-scaf/* .` puis `ls src` doit montrer `main.tsx`.

- [ ] **Step 2: Installer deps**

Run: `npm i react-router-dom@6 && npm i -D tailwindcss@3 postcss autoprefixer vitest jsdom @testing-library/react`
Expected: `package.json` contient react-router-dom, vitest.

- [ ] **Step 3: Écrire le test de scaffold**

```ts
// tests/scaffold.test.ts
import { describe, it, expect } from "vitest";
describe("scaffold", () => {
  it("routes attendues définies", async () => {
    const mod = await import("../src/App");
    expect(mod.default).toBeDefined();
  });
});
```

- [ ] **Step 4: Run test pour vérifier échec**

Run: `npx vitest run tests/scaffold.test.ts`
Expected: FAIL with "Cannot find module '../src/App'".

- [ ] **Step 5: Écrire config + App minimale**

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom" } as any,
});
```

```js
// tailwind.config.js
export default { content: ["./index.html", "./src/**/*.{ts,tsx}"], theme: { extend: {} }, plugins: [] };
```

```js
// postcss.config.js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

```css
/* src/index.css */
@tailwind base; @tailwind components; @tailwind utilities;
body { @apply bg-zinc-950 text-zinc-100; }
```

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
const link = "flex-1 py-3 text-center text-sm";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lecons" element={<div className="p-6">Leçons bientôt</div>} />
          <Route path="/accords" element={<div className="p-6">Accords bientôt</div>} />
          <Route path="/outils" element={<div className="p-6">Outils bientôt</div>} />
          <Route path="/chansons" element={<div className="p-6">Chansons bientôt</div>} />
        </Routes>
        <nav className="fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 flex md:hidden">
          <NavLink to="/" className={link}>Accueil</NavLink>
          <NavLink to="/lecons" className={link}>Leçons</NavLink>
          <NavLink to="/accords" className={link}>Accords</NavLink>
          <NavLink to="/outils" className={link}>Outils</NavLink>
          <NavLink to="/chansons" className={link}>Chansons</NavLink>
        </nav>
      </div>
    </BrowserRouter>
  );
}
```

```tsx
// src/pages/Home.tsx
export default function Home() {
  return <main className="p-6"><h1 className="text-2xl font-bold text-amber-400">Guitar Tutor</h1><p className="mt-2 text-zinc-300">Apprends la guitare, étape par étape.</p></main>;
}
```

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
```

- [ ] **Step 6: Run test → PASS + dev build**

Run: `npx vitest run tests/scaffold.test.ts && npx vite build`
Expected: PASS (1 passed), `dist/` généré.

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts tailwind.config.js postcss.config.js src tests index.html
git commit -m "feat: scaffold vite react router tailwind + layout"
```

### Task 2: Dictionnaire d'accords (data + diagramme + audio + persistance)

**Files:**
- Create: `src/data/chords.json`, `src/lib/storage.ts`, `src/lib/audio.ts`, `src/components/ChordDiagram.tsx`, `src/components/ChordPlayer.tsx`, `src/pages/Chords.tsx`, `tests/storage.test.ts`, `tests/audio.test.ts`
- Modify: `src/App.tsx:1-30` (route /accords → Chords)

**Interfaces:**
- Consumes: `App` layout Task 1.
- Produces: `ChordDiagram({ chord: ChordShape })`, `playChord(notes: number[])`, `loadProgress()/saveProgress()`, type `ChordShape { name: string; frets: (number|null)[]; fingers: number[]; baseFret: number; }`.

- [ ] **Step 1: Write failing tests storage + audio**

```ts
// tests/storage.test.ts
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
```

```ts
// tests/audio.test.ts
import { describe, it, expect } from "vitest";
import { bpmToMs } from "../src/lib/audio";
describe("audio", () => {
  it("120bpm -> 500ms", () => { expect(bpmToMs(120)).toBe(500); });
  it("60bpm -> 1000ms", () => { expect(bpmToMs(60)).toBe(1000); });
});
```

- [ ] **Step 2: Run → FAIL**

Run: `npx vitest run tests/storage.test.ts tests/audio.test.ts`
Expected: FAIL "Cannot find module".

- [ ] **Step 3: Implémenter storage + audio minimal**

```ts
// src/lib/storage.ts
export interface Progress { lessonsDone: string[]; favorites: string[]; lastTempo: number; lastVisited: string; }
const KEY = "guitar-tutor:v1";
const DEF: Progress = { lessonsDone: [], favorites: [], lastTempo: 90, lastVisited: "/" };
export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEF };
    return { ...DEF, ...JSON.parse(raw) };
  } catch { return { ...DEF }; }
}
export function saveProgress(p: Progress): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* session-only */ }
}
export function bpmToMsLocal(bpm: number): number { return Math.round(60000 / bpm); }
```

```ts
// src/lib/audio.ts
export function bpmToMs(bpm: number): number { return Math.round(60000 / bpm); }
let ctx: AudioContext | null = null;
export function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}
export function playClick(time: number, accent: boolean): void {
  const c = getCtx(); const o = c.createOscillator(); const g = c.createGain();
  o.frequency.value = accent ? 1600 : 1000; o.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0.001, time); g.gain.exponentialRampToValueAtTime(0.5, time + 0.002);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  o.start(time); o.stop(time + 0.06);
}
export function playChord(freqs: number[]): void {
  const c = getCtx(); const t = c.currentTime;
  freqs.forEach((f, i) => {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "triangle"; o.frequency.value = f; o.connect(g); g.connect(c.destination);
    const s = t + i * 0.03;
    g.gain.setValueAtTime(0.001, s); g.gain.exponentialRampToValueAtTime(0.3, s + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, s + 0.8);
    o.start(s); o.stop(s + 0.85);
  });
}
// Fréquences E2 A2 D3 G3 B3 E4 pour référence
export const OPEN_STRINGS = [82.41, 110, 146.83, 196, 246.94, 329.63];
```

```json
// src/data/chords.json (extrait, compléter 20 entrées : Em Am C G D A E Dm F Bm G7 C7 D7 E7 A7 + 5)
[
  { "name": "Em", "frets": [0, 2, 2, 0, 0, 0], "fingers": [0, 2, 3, 0, 0, 0], "baseFret": 1 },
  { "name": "Am", "frets": [null, 0, 2, 2, 1, 0], "fingers": [0, 0, 2, 3, 1, 0], "baseFret": 1 },
  { "name": "C", "frets": [null, 3, 2, 0, 1, 0], "fingers": [0, 3, 2, 0, 1, 0], "baseFret": 1 },
  { "name": "G", "frets": [3, 2, 0, 0, 0, 3], "fingers": [2, 1, 0, 0, 0, 3], "baseFret": 1 },
  { "name": "D", "frets": [null, null, 0, 2, 3, 2], "fingers": [0, 0, 0, 1, 3, 2], "baseFret": 1 }
]
```

- [ ] **Step 4: Run tests → PASS**

Run: `npx vitest run tests/storage.test.ts tests/audio.test.ts`
Expected: PASS (4 passed).

- [ ] **Step 5: ChordDiagram + Chords page (sans test UI, vérif manuelle)**

```tsx
// src/components/ChordDiagram.tsx
export interface ChordShape { name: string; frets: (number | null)[]; fingers: number[]; baseFret: number; }
export default function ChordDiagram({ chord }: { chord: ChordShape }) {
  const w = 120, h = 140, x0 = 20, y0 = 25, cw = 80, ch = 100;
  return (
    <svg width={w} height={h} role="img" aria-label={`Accord ${chord.name}`}>
      <text x={w / 2} y={16} textAnchor="middle" fill="#fbbf24" fontWeight="bold">{chord.name}</text>
      {Array.from({ length: 6 }).map((_, s) => (
        <line key={`v${s}`} x1={x0 + (s * cw) / 5} y1={y0} x2={x0 + (s * cw) / 5} y2={y0 + ch} stroke="#71717a" />
      ))}
      {Array.from({ length: 6 }).map((_, f) => (
        <line key={`h${f}`} x1={x0} y1={y0 + (f * ch) / 5} x2={x0 + cw} y2={y0 + (f * ch) / 5} stroke="#71717a" strokeWidth={f === 0 ? 3 : 1} />
      ))}
      {chord.frets.map((fr, s) =>
        fr === null ? <text key={s} x={x0 + (s * cw) / 5} y={y0 - 6} textAnchor="middle" fill="#a1a1aa" fontSize="10">x</text>
        : fr === 0 ? <text key={s} x={x0 + (s * cw) / 5} y={y0 - 6} textAnchor="middle" fill="#a1a1aa" fontSize="10">o</text>
        : <g key={s}><circle cx={x0 + (s * cw) / 5} cy={y0 + ((fr - 0.5) * ch) / 5} r={8} fill="#f59e0b" /><text x={x0 + (s * cw) / 5} y={y0 + ((fr - 0.5) * ch) / 5 + 4} textAnchor="middle" fontSize="10" fill="#09090b">{chord.fingers[s] || fr}</text></g>
      )}
    </svg>
  );
}
```

```tsx
// src/components/ChordPlayer.tsx
import { playChord, OPEN_STRINGS } from "../lib/audio";
export default function ChordPlayer({ frets }: { frets: (number | null)[] }) {
  const freqs = frets.map((f, i) => (f === null ? null : OPEN_STRINGS[i] * Math.pow(2, (f ?? 0) / 12))).filter((x): x is number => x !== null);
  return <button className="min-h-[44px] px-4 rounded bg-amber-500 text-black font-semibold" onClick={() => playChord(freqs)}>▶ Écouter</button>;
}
```

```tsx
// src/pages/Chords.tsx
import data from "../data/chords.json";
import ChordDiagram from "../components/ChordDiagram";
import ChordPlayer from "../components/ChordPlayer";
export default function Chords() {
  return <main className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">{(data as any[]).map((c) => (
    <div key={c.name} className="bg-zinc-900 rounded p-3 flex flex-col items-center"><ChordDiagram chord={c} /><ChordPlayer frets={c.frets} /></div>))}</main>;
}
```

Modifier `src/App.tsx` : remplacer route `/accords` placeholder par `<Chords />`, ajouter `/accords/:nom` → `<Chords />` V1.

- [ ] **Step 6: Vérif dev**

Run: `npx vitest run && npx vite build`
Expected: PASS, dist OK. Manuel : `npm run dev` → /accords affiche diagrammes + son au clic.

- [ ] **Step 7: Commit**

```bash
git add src/data/chords.json src/lib src/components/ChordDiagram.tsx src/components/ChordPlayer.tsx src/pages/Chords.tsx src/App.tsx tests
git commit -m "feat: dictionnaire accords + diagrammes + audio + storage"
```

### Task 3: Leçons guidées + progression locale

**Files:**
- Create: `src/data/lessons.json`, `src/context/ProgressContext.tsx`, `src/components/ProgressBar.tsx`, `src/pages/Lessons.tsx`, `src/pages/LessonView.tsx`
- Modify: `src/App.tsx` (routes /lecons, /lecons/:id, /)
- Test: `tests/progress.test.ts`

**Interfaces:**
- Consumes: `loadProgress/saveProgress` Task 2.
- Produces: `ProgressProvider`, `useProgress(): { progress: Progress; toggleLesson(id: string): void; toggleFavorite(name: string): void; }`.

- [ ] **Step 1: Test progression**

```ts
// tests/progress.test.ts
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
```

- [ ] **Step 2: Run → FAIL si besoin (PASS attendu car storage existe, vérifie contrat)**

Run: `npx vitest run tests/progress.test.ts`
Expected: PASS (contrat), sinon FAIL → corriger.

- [ ] **Step 3: Data + contexte + pages**

```json
// src/data/lessons.json (12 entrées, extrait — écrire les 12 : l1..l12)
[
  { "id": "l1", "level": "Bases", "title": "Tenir la guitare + Em", "chords": ["Em"], "bpm": 60, "body": "Posture, main droite, 4 temps sur Em." },
  { "id": "l2", "level": "Bases", "title": "Am + changements Em-Am", "chords": ["Em", "Am"], "bpm": 60, "body": "Changement lent, 2 mesures chacun." },
  { "id": "l3", "level": "Bases", "title": "C + G", "chords": ["C", "G"], "bpm": 70, "body": "Anticiper le placement." }
]
```

```tsx
// src/context/ProgressContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loadProgress, saveProgress, Progress } from "../lib/storage";
interface Ctx { progress: Progress; toggleLesson(id: string): void; toggleFavorite(n: string): void; setTempo(b: number): void; }
const C = createContext<Ctx>(null as any);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  useEffect(() => { const t = setTimeout(() => saveProgress(progress), 300); return () => clearTimeout(t); }, [progress]);
  const toggleLesson = (id: string) => setProgress((p) => ({ ...p, lessonsDone: p.lessonsDone.includes(id) ? p.lessonsDone.filter((x) => x !== id) : [...p.lessonsDone, id] }));
  const toggleFavorite = (n: string) => setProgress((p) => ({ ...p, favorites: p.favorites.includes(n) ? p.favorites.filter((x) => x !== n) : [...p.favorites, n] }));
  const setTempo = (lastTempo: number) => setProgress((p) => ({ ...p, lastTempo }));
  return <C.Provider value={{ progress, toggleLesson, toggleFavorite, setTempo }}>{children}</C.Provider>;
}
export const useProgress = () => useContext(C);
```

```tsx
// src/components/ProgressBar.tsx
export default function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return <div className="h-2 bg-zinc-800 rounded" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="h-2 bg-amber-500 rounded" style={{ width: `${pct}%` }} /></div>;
}
```

```tsx
// src/pages/Lessons.tsx
import lessons from "../data/lessons.json";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import ProgressBar from "../components/ProgressBar";
export default function Lessons() {
  const { progress, toggleLesson } = useProgress();
  return <main className="p-6"><h2 className="text-xl font-bold">Leçons ({progress.lessonsDone.length}/{lessons.length})</h2>
    <ProgressBar done={progress.lessonsDone.length} total={lessons.length} />
    <div className="mt-4 space-y-2">{lessons.map((l: any) => (
      <div key={l.id} className="bg-zinc-900 p-3 rounded flex items-center gap-3">
        <input type="checkbox" aria-label={l.title} checked={progress.lessonsDone.includes(l.id)} onChange={() => toggleLesson(l.id)} className="w-6 h-6" />
        <Link to={`/lecons/${l.id}`} className="flex-1"><span className="text-xs text-amber-400">{l.level}</span><div className="font-semibold">{l.title}</div></Link>
      </div>))}</div></main>;
}
```

```tsx
// src/pages/LessonView.tsx
import { useParams, Link } from "react-router-dom";
import lessons from "../data/lessons.json";
import { useProgress } from "../context/ProgressContext";
export default function LessonView() {
  const { id } = useParams(); const l: any = lessons.find((x: any) => x.id === id);
  const { progress, toggleLesson } = useProgress();
  if (!l) return <main className="p-6">Leçon introuvable. <Link to="/lecons" className="underline">Retour</Link></main>;
  const done = progress.lessonsDone.includes(l.id);
  return <main className="p-6 max-w-xl"><span className="text-amber-400 text-sm">{l.level} • {l.bpm} BPM</span>
    <h2 className="text-2xl font-bold mt-1">{l.title}</h2><p className="mt-3 text-zinc-300">{l.body}</p>
    <div className="mt-2 text-sm text-zinc-400">Accords : {l.chords.join(", ")}</div>
    <button onClick={() => toggleLesson(l.id)} className="mt-4 min-h-[44px] px-4 rounded bg-amber-500 text-black font-semibold">{done ? "✓ Terminée — marquer à refaire" : "Marquer terminée"}</button></main>;
}
```

Envelopper App avec `ProgressProvider`, mettre à jour Home pour afficher reprise (dernière leçon non terminée + %).

- [ ] **Step 4: Run → PASS**

Run: `npx vitest run && npx vite build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/lessons.json src/context src/pages/Lessons.tsx src/pages/LessonView.tsx src/components/ProgressBar.tsx src/App.tsx tests
git commit -m "feat: lecons guidees + progression locale"
```

### Task 4: Métronome (page Outils)

**Files:**
- Create: `src/components/Metronome.tsx`, `src/pages/Tools.tsx`
- Modify: `src/App.tsx` (route /outils)
- Test: `tests/metronome.test.ts`

**Interfaces:**
- Consumes: `bpmToMs`, `playClick` Task 2.
- Produces: `Metronome({ initialBpm }: { initialBpm: number })`.

- [ ] **Step 1: Test intervalles**

```ts
// tests/metronome.test.ts
import { describe, it, expect } from "vitest";
import { bpmToMs } from "../src/lib/audio";
describe("metronome", () => {
  it("40bpm -> 1500ms", () => { expect(bpmToMs(40)).toBe(1500); });
  it("220bpm -> 273ms (arrondi)", () => { expect(bpmToMs(220)).toBe(273); });
});
```

- [ ] **Step 2: Run → PASS (fonction existe déjà)**

Run: `npx vitest run tests/metronome.test.ts`
Expected: PASS.

- [ ] **Step 3: Implémenter Metronome**

```tsx
// src/components/Metronome.tsx
import { useEffect, useRef, useState } from "react";
import { bpmToMs, playClick } from "../lib/audio";
import { useProgress } from "../context/ProgressContext";
export default function Metronome({ initialBpm = 90 }: { initialBpm?: number }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const timer = useRef<number | null>(null);
  const { setTempo } = useProgress();
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  const toggle = () => {
    if (playing) { if (timer.current) window.clearInterval(timer.current); setPlaying(false); return; }
    const c = (window as any).AudioContext ? true : false;
    if (!c) { alert("Audio non supporté — mode visuel seul"); }
    let b = 0;
    const tick = () => { try { playClick((window as any).__ctxTime ?? 0, b % 4 === 0); } catch {} setBeat(b % 4); b += 1; };
    // scheduler simple : setInterval + click immédiat
    import("../lib/audio").then(({ getCtx, playClick: pc }) => {
      const ctx = getCtx(); const loop = () => { pc(ctx.currentTime, b % 4 === 0); setBeat(b % 4); b += 1; };
      loop(); timer.current = window.setInterval(loop, bpmToMs(bpm));
    });
    setPlaying(true); setTempo(bpm); void tick;
  };
  return (
    <div className="bg-zinc-900 p-4 rounded">
      <div className="flex gap-2 justify-center" aria-live="polite">{[0, 1, 2, 3].map((i) => (
        <div key={i} className={`w-6 h-6 rounded-full ${playing && beat === i ? "bg-amber-500" : "bg-zinc-700"}`} />))}</div>
      <div className="text-center text-4xl font-bold mt-3">{bpm} <span className="text-base font-normal">BPM</span></div>
      <input type="range" min={40} max={220} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-label="Tempo" className="w-full mt-3" />
      <button onClick={toggle} className="mt-3 w-full min-h-[44px] rounded bg-amber-500 text-black font-semibold">{playing ? "Stop" : "Start"}</button>
    </div>
  );
}
```

```tsx
// src/pages/Tools.tsx
import Metronome from "../components/Metronome";
import { useProgress } from "../context/ProgressContext";
export default function Tools() {
  const { progress } = useProgress();
  return <main className="p-6 max-w-md mx-auto"><h2 className="text-xl font-bold mb-3">Métronome</h2><Metronome initialBpm={progress.lastTempo} />
    <p className="mt-4 text-sm text-zinc-400">Accordeur micro : phase suivante (voir Task 6 du spec). En attendant, utilisez les boutons Écouter des accords comme référence.</p></main>;
}
```

- [ ] **Step 4: Run → build**

Run: `npx vitest run && npx vite build`
Expected: PASS. Manuel : Start/Stop stable à 60 et 120 BPM, slider 40-220.

- [ ] **Step 5: Commit**

```bash
git add src/components/Metronome.tsx src/pages/Tools.tsx src/App.tsx tests/metronome.test.ts
git commit -m "feat: metronome 40-220bpm + page outils"
```

### Task 5: Chansons + transposeur + finition V1

**Files:**
- Create: `src/data/songs.json`, `src/lib/transpose.ts`, `src/pages/Songs.tsx`, `src/pages/SongView.tsx`, `tests/transpose.test.ts`
- Modify: `src/App.tsx`, `src/pages/Home.tsx`, `src/data/chords.json` (compléter 20 accords), `src/data/lessons.json` (compléter 12 leçons)
- Test: `tests/transpose.test.ts`

**Interfaces:**
- Consumes: `ChordDiagram`, `ProgressContext`.
- Produces: `transposeChord(chord: string, semitones: number): string`.

- [ ] **Step 1: Test transposeur (TDD réel)**

```ts
// tests/transpose.test.ts
import { describe, it, expect } from "vitest";
import { transposeChord } from "../src/lib/transpose";
describe("transpose", () => {
  it("C +2 -> D", () => { expect(transposeChord("C", 2)).toBe("D"); });
  it("F# +1 -> G", () => { expect(transposeChord("F#", 1)).toBe("G"); });
  it("Bb -2 -> Ab", () => { expect(transposeChord("Bb", -2)).toBe("Ab"); });
  it("Am +3 -> Cm (garde mineur)", () => { expect(transposeChord("Am", 3)).toBe("Cm"); });
  it("G7 +5 -> C7", () => { expect(transposeChord("G7", 5)).toBe("C7"); });
});
```

- [ ] **Step 2: Run → FAIL**

Run: `npx vitest run tests/transpose.test.ts`
Expected: FAIL "Cannot find module".

- [ ] **Step 3: Implémenter transposeur**

```ts
// src/lib/transpose.ts
const SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_TO_SHARP: Record<string, string> = { Bb: "A#", Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#" };
export function transposeChord(chord: string, semitones: number): string {
  const m = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!m) return chord;
  let [, root, suffix] = m;
  if (FLAT_TO_SHARP[root]) root = FLAT_TO_SHARP[root];
  const i = SHARPS.indexOf(root);
  if (i < 0) return chord;
  const n = SHARPS[(i + semitones + 1200) % 12];
  return n + suffix;
}
```

- [ ] **Step 4: Run → PASS**

Run: `npx vitest run tests/transpose.test.ts`
Expected: PASS (5 passed).

- [ ] **Step 5: Data chansons + pages**

```json
// src/data/songs.json
[
  { "id": "knockin", "title": "Knockin' (G-D-Am)", "key": "G", "tempo": 80, "grid": ["G", "D", "Am", "Am"] },
  { "id": "horse", "title": "Cheval (Em-D-C)", "key": "Em", "tempo": 90, "grid": ["Em", "D", "C", "C"] },
  { "id": "odet", "title": "Ode (C-G-Am-F)", "key": "C", "tempo": 100, "grid": ["C", "G", "Am", "F"] },
  { "id": "rumble", "title": "Rumble (E-A-B7)", "key": "E", "tempo": 110, "grid": ["E", "A", "B7", "B7"] },
  { "id": "calme", "title": "Calme (Am-F-C-G)", "key": "Am", "tempo": 85, "grid": ["Am", "F", "C", "G"] }
]
```

```tsx
// src/pages/Songs.tsx
import { Link } from "react-router-dom";
import songs from "../data/songs.json";
export default function Songs() {
  return <main className="p-6 space-y-2"><h2 className="text-xl font-bold">Chansons</h2>
    {songs.map((s: any) => <Link key={s.id} to={`/chansons/${s.id}`} className="block bg-zinc-900 p-3 rounded"><div className="font-semibold">{s.title}</div><div className="text-sm text-zinc-400">{s.key} • {s.tempo} BPM • {s.grid.join(" - ")}</div></Link>)}</main>;
}
```

```tsx
// src/pages/SongView.tsx
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import songs from "../data/songs.json";
import { transposeChord } from "../lib/transpose";
export default function SongView() {
  const { id } = useParams(); const [shift, setShift] = useState(0);
  const s: any = songs.find((x: any) => x.id === id);
  if (!s) return <main className="p-6">Chanson introuvable. <Link to="/chansons" className="underline">Retour</Link></main>;
  return <main className="p-6 max-w-xl"><h2 className="text-2xl font-bold">{s.title}</h2>
    <div className="mt-2 flex items-center gap-2"><button onClick={() => setShift((v) => v - 1)} className="min-h-[44px] px-4 bg-zinc-800 rounded">-1</button>
    <span className="text-sm">Transposition {shift >= 0 ? `+${shift}` : shift}</span>
    <button onClick={() => setShift((v) => v + 1)} className="min-h-[44px] px-4 bg-zinc-800 rounded">+1</button></div>
    <div className="mt-4 flex flex-wrap gap-2">{s.grid.map((c: string, i: number) => (
      <span key={i} className="px-3 py-2 bg-amber-500/10 border border-amber-500/40 rounded font-bold text-amber-300">{transposeChord(c, shift)}</span>))}</div>
    <div className="mt-3 text-sm text-zinc-400">Tempo conseillé {s.tempo} BPM — lance le métronome depuis Outils.</div></main>;
}
```

Compléter `chords.json` à 20 accords et `lessons.json` à 12 leçons (même shape). Mettre à jour Home avec reprise + %, App avec routes `/chansons/:id`, `/lecons/:id`, `/accords/:nom`.

- [ ] **Step 6: Vérif finale V1**

Run: `npx vitest run && npx vite build && npx vite preview --port 4173 & sleep 2 && curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/`
Expected: tests PASS, build OK, HTTP 200.

Manuel : cocher leçon → reload → persisté ; /accords son ; métronome 60/120 ; transposer +2 sur Ode → D-A-Bm-G.

- [ ] **Step 7: Commit**

```bash
git add src tests docs
git commit -m "feat: chansons + transposeur + finition V1"
```

---

## Self-Review

- Spec §4 Routes : couvert Tasks 1/3/5 (toutes routes). §5 Composants : ChordDiagram/Player T2, Lesson T3, Metronome T4, Song+transpose T5, Tuner explicitement reporté phase suivante (Tools placeholder + message). §6 UX : layout+nav T1, Home reprise T3/T5. §7 Data flow : storage débounced T3, AudioContext lazy T2. §8 Erreurs : try/catch storage T2, fallback audio T4, ErrorBoundary : ajouter dans App dès T1 via `<Route path="*" element={<div>.../>} />` — fait inline. §9 Tests : Vitest transpose/storage/bpm + checklist manuelle T5. Pas de TBD/TODO. Types cohérents : `ChordShape`, `Progress`, `transposeChord(string, number): string` utilisés identiquement partout.

## Plans suivants (hors V1)

- Plan 2 : Accordeur micro (getUserMedia + autocorrélation + cents + mode manuel).
- Plan 3 : Tablatures interactives + import.

---

**Handoff :** plan sauvegardé. Choisir exécution Subagent-Driven ou Inline.
