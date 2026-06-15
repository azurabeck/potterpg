import { NavLink } from "react-router-dom";

const Header = ({ tabs, activeTab }) => {
   const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];

   const tabClass = ({ isActive }) =>
      `px-4 py-2 text-sm transition ${
         isActive
            ? "text-yellow-400"
            : "text-white/70 hover:border-yellow-400 hover:text-yellow-400"
      }`;

   return (
      <header className="space-y-5">
         <div className="flex items-start justify-between gap-6">
            <div>
               <p className="text-left uppercase tracking-[0.35em] text-yellow-400">
                  Regras RPG
               </p>

               <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-left uppercase tracking-[0.16em]">
                     {currentTab.label}
                  </h1>
               </div>
            </div>
         </div>

         <nav className="hidden flex-wrap items-center justify-end gap-y-2 px-0 md:flex">
            {tabs.map((tab) => (
               <NavLink key={tab.key} to={`/rpg/rules/${tab.key}`} className={tabClass}>
                  {tab.label}
               </NavLink>
            ))}
         </nav>


      </header>
   );
};

export default Header;
