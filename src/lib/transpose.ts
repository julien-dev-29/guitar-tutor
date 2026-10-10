const SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_TO_SHARP: Record<string, string> = { Bb: "A#", Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#" };
const SHARP_TO_FLAT: Record<string, string> = { "A#": "Bb", "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab" };
export function transposeChord(chord: string, semitones: number): string {
  const m = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!m) return chord;
  let [, root, suffix] = m;
  const wasFlat = root.includes("b");
  if (FLAT_TO_SHARP[root]) root = FLAT_TO_SHARP[root];
  const i = SHARPS.indexOf(root);
  if (i < 0) return chord;
  let n = SHARPS[(i + semitones + 1200) % 12];
  if (wasFlat && SHARP_TO_FLAT[n]) n = SHARP_TO_FLAT[n];
  return n + suffix;
}
