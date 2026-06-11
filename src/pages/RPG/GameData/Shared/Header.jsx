import { NavLink } from "react-router-dom";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/solid";
import SheetTabs from "./Tabs";

const Header = ({
   characters,
   selectedCharacter,
   selectedCharacterId,
   tabs,
   activeTab,
   onCharacterChange,
   onTabChange,
}) => {
   return (
      <header className="space-y-5">
         <div className="flex items-start justify-between gap-6">
            <div>
               <p className="text-left text-sm uppercase tracking-[0.35em] text-yellow-400">
                  Perfil RPG
               </p>

               <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-sm uppercase tracking-[0.16em]">
                     Personagem: Campanha de {selectedCharacter.name}
                  </h1>

                  {characters.length > 1 ? (
                     <select
                        value={selectedCharacterId}
                        onChange={onCharacterChange}
                        className="w-7 cursor-pointer bg-transparent text-transparent outline-none"
                        title="Trocar personagem"
                     >
                        {characters.map((character) => (
                           <option key={character.id} value={character.id}>
                              {character.name}
                           </option>
                        ))}
                     </select>
                  ) : (
                     <ChevronDownIcon className="h-4 w-4 text-purple-400" />
                  )}
               </div>
            </div>

            <NavLink
               to="/rpg/sheet/create"
               className="flex h-10 w-10 items-center justify-center text-yellow-400 transition hover:text-yellow-300"
               title="Criar personagem"
            >
               <PlusIcon className="h-6 w-6" />
            </NavLink>
         </div>

         <SheetTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      </header>
   );
};

export default Header;
