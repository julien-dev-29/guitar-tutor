# UX Navigation — Design Spec (2026-10-10)

## 1. Constat
- La bottom-bar n'existe que sur mobile (`md:hidden`) : sur desktop, aucune navigation visible.
- Aucun état actif (NavLink sans style actif), pas de header/marque, pas d'indication de progression globale hors Accueil.
- `index.html` en `lang="en"` alors que l'UI est FR ; route `*` = simple div « Page introuvable » ; hiérarchie de titres incohérente.

## 2. Approche retenue : header hybride
- Header sticky desktop + bottom-bar mobile conservée (recommandé vs header unique qui sacrifie l'ergonomie pouce, vs sidebar overkill pour 5 liens).
- Contenu essentiel uniquement : pas de favoris ni d'accès rapide dans cette itération (YAGNI).

## 3. Header (nouveau `src/components/Header.tsx`)
- Visible `hidden md:flex`, `sticky top-0 z-40`, fond `bg-zinc-900/95 backdrop-blur`, bordure `border-b border-zinc-800`.
- Gauche : logo lien `/` — « 🎸 Guitar Tutor » (`font-bold`, ambre au survol).
- Centre/gauche : 5 `NavLink` (/, /lecons, /accords, /outils, /chansons), classe fonction `isActive` → actif : `text-amber-400` + `border-b-2 border-amber-500`, inactif : `text-zinc-300 hover:text-white`. `aria-current="page"` quand actif.
- Droite : mini-progression via `useProgress()` — « X/12 » + mini-barre (`w-20`, réutilise le style ProgressBar) ; masquée si `lessons.length === 0`.
- Hauteur `h-14` ; contenu principal paddé en conséquence (pas de chevauchement).

## 4. Bottom-bar mobile (existant, `src/App.tsx`)
- Conservée telle quelle en structure ; ajoute état actif identique au header (fonction de classe `isActive`).
- `aria-current="page"` sur le lien actif ; `pb-20` conservé sur mobile.

## 5. Petits fixes inclus
- `index.html` : `lang="fr"`, `<meta name="description" content="...">` FR, `<meta name="theme-color" content="#09090b">`. Titre inchangé.
- Page `NotFound` (`src/pages/NotFound.tsx`) : titre « Page introuvable », message FR, boutons « Accueil » (/) et « Voir les leçons » (/lecons). Route `*` → `<NotFound />`.
- Titres : chaque page expose un cap logique unique (Home h1 existant conservé ; autres pages : vérifier un seul titre principal de premier niveau par page, sans changer le contenu métier).

## 6. Non-régression
- Aucun changement de routes, de données JSON, de composants métier (ChordDiagram, Metronome, SongView, transposeur, storage).
- Tests Vitest existants (6 fichiers / 13 tests) doivent rester verts.
- Nouveau test : rendu Header + bottom-bar sous MemoryRouter, vérifie lien actif (`aria-current`) et affichage progression.
- Vérif manuelle : mobile (bottom-bar visible + actif), desktop ≥768px (header visible + actif, bottom-bar absente), route inconnue → NotFound.

## 7. Hors-scope (YAGNI)
Pas de recherche/filtres, pas de sidebar, pas de favoris dans le header, pas de changement visuel des pages métier, pas d'i18n.

---
Validé avec l'utilisateur le 2026-10-10. Approche : hybride, essentiel, avec petits fixes.
