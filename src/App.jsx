import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Routes, Route, NavLink } from "react-router-dom";
import { BoltIcon } from "@heroicons/react/24/solid";
import {
   Bars3Icon,
   XMarkIcon,
   ChevronDownIcon,
   UserCircleIcon,
} from "@heroicons/react/24/outline";

import { auth } from "./services/firebase";
import AuthModal from "./components/AuthModal/index.jsx";

import Spells from "./pages/API/Spells";
import Potions from "./pages/API/Potions";
import Characters from "./pages/API/Characters";
import Movies from "./pages/API/Movies";
import Books from "./pages/API/Books";
import Creatures from "./pages/API/Creatures";

import RPG_SpellsRules from "./pages/RPG/SpellRules";
import RPG_USER_PROFILE from "./pages/RPG/GameData/index.jsx";
import RPG_RULES from "./pages/RPG/GameRules/index.jsx";

const loggedMenuLinks = [
   { to: "/rpg/user-profile/attributes", label: "Atributos" },
   { to: "/rpg/user-profile/spells", label: "Feitiços" },
   { to: "/rpg/user-profile/potions", label: "Poções" },
   { to: "/rpg/user-profile/mysteries", label: "Mistérios" },
   { to: "/rpg/user-profile/inventory", label: "Inventário" },
   { to: "/rpg/user-profile/sessions", label: "Sessões" },
   { to: "/rpg/user-profile/relations", label: "Relações" },
];

const App = () => {
   const [openAuth, setOpenAuth] = useState(true);
   const [user, setUser] = useState(null);
   const [, setAuthLoading] = useState(true);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   const menuClass = ({ isActive }) =>
      `block px-4 py-2 text-sm hover:text-yellow-400 ${
         isActive ? "text-yellow-400" : "text-gray-300"
      }`;

   const closeMobileMenu = () => setMobileMenuOpen(false);

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

   const DropdownMenu = ({ title, children }) => (
      <div className="group relative">
         <button
            type="button"
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-yellow-400"
         >
            {title}
            <ChevronDownIcon className="h-4 w-4" />
         </button>

         <div className="invisible absolute right-0 top-full z-[9999] mt-3 min-w-[210px] rounded-xl border border-purple-200/10 bg-[#2b0038] py-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
            {children}
         </div>
      </div>
   );

   return (
      <div>
         <header className="sticky top-0 z-[100] w-full bg-[#2b0038] shadow-md">
            <div className="flex h-[65px] items-center justify-between px-4">
               <div className="flex items-center gap-2 text-[18px] font-normal text-white">
                  <BoltIcon className="h-5 w-5 text-yellow-400" />
                  PotterAPI
               </div>

               <nav className="hidden items-center gap-8 md:flex">
                  <DropdownMenu title="PotterDB">
                     <NavLink to="/" className={menuClass}>Feitiços</NavLink>
                     <NavLink to="/potions" className={menuClass}>Poções</NavLink>
                     <NavLink to="/characters" className={menuClass}>Personagens</NavLink>
                     <NavLink to="/creatures" className={menuClass}>Criaturas</NavLink>
                     <NavLink to="/movies" className={menuClass}>Filmes</NavLink>
                     <NavLink to="/books" className={menuClass}>Livros</NavLink>
                  </DropdownMenu>

                  <DropdownMenu title="Menu RPG">
                     <NavLink to="/rpg/spells" className={menuClass}>Feitiços RPG</NavLink>
                     <NavLink to="/rpg/rules" className={menuClass}>Regras</NavLink>
                  </DropdownMenu>

                  {user && (
                     <DropdownMenu title="Menu Logado">
                        {loggedMenuLinks.map((link) => (
                           <NavLink key={link.to} to={link.to} className={menuClass}>
                              {link.label}
                           </NavLink>
                        ))}
                     </DropdownMenu>
                  )}

                  <button
                     type="button"
                     onClick={() => setOpenAuth(true)}
                     title="Autenticação"
                     className="text-gray-300 hover:text-yellow-400"
                  >
                     <UserCircleIcon className="h-6 w-6" />
                  </button>
               </nav>

               <button
                  type="button"
                  className="text-gray-200 md:hidden"
                  onClick={() => setMobileMenuOpen((current) => !current)}
               >
                  {mobileMenuOpen ? (
                     <XMarkIcon className="h-7 w-7" />
                  ) : (
                     <Bars3Icon className="h-7 w-7" />
                  )}
               </button>
            </div>

            {mobileMenuOpen && (
               <nav className="space-y-4 border-t border-purple-200/10 bg-[#2b0038] px-4 py-4 md:hidden">
                  <div>
                     <p className="mb-2 text-xs uppercase tracking-widest text-yellow-400">
                        PotterDB
                     </p>
                     <NavLink to="/" onClick={closeMobileMenu} className={menuClass}>Feitiços</NavLink>
                     <NavLink to="/potions" onClick={closeMobileMenu} className={menuClass}>Poções</NavLink>
                     <NavLink to="/characters" onClick={closeMobileMenu} className={menuClass}>Personagens</NavLink>
                     <NavLink to="/creatures" onClick={closeMobileMenu} className={menuClass}>Criaturas</NavLink>
                     <NavLink to="/movies" onClick={closeMobileMenu} className={menuClass}>Filmes</NavLink>
                     <NavLink to="/books" onClick={closeMobileMenu} className={menuClass}>Livros</NavLink>
                  </div>

                  <div>
                     <p className="mb-2 text-xs uppercase tracking-widest text-yellow-400">
                        Menu RPG
                     </p>
                     <NavLink to="/rpg/spells" onClick={closeMobileMenu} className={menuClass}>Feitiços RPG</NavLink>
                     <NavLink to="/rpg/rules" onClick={closeMobileMenu} className={menuClass}>Regras</NavLink>
                  </div>

                  {user && (
                     <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-yellow-400">
                           Menu Logado
                        </p>
                        {loggedMenuLinks.map((link) => (
                           <NavLink
                              key={link.to}
                              to={link.to}
                              onClick={closeMobileMenu}
                              className={menuClass}
                           >
                              {link.label}
                           </NavLink>
                        ))}
                     </div>
                  )}

                  <button
                     type="button"
                     onClick={() => {
                        setOpenAuth(true);
                        closeMobileMenu();
                     }}
                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-yellow-400"
                  >
                     <UserCircleIcon className="h-5 w-5" />
                     Login / Conta
                  </button>
               </nav>
            )}
         </header>

         <Routes>
            <Route path="/" element={<Spells />} />
            <Route path="/potions" element={<Potions />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/creatures" element={<Creatures />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/books" element={<Books />} />
            <Route path="/rpg/spells" element={<RPG_SpellsRules />} />
            <Route path="/rpg/rules" element={<RPG_RULES />} />
            <Route path="/rpg/user-profile/*" element={<RPG_USER_PROFILE />} />
         </Routes>

         {openAuth && (
            <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
         )}
      </div>
   );
};

export default App;
