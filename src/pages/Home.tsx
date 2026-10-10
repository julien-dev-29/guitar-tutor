import { Link } from "react-router-dom";
import lessons from "../data/lessons.json";
import { useProgress } from "../context/ProgressContext";
import ProgressBar from "../components/ProgressBar";
export default function Home() {
  const { progress } = useProgress();
  const done = progress.lessonsDone.length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const next: any =
    lessons.find((l: any) => !progress.lessonsDone.includes(l.id)) ??
    lessons[0];
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-amber-400">Guitar Tutor</h1>
      <p className="mt-2 text-zinc-300">
        Apprends la guitare, étape par étape.
      </p>
      <div className="mt-4 bg-zinc-900 p-4 rounded">
        <div className="text-sm text-zinc-400">
          Progression : {done}/{lessons.length} ({pct}%)
        </div>
        <div className="mt-2">
          <ProgressBar done={done} total={lessons.length} />
        </div>
        <Link
          to={`/lecons/${next.id}`}
          className="mt-3 inline-block min-h-[44px] px-4 py-2 rounded bg-amber-500 text-black font-semibold"
        >
          Reprendre : {next.title}
        </Link>
      </div>
    </main>
  );
}
