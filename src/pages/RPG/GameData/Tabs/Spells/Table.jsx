import {
   CheckIcon,
   EyeIcon,
   InformationCircleIcon,
   PlusIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { tableColumns } from "./json-files/constants";
import { getSpellMasteryByXp, getSpellMasteryEffects, getSpellName } from "./helpers";

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
   handleOpenDetails,
}) => {
   return (
      <div className="overflow-x-auto">
         <div className="min-w-[1090px]">
            <div
               className={`grid ${tableColumns} gap-3 border-b border-white/10 pb-3 text-xs text-purple-100/90`}
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
            <button type="button" onClick={() => handleSort("dice")} className="text-left">
               Dice {renderSortIcon("dice")}
            </button>
            <button type="button" onClick={() => handleSort("attribute")} className="text-left">
               Atributo {renderSortIcon("attribute")}
            </button>
            <span className="text-right">Ações</span>
            </div>

            <div className="space-y-1 pt-3">
            {filteredAndSortedSpells.length ? (
               filteredAndSortedSpells.map((item, index) => {
                  const { spell, savedData } = item;

                  const xpAtual = savedData?.xp ?? 0;
                  const draftXp = xpDrafts[spell.id] ?? String(xpAtual);

                  const xpChanged = Number(draftXp) !== Number(xpAtual);
                  const hasChanged = xpChanged;

                  const mastery = getSpellMasteryByXp(spell, draftXp);
                  const masteryLevel = Number(String(mastery?.maestria || "M0").replace("M", ""));
                  const currentMasteryEffect = getSpellMasteryEffects(spell).find(
                     (effect) =>
                        masteryLevel >= Number(effect.from || 0) &&
                        masteryLevel <= Number(effect.to || effect.from || 0)
                  );

                  return (
                     <div
                        key={spell.id}
                        className={`grid ${tableColumns} min-h-12 items-center gap-3 text-left text-xs text-[#736868] transition hover:bg-white/5`}
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

                        <span>{spell.attributes?.nivel || "-"}</span>

                        <input
                           type="text"
                           value={draftXp}
                           onChange={(event) =>
                              handleXpChange(spell.id, event.target.value)
                           }
                           className="w-full bg-[#9d564c] px-3 py-1 text-left text-xs text-white outline-none ring-1 ring-transparent focus:ring-yellow-400"
                        />

                        <span className="leading-4">
                           {mastery.maestria} → {currentMasteryEffect?.value || mastery.dado || "-"}
                           {currentMasteryEffect?.description ? (
                              <span className="block text-[10px] text-purple-100/45">
                                 {currentMasteryEffect.description}
                              </span>
                           ) : null}
                        </span>

                        <span className="text-left">
                           {spell.attributes?.effect_value || spell.attributes?.effect_dice || "-"}
                        </span>

                        <span className="text-left">
                           {spell.attributes?.attribute || "-"}
                           {spell.attributes?.attribute ? (
                              <span className="text-purple-100/45">
                                 {" "}({selectedCharacter?.atributos?.[spell.attributes.attribute] ?? 0})
                              </span>
                           ) : null}
                        </span>

                        <div className="flex items-center justify-end gap-2">
                           <button
                              type="button"
                              onClick={() => handleOpenDetails(spell, savedData, mastery)}
                              className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                           >
                              <EyeIcon className="h-4 w-4" />
                           </button>

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
      </div>
   );
};

export default Table;
