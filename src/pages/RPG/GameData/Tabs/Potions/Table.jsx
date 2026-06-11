import { useState } from "react";
import {
   CheckIcon,
   InformationCircleIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { getMasteryByXp } from "../../../../../helpers/mastery";
import Modal from "../../../../../components/Modal";
import { levelOptions, tableColumns } from "./constants";
import { getPotionDisplayName } from "./helpers";

const Table = ({
   filteredAndSortedPotions,
   xpDrafts,
   levelDrafts,
   locationDrafts,
   savingPotionId,
   editingLevelPotionId,
   levelDropdownRef,
   handleSort,
   renderSortIcon,
   handleXpChange,
   handleLocationChange,
   handleOpenLevelDropdown,
   handleSelectLevel,
   handleSavePotion,
   handleDeletePotion,
}) => {
   const [modalContent, setModalContent] = useState(null);

   const openInfoModal = (title, text) => {
      setModalContent({
         title,
         text: text || "Nenhuma informação cadastrada.",
      });
   };

   return (
      <div className="overflow-visible">
         <Modal
            isOpen={!!modalContent}
            title={modalContent?.title}
            onClose={() => setModalContent(null)}
         >
            <p className="whitespace-pre-line leading-6">
               {modalContent?.text}
            </p>
         </Modal>

         <div
            className={`grid ${tableColumns} gap-5 border-b border-white/10 pb-3 text-xs text-purple-100/90`}
         >
            <button type="button" onClick={() => handleSort("year")} className="text-left">
               Ano {renderSortIcon("year")}
            </button>

            <button type="button" onClick={() => handleSort("name")} className="text-left">
               Nome {renderSortIcon("name")}
            </button>

            <button type="button" onClick={() => handleSort("effect")} className="text-left">
               Efeito {renderSortIcon("effect")}
            </button>

            <span>Ingredientes</span>

            <button type="button" onClick={() => handleSort("ingredientLocation")} className="text-left">
               Local Ingredientes {renderSortIcon("ingredientLocation")}
            </button>

            <button type="button" onClick={() => handleSort("level")} className="text-left">
               Nível {renderSortIcon("level")}
            </button>

            <button type="button" onClick={() => handleSort("xp")} className="text-left">
               XP Atual {renderSortIcon("xp")}
            </button>

            <span>Maestria</span>
            <span />
         </div>

         <div className="space-y-1 pt-3">
            {filteredAndSortedPotions.length ? (
               filteredAndSortedPotions.map((item, index) => {
                  const { potion, savedData } = item;
                  const potionId = potion.id;

                  const currentXp = savedData?.xp ?? 0;
                  const currentLevel =
                     savedData?.nivel || potion.attributes?.nivel || "";
                  const currentLocation =
                     savedData?.local_ingredientes ||
                     potion.attributes?.local_ingredientes ||
                     "";

                  const draftXp = xpDrafts[potionId] ?? String(currentXp);
                  const draftLevel = levelDrafts[potionId] ?? currentLevel;
                  const draftLocation =
                     locationDrafts[potionId] ?? currentLocation;

                  const hasChanged =
                     Number(draftXp) !== Number(currentXp) ||
                     draftLevel !== currentLevel ||
                     draftLocation !== currentLocation;

                  const mastery = getMasteryByXp(draftLevel, draftXp);
                  const dropdownDirection = index < 3 ? "top-8" : "bottom-8";

                  return (
                     <div
                        key={potionId}
                        className={`grid ${tableColumns} min-h-12 items-center gap-5 text-xs text-[#736868] transition hover:bg-white/5`}
                     >
                        <span>{potion.attributes?.ano_letivo || "-"}</span>

                        <span className="flex items-center gap-2 text-white/80">
                           {getPotionDisplayName(potion)}
                        </span>

                        <span className="line-clamp-2" title={item.effect}>
                           {item.effect || "-"}
                        </span>

                        <span className="flex items-center gap-2">
                           <span className="line-clamp-2">
                              {item.ingredients || "-"}
                           </span>

                           <button
                              type="button"
                              onClick={() =>
                                 openInfoModal("Ingredientes", item.ingredients)
                              }
                              className="text-white/60 transition hover:text-yellow-400"
                           >
                              <InformationCircleIcon className="h-4 w-4" />
                           </button>
                        </span>

                        <span className="flex items-center gap-2">
                           <input
                              type="text"
                              value={draftLocation}
                              onChange={(event) =>
                                 handleLocationChange(
                                    potionId,
                                    event.target.value
                                 )
                              }
                              placeholder="Ex: estoque, floresta..."
                              className="w-full bg-white/10 px-3 py-1 text-xs text-white outline-none ring-1 ring-transparent placeholder:text-white/30 focus:ring-yellow-400"
                           />

                           <button
                              type="button"
                              onClick={() =>
                                 openInfoModal(
                                    "Local dos Ingredientes",
                                    draftLocation
                                 )
                              }
                              className="text-white/60 transition hover:text-yellow-400"
                           >
                              <InformationCircleIcon className="h-4 w-4" />
                           </button>
                        </span>

                        <div
                           className="relative"
                           ref={
                              editingLevelPotionId === potionId
                                 ? levelDropdownRef
                                 : null
                           }
                        >
                           <button
                              type="button"
                              onClick={() => handleOpenLevelDropdown(potionId)}
                              className="text-left text-[#736868] transition hover:text-white"
                           >
                              {draftLevel || "+"}
                           </button>

                           {editingLevelPotionId === potionId ? (
                              <div
                                 className={`absolute left-0 z-40 max-h-56 w-52 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl ${dropdownDirection}`}
                              >
                                 {levelOptions.map((level) => (
                                    <button
                                       key={level}
                                       type="button"
                                       onClick={() =>
                                          handleSelectLevel(potionId, level)
                                       }
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
                              handleXpChange(potionId, event.target.value)
                           }
                           className="w-full bg-[#9d564c] px-3 py-1 text-center text-xs text-white outline-none ring-1 ring-transparent focus:ring-yellow-400"
                        />

                        <span>{mastery.maestria}</span>

                        <div className="flex items-center gap-2">
                           <button
                              type="button"
                              disabled={!hasChanged || savingPotionId === potionId}
                              onClick={() =>
                                 handleSavePotion(potionId, potion, savedData)
                              }
                              className={`flex h-7 w-7 items-center justify-center rounded transition ${
                                 hasChanged && savingPotionId !== potionId
                                    ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300"
                                    : "bg-white/10 text-white/30"
                              }`}
                           >
                              <CheckIcon className="h-4 w-4" />
                           </button>

                           <button
                              type="button"
                              disabled={savingPotionId === potionId}
                              onClick={() => handleDeletePotion(potionId)}
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
                  Nenhuma poção encontrada.
               </div>
            )}
         </div>
      </div>
   );
};

export default Table;