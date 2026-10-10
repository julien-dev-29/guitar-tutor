import { playChord, OPEN_STRINGS } from "../lib/audio";
export default function ChordPlayer({ frets }: { frets: (number | null)[] }) {
  const freqs = frets.map((f, i) => (f === null ? null : OPEN_STRINGS[i] * Math.pow(2, (f ?? 0) / 12))).filter((x): x is number => x !== null);
  return <button className="min-h-[44px] px-4 rounded bg-amber-500 text-black font-semibold" onClick={() => playChord(freqs)}>▶ Écouter</button>;
}
