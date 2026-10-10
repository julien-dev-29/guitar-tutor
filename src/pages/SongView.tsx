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
