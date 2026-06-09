import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import getCreatures from "../assets/json/criaturas_animais_fantasticos.json";

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

         <main className="p-8">
            {isLoading && (
               <div className="mb-8 rounded-xl border border-purple-900 bg-[#21002b] p-4">
                  <p className="text-sm font-semibold">Carregando criaturas...</p>

                  <div className="mt-3 h-6 w-full overflow-hidden rounded-full bg-purple-950">
                     <div className="h-full w-full animate-pulse bg-purple-400" />
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
               {filteredCreatures.map((item) => (
                  <div key={item.animal} className="overflow-hidden rounded bg-[#190020]">
                     <div className="flex h-40 w-full items-center justify-center bg-[#120018] p-3">
                        {item.image && (
                           <img
                              src={item.image}
                              alt={item.animal}
                              onError={(event) => {
                                 event.currentTarget.style.display = "none";

                                 const fallback = event.currentTarget.nextElementSibling;

                                 if (fallback) {
                                    fallback.style.display = "flex";
                                 }
                              }}
                              className="max-h-full max-w-full object-contain"
                           />
                        )}

                        <div
                           className={`${
                              item.image ? "hidden" : "flex"
                           } h-full w-full items-center justify-center rounded border border-purple-900 text-center text-xs text-purple-400`}
                        >
                           Sem imagem
                        </div>
                     </div>

                     <div className="p-4">
                        <h3 className="mb-2 text-sm font-semibold">{item.animal}</h3>

                        <p className="text-xs text-purple-200">
                           {item.description || "-"}
                        </p>

                        <div className="mt-3 text-xs text-purple-300">
                           <p>
                              <strong>Classificação:</strong>{" "}
                              {item.classification || "-"}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </main>
      </div>
   );
   // #endregion
};

export default Creatures;