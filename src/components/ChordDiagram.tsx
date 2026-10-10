export interface ChordShape { name: string; frets: (number | null)[]; fingers: number[]; baseFret: number; }
export default function ChordDiagram({ chord }: { chord: ChordShape }) {
  const w = 120, h = 140, x0 = 20, y0 = 25, cw = 80, ch = 100;
  return (
    <svg width={w} height={h} role="img" aria-label={`Accord ${chord.name}`}>
      <text x={w / 2} y={16} textAnchor="middle" fill="#fbbf24" fontWeight="bold">{chord.name}</text>
      {Array.from({ length: 6 }).map((_, s) => (
        <line key={`v${s}`} x1={x0 + (s * cw) / 5} y1={y0} x2={x0 + (s * cw) / 5} y2={y0 + ch} stroke="#71717a" />
      ))}
      {Array.from({ length: 6 }).map((_, f) => (
        <line key={`h${f}`} x1={x0} y1={y0 + (f * ch) / 5} x2={x0 + cw} y2={y0 + (f * ch) / 5} stroke="#71717a" strokeWidth={f === 0 ? 3 : 1} />
      ))}
      {chord.frets.map((fr, s) =>
        fr === null ? <text key={s} x={x0 + (s * cw) / 5} y={y0 - 6} textAnchor="middle" fill="#a1a1aa" fontSize="10">x</text>
        : fr === 0 ? <text key={s} x={x0 + (s * cw) / 5} y={y0 - 6} textAnchor="middle" fill="#a1a1aa" fontSize="10">o</text>
        : <g key={s}><circle cx={x0 + (s * cw) / 5} cy={y0 + ((fr - 0.5) * ch) / 5} r={8} fill="#f59e0b" /><text x={x0 + (s * cw) / 5} y={y0 + ((fr - 0.5) * ch) / 5 + 4} textAnchor="middle" fontSize="10" fill="#09090b">{chord.fingers[s] || fr}</text></g>
      )}
    </svg>
  );
}
