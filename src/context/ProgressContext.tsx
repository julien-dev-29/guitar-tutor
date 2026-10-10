import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loadProgress, saveProgress } from "../lib/storage";
import type { Progress } from "../lib/storage";
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
