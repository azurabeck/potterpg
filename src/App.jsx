import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Routes, Route, NavLink } from "react-router-dom";
import { BoltIcon } from "@heroicons/react/24/solid";
import {
   Bars3Icon,
   XMarkIcon,
   ChevronDownIcon,
   ChevronRightIcon,
   UserCircleIcon,
} from "@heroicons/react/24/outline";

import { auth } from "@/services/firebase";
import AuthModal from "@/components/AuthModal/index.jsx";

import Spells from "@/pages/API/Spells";
import Potions from "@/pages/API/Potions";
import Characters from "@/pages/API/Characters";
import Movies from "@/pages/API/Movies";
import Books from "@/pages/API/Books";
import Creatures from "@/pages/API/Creatures";

import RPG_Spells from "@/pages/RPG/Spells/index.jsx";
import RPG_USER_PROFILE from "@/pages/RPG/GameData/index.jsx";
import RPG_RULES from "@/pages/RPG/GameRules/index.jsx";
import { rulesTabs } from "@/pages/RPG/GameRules/Shared/rules_tabs";

const potterDbLinks = [
   { to: "/", label: "Feitiços" },
   { to: "/potions", label: "Poções" },
   { to: "/characters", label: "Personagens" },
   { to: "/creatures", label: "Criaturas" },
   { to: "/movies", label: "Filmes" },
   { to: "/books", label: "Livros" },
];

const rpgMenuLinks = [
   { to: "/rpg/spells", label: "Feitiços RPG" },
];

const ruleMenuLinks = rulesTabs.map((tab) => ({
   to: `/rpg/rules/${tab.key}`,
   label: tab.label,
}));

const loggedMenuLinks = [
   { to: "/rpg/user-profile/attributes", label: "Atributos" },
   { to: "/rpg/user-profile/spells", label: "Feitiços" },
   { to: "/rpg/user-profile/potions", label: "Poções" },
   { to: "/rpg/user-profile/mysteries", label: "Mistérios" },
   { to: "/rpg/user-profile/inventory", label: "Inventário" },
   { to: "/rpg/user-profile/sessions", label: "Sessões" },
   { to: "/rpg/user-profile/relations", label: "Relações" },
   { to: "/rpg/user-profile/goals", label: "Metas" },
];

const DropdownMenu = ({ title, children }) => (
   <div className="group relative">
      <button
         type="button"
         className="flex cursor-pointer items-center gap-6 text-xs text-gray-300 hover:text-yellow-400"
      >
         {title}
         <ChevronDownIcon className="h-4 w-4" />
      </button>

      <div className="invisible absolute right-0 top-full z-[9999] mt-3 min-w-[190px] rounded-xl border border-purple-200/10 bg-[#2b0038] py-2 text-left opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
         {children}
      </div>
   </div>
);

const MobileMenuSection = ({ title, isOpen, onToggle, children }) => (
   <section className="border-b border-white/10 pb-3 text-left last:border-b-0">
      <button
         type="button"
         onClick={onToggle}
         className="flex w-full items-center justify-between py-2 text-left text-xs uppercase tracking-widest text-yellow-400"
      >
         <span>{title}</span>

         {isOpen ? (
            <ChevronDownIcon className="h-4 w-4" />
         ) : (
            <ChevronRightIcon className="h-4 w-4" />
         )}
      </button>

      {isOpen && <div className="mt-1 flex flex-col items-start text-left">{children}</div>}
   </section>
);

