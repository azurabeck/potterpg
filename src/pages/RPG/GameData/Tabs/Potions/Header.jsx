import { PlusIcon } from "@heroicons/react/24/outline";
import { levelOptions } from "./constants";
import { getPotionDisplayName } from "./helpers";

const Header = ({
   dropdownRef,
   potionSearch,
   selectedPotion,
   isDropdownOpen,
   availablePotions,
   savingPotionId,
   showRules,
   tableSearch,
   yearFilter,
   levelFilter,
   locationFilter,
   years,
   setIsDropdownOpen,
   setShowRules,
   setTableSearch,
   setYearFilter,
   setLevelFilter,
   setLocationFilter,
   handleSearchChange,
   handleSelectPotion,
   handleAddPotion,
}) => {
   return (
      <div className="space-y-3">
         <div className="flex items-start gap-2">
            <div ref={dropdownRef} className="relative flex flex-1 gap-2">
               <div className="relative flex-1">
                  <input
                     type="text"
                     value={potionSearch}
                     onChange={handleSearchChange}
                     onFocus={() => setIsDropdownOpen(true)}
                     placeholder="Buscar poção para adicionar..."
                     className="h-10 w-full border border-white/10 bg-white/10 px-4 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400/60 focus:bg-white/15"
                  />

                  {isDropdownOpen ? (
                     <div className="absolute left-0 right-0 top-11 z-30 max-h-72 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl">
                        {availablePotions.length ? (
                           availablePotions.map((potion) => (
                              <button
                                 key={potion.id}
                                 type="button"
                                 onMouseDown={(event) => event.preventDefault()}
                                 onClick={() => handleSelectPotion(potion)}
                                 className="flex w-full flex-col border-b border-white/5 px-4 py-3 text-left text-xs transition hover:bg-white/10"
                              >
                                 <span className="text-white">
                                    {getPotionDisplayName(potion)}
                                 </span>

                                 <span className="mt-1 text-[11px] text-[#736868]">
                                    {potion.attributes?.nivel || "-"} • Ano{" "}
                                    {potion.attributes?.ano_letivo || "-"}
                                 </span>
                              </button>
                           ))
                        ) : (
                           <div className="px-4 py-4 text-xs text-[#736868]">
                              Nenhuma poção encontrada.
                           </div>
                        )}
                     </div>
                  ) : null}
               </div>

               <button
                  type="button"
                  disabled={!selectedPotion || savingPotionId === selectedPotion?.id}
                  onClick={handleAddPotion}
                  className="flex h-10 w-10 items-center justify-center bg-white/10 text-white/70 transition hover:bg-yellow-400 hover:text-[#2b0038] disabled:cursor-not-allowed disabled:opacity-40"
                  title="Adicionar poção"
               >
                  <PlusIcon className="h-5 w-5" />
               </button>
            </div>

            <button
               type="button"
               onClick={() => setShowRules((currentValue) => !currentValue)}
               className="h-10 whitespace-nowrap bg-white/10 px-4 text-xs uppercase text-white/70 transition hover:bg-white/20 hover:text-white"
            >
               {showRules ? "Esconder regras" : "Ver regras"}
            </button>
         </div>

         <div className="grid grid-cols-[1fr_120px_120px_170px] gap-3">
            <input
               type="text"
               value={tableSearch}
               onChange={(event) => setTableSearch(event.target.value)}
               placeholder="Filtrar tabela..."
               className="h-9 border border-white/10 bg-white/10 px-3 text-xs text-white outline-none placeholder:text-white/30"
            />

            <select
               value={yearFilter}
               onChange={(event) => setYearFilter(event.target.value)}
               className="h-9 border border-white/10 bg-white/10 text-xs text-white outline-none"
            >
               <option value="">Ano</option>
               {years.map((year) => (
                  <option key={year} value={year}>
                     Ano {year}
                  </option>
               ))}
            </select>

            <select
               value={levelFilter}
               onChange={(event) => setLevelFilter(event.target.value)}
               className="h-9 border border-white/10 bg-white/10 text-xs text-white outline-none"
            >
               <option value="">Nível</option>
               {levelOptions.map((level) => (
                  <option key={level} value={level}>
                     {level}
                  </option>
               ))}
            </select>

            <input
               type="text"
               value={locationFilter}
               onChange={(event) => setLocationFilter(event.target.value)}
               placeholder="Local ingredientes"
               className="h-9 border border-white/10 bg-white/10 px-3 text-xs text-white outline-none placeholder:text-white/30"
            />
         </div>
      </div>
   );
};

export default Header;
