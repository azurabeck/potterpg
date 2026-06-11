import { useState } from "react";
import {
   CheckIcon,
   InformationCircleIcon,
   PlusIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { getMasteryByXp } from "../../../../../helpers/mastery";
import Modal from "../../../../../components/Modal";
import { levelOptions, tableColumns } from "./constants";
import { getPotionDisplayName } from "./helpers";
import IngredientsInfoModal from "./IngredientsInfoModal";

const emptyIngredientInfo = {
   name: "",
   drop: "",
   shop: "",
   value: "",
};

const Table = ({
   filteredAndSortedPotions,
   xpDrafts,
   levelDrafts,
   locationDrafts,
   ingredientsInfoDrafts,
   savingPotionId,
   editingLevelPotionId,
   levelDropdownRef,
   handleSort,
   renderSortIcon,
   handleXpChange,
   handleIngredientsInfoChange,
   handleOpenLevelDropdown,
   handleSelectLevel,
   handleSavePotion,
   handleDeletePotion,
}) => {
   const [modalContent, setModalContent] = useState(null);

   const closeModal = () => {
      setModalContent(null);
   };

   const openTextModal = (title, text) => {
      setModalContent({
         type: "text",
         title,
         text: text || "Nenhuma informação cadastrada.",
      });
   };

   const openIngredientsInfoModal = (potionId, ingredientsInfo) => {
      setModalContent({
         type: "ingredientsInfo",
         title: "Informações dos Ingredientes",
         potionId,
         ingredientsInfo: Array.isArray(ingredientsInfo) && ingredientsInfo.length
            ? ingredientsInfo
            : [emptyIngredientInfo],
      });
   };

   const updateIngredientsInfo = (value) => {
      const potionId = modalContent?.potionId;
      if (!potionId) return;

      const nextIngredientsInfo =
         typeof value === "function" ? value(modalContent?.ingredientsInfo || []) : value;

      setModalContent((current) => ({
         ...current,
         ingredientsInfo: nextIngredientsInfo,
      }));

      handleIngredientsInfoChange(potionId, nextIngredientsInfo);
   };

   return (
      <div className="overflow-visible">
         <Modal
            isOpen={!!modalContent}
            title={modalContent?.title}
            onClose={closeModal}
         >
            {modalContent?.type === "ingredientsInfo" ? (
               <IngredientsInfoModal
                  ingredientsInfo={modalContent?.ingredientsInfo || []}
                  setIngredientsInfo={updateIngredientsInfo}
               />
            ) : (
               <p className="whitespace-pre-line leading-6">
                  {modalContent?.text}
               </p>
            )}
         </Modal>

         <div
            className={`grid ${tableColumns} gap-5 border-b border-white/10 pb-3 text-xs text-purple-100/90`}
         >
            <button type="button" onClick={() => handleSort("year")} className="text-left p-2">
               Ano{renderSortIcon("year")}
            </button>

            <button type="button" onClick={() => handleSort("name")} className="text-left p-2">
               Nome {renderSortIcon("name")}
            </button>

            <button type="button" onClick={() => handleSort("effect")} className="text-left p-2">
               Efeito {renderSortIcon("effect")}
            </button>

            <div className="flex items-center p-2">Ingredientes</div>

            <button type="button" onClick={() => handleSort("ingredientLocation")} className="text-left p-2">
               Local Ingredientes {renderSortIcon("ingredientLocation")}
            </button>

            <button type="button" onClick={() => handleSort("level")} className="text-left p-2">
               Nível {renderSortIcon("level")}
            </button>

            <button type="button" onClick={() => handleSort("xp")} className="text-left p-2">
               XP Atual {renderSortIcon("xp")}
            </button>

            <div className="flex items-center p-2">Maestria</div>
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
                  const currentIngredientsInfo =
                     savedData?.ingredientes_info || [];

                  const draftXp = xpDrafts[potionId] ?? String(currentXp);
                  const draftLevel = levelDrafts[potionId] ?? currentLevel;
                  const draftLocation =
                     locationDrafts[potionId] ?? currentLocation;
                  const draftIngredientsInfo = ingredientsInfoDrafts[potionId] ?? currentIngredientsInfo;
                  const hasIngredientsInfo = draftIngredientsInfo.length > 0;

                  const hasChanged =
                     Number(draftXp) !== Number(currentXp) ||
                     draftLevel !== currentLevel ||
                     draftLocation !== currentLocation ||
                     JSON.stringify(draftIngredientsInfo) !==
                        JSON.stringify(currentIngredientsInfo);

                  const mastery = getMasteryByXp(draftLevel, draftXp);
                  const dropdownDirection = index < 3 ? "top-8" : "bottom-8";

                  return (
                     <div
                        key={potionId}
                        className={`grid ${tableColumns} min-h-12 items-center gap-5 text-xs text-[#736868] transition hover:bg-white/5`}
                     >
                        <span className="p-2">{potion.attributes?.ano_letivo || "-"}</span>

                        <span className="flex items-center gap-2 text-white/80  p-2">
                           {getPotionDisplayName(potion)}
                        </span>

                        <span className="line-clamp-2  p-2" title={item.effect}>
                           {item.effect || "-"}
                        </span>

                        <span className="flex items-center gap-2  p-2">
                           <button
                              type="button"
                              onClick={() =>
                                 openTextModal("Ingredientes", item.ingredients)
                              }
                              className="text-xs w-100 flex items-center justify-between cursor-pointer text-[#736868] transition hover:text-yellow-300"
                           >
                              <span className="line-clamp-1 w-[150px] text-left">
                                 {item.ingredients || "-"}
                              </span>
                             <InformationCircleIcon className="h-4 w-4" />
                           </button>
                        </span>

                        <span className="flex items-center gap-2 p-2">
                           {hasIngredientsInfo ? (
                              <button
                                 type="button"
                                 onClick={() => openIngredientsInfoModal(potionId, draftIngredientsInfo)}
                                 className="text-xs w-100 flex items-center justify-between cursor-pointer text-[#736868] transition hover:text-yellow-300"
                              >
                                 Ver locais <InformationCircleIcon className="h-4 w-4" />
                              </button>
                           ) : (
                              <button
                                 type="button"
                                 onClick={() => openIngredientsInfoModal(potionId, draftIngredientsInfo)}
                                 className="flex w-100 h-[30px] items-center cursor-pointer justify-center bg-white/10 text-white/50 transition hover:bg-yellow-400 hover:text-[#2b0038]"
                                 title="Adicionar informações dos ingredientes"
                              >
                                  <PlusIcon className="h-3 w-3" />
                              </button>
                           )}
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

                        <span>{mastery.maestria} → {mastery.dado}</span>

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