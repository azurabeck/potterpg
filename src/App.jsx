import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { Routes, Route, NavLink } from "react-router-dom";
import { BoltIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon, CodeBracketIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import AuthModal from "./components/AuthModal/index.jsx";
import Spells from "./pages/Spells";
import Potions from "./pages/Potions";
import Characters from "./pages/Characters";
import Movies from "./pages/Movies";
import Books from "./pages/Books";
import Creatures from "./pages/Creatures"
import RPG_SpellsRules from "./pages/RPG/SpellRules"
import RPG_Sheet from "./pages/RPG/Sheet/index.jsx"

const App = () => {
   const [rpgApiMode, setRpgApiMode] = useState(false);
   const [openAuth, setOpenAuth] = useState(true)
   const [user, setUser] = useState(null);
   const [, setAuthLoading] = useState(true);

   const menuClass = ({ isActive }) =>
      `cursor-pointer hover:text-yellow-400 ${
         isActive
            ? "text-yellow-400"
            : "text-gray-400"
      }`;

   const modeIconClass = (isActive) =>
      `h-5 w-5 cursor-pointer hover:text-yellow-400 ${
         isActive
            ? "text-yellow-400"
            : "text-gray-400"
      }`;

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
         setAuthLoading(false);

         if (currentUser) {
            setOpenAuth(false);
         }
   });

   return () => unsubscribe();
}, []);

   return (
      <>
         <div>
            <header className="sticky top-0 z-50 w-full shadow-md bg-[#2b0038] flex items-center justify-between p-4 h-[65px]">
               <div className="flex items-center gap-2 text-[18px] font-normal">
                  <BoltIcon className="h-5 w-5 text-yellow-400" /> PotterAPI
               </div>

               <nav className="flex gap-10 text-[14px] font-normal">
                  {!rpgApiMode && (
                     <>
                        <NavLink to="/" className={menuClass}> Feitiços </NavLink>
                        <NavLink to="/potions" className={menuClass}> Poções </NavLink>
                        <NavLink to="/characters" className={menuClass}> Personagens </NavLink>
                        <NavLink to="/creatures" className={menuClass}> Criaturas </NavLink>
                        <NavLink to="/movies" className={menuClass}> Filmes </NavLink>
                        <NavLink to="/books" className={menuClass}> Livros </NavLink>
                     </>
                  )}

                  {rpgApiMode && (
                     <>
                        <NavLink to="/rpg/spells" className={menuClass}> Feitiços RPG </NavLink>
                        <NavLink to="/rpg/classes" className={menuClass}> Classes </NavLink>
                        <NavLink to="/rpg/campaigns" className={menuClass}> Campanhas </NavLink>
                     </>
                  )}

                  {user && (
                     <NavLink to="/rpg/sheet" className={menuClass}>
                        Minha Ficha
                     </NavLink>
                  )}

                  <button type="button" onClick={() => setRpgApiMode(false)} title="Modo API">
                     <CodeBracketIcon className={modeIconClass(!rpgApiMode)} />
                  </button>

                  <button type="button" onClick={() => setRpgApiMode(true)} title="Modo RPG">
                     <BookOpenIcon className={modeIconClass(rpgApiMode)} />
                  </button>

                  <button type="button" onClick={() => setOpenAuth(true)} title="Autenticação">
                     <UserCircleIcon className={modeIconClass(openAuth)} />
                  </button>
            </nav>
            </header>
            <Routes>
               <Route path="/" element={<Spells />} />
               <Route path="/potions" element={<Potions />} />
               <Route path="/characters" element={<Characters />} />
               <Route path="/creatures" element={<Creatures />} />
               <Route path="/movies" element={<Movies />} />
               <Route path="/books" element={<Books />} />
               <Route path="/rpg/spells" element={<RPG_SpellsRules />} />
               <Route path="/rpg/classes" element={<div>Classes RPG</div>} />
               <Route path="/rpg/campaigns" element={<div>Campanhas RPG</div>} />
               <Route path="/rpg/sheet/*" element={<RPG_Sheet />} />
            </Routes>
         
            { openAuth && <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} /> }
         
         </div>
      </>
   );
};

export default App;