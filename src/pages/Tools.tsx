import Metronome from "../components/Metronome";
import { useProgress } from "../context/ProgressContext";

export default function Tools() {
  const { progress } = useProgress();
  return (
    <main className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Métronome</h2>
      <Metronome initialBpm={progress.lastTempo} />
      <p className="mt-4 text-sm text-zinc-400">Accordeur micro : phase suivante (voir Task 6 du spec). En attendant, utilisez les boutons Écouter des accords comme référence.</p>
    </main>
  );
}
