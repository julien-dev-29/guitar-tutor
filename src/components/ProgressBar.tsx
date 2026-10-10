export default function ProgressBar({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div
      className="h-2 bg-zinc-800 rounded"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-2 bg-amber-500 rounded" style={{ width: `${pct}%` }} />
    </div>
  );
}
