const Header = ({ tabs, activeTab, onTabChange }) => {
   const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];

   return (
      <header className="space-y-5">
         <div className="flex items-start justify-between gap-6">
            <div>
               <p className="text-left text-sm uppercase tracking-[0.35em] text-yellow-400">
                  Regras RPG
               </p>

               <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-sm uppercase tracking-[0.16em]">
                     {currentTab.label}
                  </h1>
               </div>
            </div>
         </div>

         <nav className="flex flex-wrap items-center justify-end gap-x-10 gap-y-3 px-8 text-sm">
            {tabs.map((tab) => (
               <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className={`transition ${
                     activeTab === tab.key
                        ? "text-yellow-400"
                        : "text-white hover:text-yellow-400"
                  }`}
               >
                  {tab.label}
               </button>
            ))}
         </nav>
      </header>
   );
};

export default Header;
