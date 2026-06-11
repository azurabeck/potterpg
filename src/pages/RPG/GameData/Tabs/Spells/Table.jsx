import {
   CheckIcon,
   InformationCircleIcon,
   PlusIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { getMasteryByXp } from "../../../../../helpers/mastery";
import { attributeOptions, levelOptions, tableColumns } from "./json-files/constants";
import { getSpellName } from "./helpers";

const Table = ({
   selectedCharacter,
   filteredAndSortedSpells,
   xpDrafts,
   attributeDrafts,
   levelDrafts,
   savingSpellId,
   editingAttributeSpellId,
   editingLevelSpellId,
   attributeDropdownRef,
   levelDropdownRef,
   handleSort,
   renderSortIcon,
   handleXpChange,
   handleOpenAttributeDropdown,
   handleOpenLevelDropdown,
   handleSelectAttribute,
   handleSelectLevel,
   handleSaveSpell,
   handleDeleteSpell,
}) => {
   return (
      <div className="overflow-visible">
         <div
            className={`grid ${tableColumns} gap-5 border-b border-white/10 pb-3 text-xs text-purple-100/90`}
         >
            <button type="button" onClick={() => handleSort("year")} className="text-left">
               Ano {renderSortIcon("year")}
            </button>
            <button type="button" onClick={() => handleSort("name")} className="text-left">
               Nome {renderSortIcon("name")}
            </button>
            <button type="button" onClick={() => handleSort("level")} className="text-left">
               Nível {renderSortIcon("level")}
            </button>
            <button type="button" onClick={() => handleSort("xp")} className="text-left">
               XP {renderSortIcon("xp")}
            </button>
            <span className="text-left">Maestria → Dado</span>
            <button type="button" onClick={() => handleSort("attribute")} className="text-left">
               Atributo {renderSortIcon("attribute")}
            </button>
            <span />
         </div>

         <div className="space-y-1 pt-3">
            {filteredAndSortedSpells.length ? (
               filteredAndSortedSpells.map((item, index) => {
                  const { spell, savedData } = item;

                  const xpAtual = savedData?.xp ?? 0;
                  const draftXp = xpDrafts[spell.id] ?? String(xpAtual);

                  const currentAttribute = savedData?.atributo || "";
                  const draftAttribute =
                     attributeDrafts[spell.id] ?? currentAttribute;

                  const currentLevel =
                     savedData?.nivel || spell.attributes?.nivel || "";
                  const draftLevel = levelDrafts[spell.id] ?? currentLevel;

                  const xpChanged = Number(draftXp) !== Number(xpAtual);
                  const attributeChanged = draftAttribute !== currentAttribute;
                  const levelChanged = draftLevel !== currentLevel;

                  const hasChanged = xpChanged || attributeChanged || levelChanged;

                  const mastery = getMasteryByXp(draftLevel, draftXp);

                  const dropdownDirection = index < 3 ? "top-8" : "bottom-8";

                  return (
                     <div
                        key={spell.id}
                        className={`grid ${tableColumns} min-h-12 items-center gap-5 text-xs text-[#736868] transition hover:bg-white/5`}
                     >
                        <span>
                           {spell.attributes?.ano_letivo || "-"}{" "}
                           {spell.attributes?.required ? (
                              <span className="text-yellow-400">★</span>
                           ) : null}
                        </span>

                        <span className="flex items-center gap-2">
                           {getSpellName(spell)}

                           {spell.attributes?.effect ? (
                              <span className="group relative inline-flex">
                                 <InformationCircleIcon className="h-4 w-4 text-white" />

                                 <span className="pointer-events-none absolute bottom-6 left-1/2 z-40 hidden w-64 -translate-x-1/2 bg-[#21002b] px-3 py-2 text-[11px] leading-4 text-white shadow-2xl ring-1 ring-white/10 group-hover:block">
                                    {spell.attributes.effect}
                                 </span>
                              </span>
                           ) : null}
                        </span>

                        <div
                           className="relative"
                           ref={
                              editingLevelSpellId === spell.id
                                 ? levelDropdownRef
                                 : null
                           }
                        >
                           <button
                              type="button"
                              onClick={() => handleOpenLevelDropdown(spell.id)}
                              className="text-left text-[#736868] transition hover:text-white"
                           >
                              {draftLevel || "+"}
                           </button>

                           {editingLevelSpellId === spell.id ? (
                              <div
                                 className={`absolute left-0 z-40 max-h-56 w-52 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl ${dropdownDirection}`}
                              >
                                 {levelOptions.map((level) => (
                                    <button
                                       key={level}
                                       type="button"
                                       onClick={() => handleSelectLevel(spell.id, level)}
                                       className="flex w-full border-b border-white/5 px-3 py-2 text-left text-xs text-white transition hover:bg-white/10"
                                    >
                                       {level}
                                    </button>
                                 ))}
                              </div>
                           ) : null}
                        </div>

                        <input
                           type="text"
                           value={draftXp}
                           onChange={(event) =>
                              handleXpChange(spell.id, event.target.value)
                           }
                           className="w-full bg-[#9d564c] px-3 py-1 text-center text-xs text-white outline-none ring-1 ring-transparent focus:ring-yellow-400"
                        />

                        <span>
                           {mastery.maestria} → {mastery.dado}
                        </span>

                        <div
                           className="relative"
                           ref={
                              editingAttributeSpellId === spell.id
                                 ? attributeDropdownRef
                                 : null
                           }
                        >
                           {draftAttribute ? (
                              <button
                                 type="button"
                                 onClick={() => handleOpenAttributeDropdown(spell.id)}
                                 className="text-left text-[#736868] transition hover:text-white"
                              >
                                 {draftAttribute} (
                                 {selectedCharacter?.atributos?.[draftAttribute] ?? 0}
                                 )
                              </button>
                           ) : (
                              <button
                                 type="button"
                                 onClick={() => handleOpenAttributeDropdown(spell.id)}
                                 className="flex h-7 w-7 items-center justify-center bg-white/10 text-white transition hover:bg-yellow-400 hover:text-[#2b0038]"
                              >
                                 <PlusIcon className="h-4 w-4" />
                              </button>
                           )}

                           {editingAttributeSpellId === spell.id ? (
                              <div
                                 className={`absolute left-0 z-40 max-h-56 w-52 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl ${dropdownDirection}`}
                              >
                                 {attributeOptions.map((attribute) => (
                                    <button
                                       key={attribute}
                                       type="button"
                                       onClick={() =>
                                          handleSelectAttribute(spell.id, attribute)
                                       }
                                       className="flex w-full border-b border-white/5 px-3 py-2 text-left text-xs text-white transition hover:bg-white/10"
                                    >
                                       {attribute} (
                                       {selectedCharacter?.atributos?.[attribute] ?? 0}
                                       )
                                    </button>
                                 ))}
                              </div>
                           ) : null}
                        </div>

                        <div className="flex items-center gap-2">
                           <button
                              type="button"
                              disabled={!hasChanged || savingSpellId === spell.id}
                              onClick={() =>
                                 handleSaveSpell(spell.id, spell, savedData)
                              }
                              className={`flex h-7 w-7 items-center justify-center rounded transition ${
                                 hasChanged && savingSpellId !== spell.id
                                    ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300"
                                    : "bg-white/10 text-white/30"
                              }`}
                           >
                              <CheckIcon className="h-4 w-4" />
                           </button>

                           <button
                              type="button"
                              disabled={savingSpellId === spell.id}
                              onClick={() => handleDeleteSpell(spell.id)}
                              className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white/40 transition hover:bg-red-500/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                           >
                              <TrashIcon className="h-4 w-4" />
                           </button>
                        </div>
                     </div>
                  );
               })
            ) : (
               <div className="flex min-h-[180px] items-center justify-center text-center text-sm text-purple-200/70">
                  Nenhum feitiço encontrado.
               </div>
            )}
         </div>
      </div>
   );
};

export default Table;
