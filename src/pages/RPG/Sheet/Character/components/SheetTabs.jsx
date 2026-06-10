const SheetTabs = ({ tabs, activeTab, onTabChange }) => {
   return (
      <nav className="flex items-center justify-end gap-10 px-8 text-sm">
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
   );
};

export default SheetTabs;