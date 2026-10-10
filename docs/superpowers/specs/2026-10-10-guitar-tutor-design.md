# Guitar Tutor — Design Spec (2026-10-10)

## 1. Vision
Application web pour apprendre la guitare, parcours débutant total → intermédiaire autonome. Mobile-first, utilisable sans compte, 100% locale en V1.

## 2. Utilisateurs cibles
- Débutant total : posture, premiers accords ouverts (Em, Am, C, G, D), rythme simple, première chanson en 7 jours.
- Intermédiaire : barrés (F, Bm), arpèges, gammes pentatoniques, transposition, autonomie.
- Succès V1 : finir 12 leçons, jouer 5 chansons, s'accorder + tenir un tempo à 90 BPM.

## 3. Approche retenue : MVP progressif
- Phase 1 (V1) : Dictionnaire 20 accords + 12 leçons + métronome simple + 5 chansons. Accordeur micro en phase 1b.
- Phase 2 (post-V1) : comptes cloud, tablatures interactives, enregistrement / analyse audio, import MusicXML.
- Justification : livrable utilisable en <1 semaine, chaque module testable isolément, pas de backend requis.

## 4. Architecture
- **Stack** : React + Vite + React Router + Tailwind CSS. Hébergement statique (Netlify/Vercel/GitHub Pages).
- **Routes** :
  - `/` Accueil (reprise, progression globale, accès rapide)
  - `/lecons` + `/lecons/:id`
  - `/accords` + `/accords/:nom`
  - `/outils` (métronome + accordeur)
  - `/chansons` + `/chansons/:id`
- **Audio** : Web Audio API uniquement, sons synthétisés (oscillateurs + Karplus-Strong simplifié pour corde). Pas de fichiers MP3 externes en V1.
- **Données** : JSON statiques dans `src/data/` : `chords.json` (20 accords : doigtés, frettes, notes), `lessons.json` (12 leçons : titre, niveau, markdown, accords liés, exercice BPM), `songs.json` (5 chansons : grille, tempo, tonalité).
- **Persistance** : localStorage clé `guitar-tutor:v1` → { lessonsDone: string[], favorites: string[], lastTempo: number, lastVisited: string }.
- **Pas de backend en V1.**

## 5. Composants
- `ChordDiagram` (SVG 6 cordes x 5 frettes, doigts, barrés, mute) — props: chord, size. Utilisé dans dictionnaire, leçons, chansons.
- `ChordPlayer` — bouton play → synthétise strum via Web Audio.
- `LessonCard` + `LessonView` (markdown, checklist exercice, bouton « Marquer terminé »).
- `Metronome` (40-220 BPM, signatures 4/4 3/4 6/8, tap-tempo, visuel + clic).
- `Tuner` (getUserMedia + autocorrélation, affichage cents, cordes EADGBE, mode manuel si refus micro).
- `SongView` (grille accords, transposeur +/- demi-tons, capo suggéré, scroll auto optionnel).
- `ProgressBar` + `HomeResume` (reprise dernière leçon).
- Isolation : chaque composant reçoit données via props, aucune dépendance croisée sauf `lib/audio.ts` et `lib/storage.ts`.

## 6. UX / UI
- Mobile-first, bottom-bar nav (5 icônes), desktop : sidebar.
- Dark mode permanent, palette bois/scène (ambre #f59e0b, fond zinc-950, carte zinc-900).
- Accueil : « Reprendre : Leçon 4 — Changements C-G » + % global + 3 raccourcis.
- Accessibilité : boutons ≥44px, contrastes AA, métronome visuel + sonore, diagrammes avec labels texte.

## 7. Data flow
1. App charge JSON statiques au build.
2. `storage.ts` lit localStorage au boot → contexte `ProgressContext`.
3. Action utilisateur (terminer leçon, favori, tempo) → update contexte → écriture localStorage débounced 300ms.
4. Audio : UI → `audio.ts` → AudioContext lazy (créé au premier geste utilisateur pour respecter autoplay policy).

## 8. Gestion d'erreurs
- Micro refusé/indisponible : bannière explicative + accordeur manuel (boutons référence sonore par corde).
- Navigateur sans Web Audio : fallback visuel (métronome clignotant sans son, diagrammes sans audio) + message.
- localStorage plein/bloqué : mode session-only + toast, pas de crash.
- Donnée JSON invalide : ErrorBoundary par route + page « Contenu indisponible ».

## 9. Tests
- Vitest unitaires : transpositeur (ex : C +2 → D, F# +1 → G), parsing doigtés, calcul BPM→intervalle.
- Checklist manuelle : 12 leçons cochables, persistance après reload, métronome stable 60/120 BPM, accordeur détecte Mi grave ±5 cents, 5 chansons transposables.
- Lighthouse ≥90 perf/accessibilité sur mobile.

## 10. Hors-scope V1 (YAGNI)
Pas de comptes, pas de backend, pas de tablatures GP5/MusicXML, pas d'enregistrement audio, pas de communauté/partage, pas d'i18n (FR uniquement).

## 11. Plan de livraison
1. Scaffold Vite + router + Tailwind + layout.
2. `chords.json` + `ChordDiagram` + `ChordPlayer` → page Accords.
3. `lessons.json` + pages Leçons + progression locale.
4. Métronome → page Outils.
5. `songs.json` + transposeur → page Chansons.
6. Accordeur micro.
7. Polish Accueil + tests + déploiement.

---
Validé avec l'utilisateur le 2026-10-10. Approche : MVP progressif, React+Vite, localStorage.
