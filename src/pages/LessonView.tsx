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