const App = () => {
   const [openAuth, setOpenAuth] = useState(false);
   const [authLoading, setAuthLoading] = useState(true);
   const [user, setUser] = useState(null);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [mobileSectionsOpen, setMobileSectionsOpen] = useState({
      potterdb: true,
      rpg: false,
      logged: false,
   });

   const menuClass = ({ isActive }) =>
      `block px-4 py-2 text-left text-sm hover:text-yellow-400 ${
         isActive ? "text-yellow-400" : "text-gray-300"
      }`;

   const closeMobileMenu = () => setMobileMenuOpen(false);

   const toggleMobileSection = (sectionName) => {
      setMobileSectionsOpen((current) => ({
         ...current,
         [sectionName]: !current[sectionName],
      }));
   };

   const handleLogout = async () => {
      try {
         await signOut(auth);
         setUser(null);
         setOpenAuth(false);
         closeMobileMenu();
      } catch (error) {
         console.error("Erro ao sair:", error);
      }
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
         setAuthLoading(false);
      });

      return () => unsubscribe();
   }, []);

   const userInitials = user?.displayName
      ? user.displayName
           .split(" ")
           .map((name) => name[0])
           .slice(0, 2)
           .join("")
           .toUpperCase()
      : "U";

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
                     {potterDbLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className={menuClass}>
                           {link.label}
                        </NavLink>
                     ))}
                  </DropdownMenu>

                  <DropdownMenu title="Menu RPG">
                     {rpgMenuLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className={menuClass}>
                           {link.label}
                        </NavLink>
                     ))}

                     <div className="mt-2 border-t border-white/10 px-4 pb-1 pt-3 text-[10px] uppercase tracking-[0.18em] text-yellow-400/80">
                        Regras
                     </div>

                     {ruleMenuLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className={menuClass}>
                           {link.label}
                        </NavLink>
                     ))}
                  </DropdownMenu>

                  {user ? (
                     <DropdownMenu
                        title={
                           <span className="flex items-center gap-4 border-l border-white/20 pl-[30px] text-xs text-gray-300 hover:text-yellow-400">
                              {userInitials}
                           </span>
                        }
                     >
                        {loggedMenuLinks.map((link) => (
                           <NavLink key={link.to} to={link.to} className={menuClass}>
                              {link.label}
                           </NavLink>
                        ))}

                        <button
                           type="button"
                           onClick={handleLogout}
                           className="block w-full border-t border-white/10 px-4 py-2 text-left text-sm text-red-300 transition hover:text-red-200"
                        >
                           Sair
                        </button>
                     </DropdownMenu>
                  ) : (
                     <button
                        type="button"
                        onClick={() => setOpenAuth(true)}
                        className="flex items-center gap-4 border-l border-white/20 px-[30px] text-xs text-gray-300 hover:text-yellow-400"
                     >
                        Login
                     </button>
                  )}
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
               <nav className="space-y-3 border-t border-purple-200/10 bg-[#2b0038] px-4 py-4 text-left md:hidden">
                  <MobileMenuSection
                     title="PotterDB"
                     isOpen={mobileSectionsOpen.potterdb}
                     onToggle={() => toggleMobileSection("potterdb")}
                  >
                     {potterDbLinks.map((link) => (
                        <NavLink
                           key={link.to}
                           to={link.to}
                           onClick={closeMobileMenu}
                           className={menuClass}
                        >
                           {link.label}
                        </NavLink>
                     ))}
                  </MobileMenuSection>

                  <MobileMenuSection
                     title="Menu RPG"
                     isOpen={mobileSectionsOpen.rpg}
                     onToggle={() => toggleMobileSection("rpg")}
                  >
                     {rpgMenuLinks.map((link) => (
                        <NavLink
                           key={link.to}
                           to={link.to}
                           onClick={closeMobileMenu}
                           className={menuClass}
                        >
                           {link.label}
                        </NavLink>
                     ))}

                     <div className="mt-2 px-4 pb-1 pt-3 text-[10px] uppercase tracking-[0.18em] text-yellow-400/80">
                        Regras
                     </div>

                     {ruleMenuLinks.map((link) => (
                        <NavLink
                           key={link.to}
                           to={link.to}
                           onClick={closeMobileMenu}
                           className={menuClass}
                        >
                           {link.label}
                        </NavLink>
                     ))}
                  </MobileMenuSection>

                  {user && (
                     <MobileMenuSection
                        title="Menu Logado"
                        isOpen={mobileSectionsOpen.logged}
                        onToggle={() => toggleMobileSection("logged")}
                     >
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
                     </MobileMenuSection>
                  )}

                  <div className="pt-1 text-left">
                     {user ? (
                        <button
                           type="button"
                           onClick={handleLogout}
                           className="flex items-center gap-2 px-4 py-2 text-left text-sm text-red-300 hover:text-red-200"
                        >
                           Sair
                        </button>
                     ) : (
                        <button
                           type="button"
                           onClick={() => {
                              setOpenAuth(true);
                              closeMobileMenu();
                           }}
                           className="flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:text-yellow-400"
                        >
                           <UserCircleIcon className="h-5 w-5" />
                           Login / Conta
                        </button>
                     )}
                  </div>
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
            <Route path="/rpg/spells" element={<RPG_Spells />} />
            <Route path="/rpg/rules/*" element={<RPG_RULES />} />
            <Route path="/rpg/user-profile/*" element={<RPG_USER_PROFILE />} />
         </Routes>

         {!authLoading && openAuth && (
            <AuthModal
               open={openAuth}
               onClose={() => setOpenAuth(false)}
            />
         )}
      </div>
   );
};

export default App;
