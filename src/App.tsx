import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Chords from "./pages/Chords";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Songs from "./pages/Songs";
import SongView from "./pages/SongView";
import Tools from "./pages/Tools";
import { ProgressProvider } from "./context/ProgressContext";
const link = "flex-1 py-3 text-center text-sm";
export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <div className="min-h-screen pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lecons" element={<Lessons />} />
            <Route path="/lecons/:id" element={<LessonView />} />
            <Route path="/accords" element={<Chords />} />
            <Route path="/accords/:nom" element={<Chords />} />
            <Route path="/outils" element={<Tools />} />
            <Route path="/chansons" element={<Songs />} />
            <Route path="/chansons/:id" element={<SongView />} />
            <Route path="*" element={<div className="p-6">Page introuvable.</div>} />
          </Routes>
          <nav className="fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 flex md:hidden">
            <NavLink to="/" className={link}>Accueil</NavLink>
            <NavLink to="/lecons" className={link}>Leçons</NavLink>
            <NavLink to="/accords" className={link}>Accords</NavLink>
            <NavLink to="/outils" className={link}>Outils</NavLink>
            <NavLink to="/chansons" className={link}>Chansons</NavLink>
          </nav>
        </div>
      </ProgressProvider>
    </BrowserRouter>
  );
}
