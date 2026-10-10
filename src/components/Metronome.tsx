import { useEffect, useRef, useState } from "react";
import { bpmToMs, getCtx, playClick } from "../lib/audio";
import { useProgress } from "../context/ProgressContext";

export default function Metronome({ initialBpm = 90 }: { initialBpm?: number }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const timer = useRef<number | null>(null);
  const beatRef = useRef(0);
  const { setTempo } = useProgress();

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  };

  const start = (tempo: number) => {
    let ctx: AudioContext | null = null;
    try {
      ctx = getCtx();
    } catch {
      alert("Audio non supporté — mode visuel seul");
    }
    beatRef.current = 0;
    const loop = () => {
      const b = beatRef.current;
      if (ctx) {
        try { playClick(ctx.currentTime, b % 4 === 0); } catch { /* visuel seul */ }
      }
      setBeat(b % 4);
      beatRef.current = b + 1;
    };
    loop();
    timer.current = window.setInterval(loop, bpmToMs(tempo));
    setPlaying(true);
    setTempo(tempo);
  };

  const toggle = () => {
    if (playing) { stop(); return; }
    start(bpm);
  };

  // Slider live : relance l'intervalle au nouveau tempo si en cours
  const onTempoChange = (v: number) => {
    setBpm(v);
    if (playing) {
      if (timer.current !== null) window.clearInterval(timer.current);
      const ctx = getCtx();
      timer.current = window.setInterval(() => {
        const b = beatRef.current;
        try { playClick(ctx.currentTime, b % 4 === 0); } catch { /* visuel seul */ }
        setBeat(b % 4);
        beatRef.current = b + 1;
      }, bpmToMs(v));
      setTempo(v);
    }
  };

  useEffect(() => () => { if (timer.current !== null) window.clearInterval(timer.current); }, []);

  return (
    <div className="bg-zinc-900 p-4 rounded">
      <div className="flex gap-2 justify-center" aria-live="polite">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-6 h-6 rounded-full ${playing && beat === i ? "bg-amber-500" : "bg-zinc-700"}`} />
        ))}
      </div>
      <div className="text-center text-4xl font-bold mt-3">{bpm} <span className="text-base font-normal">BPM</span></div>
      <input type="range" min={40} max={220} value={bpm} onChange={(e) => onTempoChange(Number(e.target.value))} aria-label="Tempo" className="w-full mt-3" />
      <button onClick={toggle} className="mt-3 w-full min-h-[44px] rounded bg-amber-500 text-black font-semibold">{playing ? "Stop" : "Start"}</button>
    </div>
  );
}
