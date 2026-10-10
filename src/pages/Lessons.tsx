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
