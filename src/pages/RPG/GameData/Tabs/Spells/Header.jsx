import { PlusIcon } from "@heroicons/react/24/outline";
import CustomSelect from "../../../../../components/CustomSelect";
import { attributeOptions, levelOptions } from "./json-files/constants";
import { getSpellName } from "./helpers";

const Header = ({
   dropdownRef,
   spellSearch,
   selectedSpell,
   isDropdownOpen,
   availableSpells,
   savingSpellId,
   showRules,
   tableSearch,
   yearFilter,
   levelFilter,
   attributeFilter,
   years,
   setIsDropdownOpen,
   setShowRules,
   setTableSearch,
   setYearFilter,
   setLevelFilter,
   setAttributeFilter,
   handleSearchChange,
   handleSelectSpell,
   handleAddSpell,
}) => {
   const yearOptions = [
      { value: "", label: "Ano" },
      ...years.map((year) => ({ value: year, label: `Ano ${year}` })),
   ];

   const levelSelectOptions = [
      { value: "", label: "Nível" },
      ...levelOptions.map((level) => ({ value: level, label: level })),
   ];

   const attributeSelectOptions = [
      { value: "", label: "Atributo" },
      ...attributeOptions.map((attribute) => ({ value: attribute, label: attribute })),
   ];

   return (
      <div className="space-y-3">
         <div className="flex items-start gap-2">
            <div ref={dropdownRef} className="relative flex flex-1 gap-2">
               <div className="relative flex-1">
                  <input
                     type="text"
                     value={spellSearch}
                     onChange={handleSearchChange}
                     onFocus={() => setIsDropdownOpen(true)}
                     placeholder="Buscar feitiço para adicionar..."
                     className="h-10 w-full border border-white/10 bg-white/10 px-4 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400/60 focus:bg-white/15"
                  />

                  {isDropdownOpen ? (
                     <div className="absolute left-0 right-0 top-11 z-30 max-h-72 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl">
                        {availableSpells.length ? (
                           availableSpells.map((spell) => (
                              <button
                                 key={spell.id}
                                 type="button"
                                 onMouseDown={(event) => event.preventDefault()}
                                 onClick={() => handleSelectSpell(spell)}
                                 className="flex w-full flex-col border-b border-white/5 px-4 py-3 text-left text-xs transition hover:bg-white/10"
                              >
                                 <span className="text-white">{getSpellName(spell)}</span>
                                 <span className="mt-1 text-[11px] text-[#736868]">
                                    {spell.attributes?.aula || "Feitiço"} • {spell.attributes?.nivel || "-"} • Ano {spell.attributes?.ano_letivo || "-"}
                                 </span>
                              </button>
                           ))
                        ) : (
                           <div className="px-4 py-4 text-xs text-[#736868]">
                              Nenhum feitiço encontrado.
                           </div>
                        )}
                     </div>
                  ) : null}
               </div>

               <button
                  type="button"
                  disabled={!selectedSpell || savingSpellId === selectedSpell?.id}
                  onClick={handleAddSpell}
                  className="flex h-10 w-10 items-center justify-center bg-white/10 text-white/70 transition hover:bg-yellow-400 hover:text-[#2b0038] disabled:cursor-not-allowed disabled:opacity-40"
                  title="Adicionar feitiço"
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

         <div className="grid grid-cols-[1fr_120px_120px_120px] gap-3">
            <input
               type="text"
               value={tableSearch}
               onChange={(event) => setTableSearch(event.target.value)}
               placeholder="Filtrar tabela..."
               className="h-9 border border-white/10 bg-white/10 px-3 text-xs text-white outline-none placeholder:text-white/30"
            />

            <CustomSelect
               value={yearFilter}
               options={yearOptions}
               onChange={setYearFilter}
               placeholder="Ano"
            />

            <CustomSelect
               value={levelFilter}
               options={levelSelectOptions}
               onChange={setLevelFilter}
               placeholder="Nível"
            />

            <CustomSelect
               value={attributeFilter}
               options={attributeSelectOptions}
               onChange={setAttributeFilter}
               placeholder="Atributo"
            />
         </div>
      </div>
   );
};

export default Header;