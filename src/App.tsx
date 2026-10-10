import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Chords from "./pages/Chords";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Songs from "./pages/Songs";
import SongView from "./pages/SongView";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { ProgressProvider } from "./context/ProgressContext";
const bottomLink = ({ isActive }: { isActive: boolean }) =>
  `flex-1 py-3 min-h-[44px] flex items-center justify-center text-sm ${isActive ? "text-amber-400 font-semibold" : "text-zinc-300"}`;
export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <Header />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <nav className="fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 flex md:hidden" aria-label="Navigation mobile">
            <NavLink to="/" end className={bottomLink}>Accueil</NavLink>
            <NavLink to="/lecons" className={bottomLink}>Leçons</NavLink>
            <NavLink to="/accords" className={bottomLink}>Accords</NavLink>
            <NavLink to="/outils" className={bottomLink}>Outils</NavLink>
            <NavLink to="/chansons" className={bottomLink}>Chansons</NavLink>
          </nav>
        </div>
      </ProgressProvider>
    </BrowserRouter>
  );
}
