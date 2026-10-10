import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-amber-400">Page introuvable</h1>
      <p className="mt-2 text-zinc-300">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center px-4 py-2 rounded bg-amber-500 text-black font-semibold"
        >
          Accueil
        </Link>
        <Link
          to="/lecons"
          className="inline-flex min-h-[44px] items-center px-4 py-2 rounded border border-zinc-700 text-zinc-200"
        >
          Voir les leçons
        </Link>
      </div>
    </main>
  );
}
