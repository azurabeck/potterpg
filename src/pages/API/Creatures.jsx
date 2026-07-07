import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import getCreatures from "../../assets/json/criaturas_animais_fantasticos.json";
import { ApiAlbumGrid, getObjectValue } from "./Shared/ApiAlbumGrid";

const Creatures = () => {
   // #region State
   const [creatures] = useState(getCreatures);
   const [search, setSearch] = useState("");
   const [isLoading] = useState(false);
   // #endregion

   // #region Computed
   const filteredCreatures = creatures.filter((item) =>
      item.animal.toLowerCase().includes(search.toLowerCase())
   );
   // #endregion

   // #region Render
   return (
      <div className="min-h-screen bg-[#2b0038] text-white">
         <section className="flex bg-[#3b0050]">
            <input
               type="text"
               placeholder="Buscar Criaturas..."
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               className="flex-1 bg-transparent px-8 py-5 text-sm text-white outline-none placeholder:text-purple-300"
            />

            <button className="w-32 border-l border-[#21002b] text-3xl">
               <MagnifyingGlassIcon className="mx-auto h-6 w-6 text-purple-300" />
            </button>
         </section>

         <main className="p-5 md:p-8">
            {isLoading && (
               <div className="mb-8 rounded-xl border border-purple-900 bg-[#21002b] p-4">
                  <p className="text-sm font-semibold">Carregando criaturas...</p>

                  <div className="mt-3 h-6 w-full overflow-hidden rounded-full bg-purple-950">
                     <div className="h-full w-full animate-pulse bg-purple-400" />
                  </div>
               </div>
            )}

            <ApiAlbumGrid
               items={filteredCreatures}
               getTitle={(item) => getObjectValue(item, ["animal"])}
               getDescription={(item) => getObjectValue(item, ["description"])}
               getImage={(item) => getObjectValue(item, ["image"], "")}
               getTags={(item) => [
                  `Classificação ${getObjectValue(item, ["classification"])}`,
               ]}
            />
         </main>
      </div>
   );
   // #endregion
};

export default Creatures;