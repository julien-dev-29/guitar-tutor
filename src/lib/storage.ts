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
