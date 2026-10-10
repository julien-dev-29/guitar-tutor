import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Chords from "./pages/Chords";
const link = "flex-1 py-3 text-center text-sm";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lecons" element={<div className="p-6">Leçons bientôt</div>} />
          <Route path="/accords" element={<Chords />} />
          <Route path="/accords/:nom" element={<Chords />} />
          <Route path="/outils" element={<div className="p-6">Outils bientôt</div>} />
          <Route path="/chansons" element={<div className="p-6">Chansons bientôt</div>} />
        </Routes>
        <nav className="fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 flex md:hidden">
          <NavLink to="/" className={link}>Accueil</NavLink>
          <NavLink to="/lecons" className={link}>Leçons</NavLink>
          <NavLink to="/accords" className={link}>Accords</NavLink>
          <NavLink to="/outils" className={link}>Outils</NavLink>
          <NavLink to="/chansons" className={link}>Chansons</NavLink>
        </nav>
      </div>
    </BrowserRouter>
  );
}
