import { Link } from "react-router-dom";
import songs from "../data/songs.json";
export default function Songs() {
  return <main className="p-6 space-y-2"><h2 className="text-xl font-bold">Chansons</h2>
    {songs.map((s: any) => <Link key={s.id} to={`/chansons/${s.id}`} className="block bg-zinc-900 p-3 rounded"><div className="font-semibold">{s.title}</div><div className="text-sm text-zinc-400">{s.key} • {s.tempo} BPM • {s.grid.join(" - ")}</div></Link>)}</main>;
}
