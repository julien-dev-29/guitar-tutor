export function bpmToMs(bpm: number): number { return Math.round(60000 / bpm); }
let ctx: AudioContext | null = null;
export function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}
export function playClick(time: number, accent: boolean): void {
  const c = getCtx(); const o = c.createOscillator(); const g = c.createGain();
  o.frequency.value = accent ? 1600 : 1000; o.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0.001, time); g.gain.exponentialRampToValueAtTime(0.5, time + 0.002);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  o.start(time); o.stop(time + 0.06);
}
export function playChord(freqs: number[]): void {
  const c = getCtx(); const t = c.currentTime;
  freqs.forEach((f, i) => {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "triangle"; o.frequency.value = f; o.connect(g); g.connect(c.destination);
    const s = t + i * 0.03;
    g.gain.setValueAtTime(0.001, s); g.gain.exponentialRampToValueAtTime(0.3, s + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, s + 0.8);
    o.start(s); o.stop(s + 0.85);
  });
}
// Fréquences E2 A2 D3 G3 B3 E4 pour référence
export const OPEN_STRINGS = [82.41, 110, 146.83, 196, 246.94, 329.63];
