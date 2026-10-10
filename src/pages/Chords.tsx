import data from "../data/chords.json";
import ChordDiagram, { type ChordShape } from "../components/ChordDiagram";
import ChordPlayer from "../components/ChordPlayer";
export default function Chords() {
  return <main className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4"><h1 className="text-xl font-bold mb-3 col-span-full">Accords</h1>{(data as ChordShape[]).map((c) => (
    <div key={c.name} className="bg-zinc-900 rounded p-3 flex flex-col items-center"><ChordDiagram chord={c} /><ChordPlayer frets={c.frets} /></div>))}</main>;
}
