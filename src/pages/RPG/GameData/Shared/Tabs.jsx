import { NavLink } from "react-router-dom";

const SheetTabs = ({ tabs }) => {
   return (
      <nav className="hidden flex-wrap items-center justify-end gap-x-10 gap-y-3 px-8 text-sm md:flex">
         {tabs.map((tab) => (
            <NavLink
               key={tab.key}
               to={`/rpg/user-profile/${tab.key}`}
               className={({ isActive }) =>
                  `transition ${
                     isActive
                        ? "text-yellow-400"
                        : "text-white hover:text-yellow-400"
                  }`
               }
            >
               {tab.label}
            </NavLink>
         ))}
      </nav>
   );
};

export default SheetTabs;
