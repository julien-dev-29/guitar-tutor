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
