import { Navigate, Route, Routes } from "react-router-dom";

import AttributeList from "../Tabs/Attributes/index";
import SpellsTab from "../Tabs/Spells/index";
import PotionsTab from "../Tabs/Potions/index";

const TabContent = ({
   selectedCharacter,
   setCharacters,
   attributeEntries,
   editingAttributeName,
   attributeDraftValue,
   savingAttributeName,
   onSelectAttribute,
   onAttributeValueChange,
   onSaveAttribute,
   getAttributeChangedStatus,
}) => {
   const renderEmptyContent = (message) => {
      return (
         <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-purple-200/70">
            {message}
         </div>
      );
   };

   const renderInventory = () => {
      const dinheiro = selectedCharacter?.dinheiro;
      const varinha = selectedCharacter?.varinha;

      return (
         <div className="space-y-5 pt-6 text-sm text-[#736868]">
            <div>
               <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
                  Dinheiro
               </p>

               <p>
                  {dinheiro?.galeoes ?? 0} Galeões • {dinheiro?.sicles ?? 0}{" "}
                  Sicles • {dinheiro?.nuques ?? 0} Nuques
               </p>
            </div>

            <div>
               <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
                  Varinha
               </p>

               <p>Madeira: {varinha?.madeira || "-"}</p>
               <p>Miolo: {varinha?.miolo || "-"}</p>
               <p>Atributo: {varinha?.atributo || "-"}</p>
            </div>

            <div>
               <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
                  Animal
               </p>

               <p>{selectedCharacter?.animal || "-"}</p>
            </div>
         </div>
      );
   };

   return (
      <Routes>
         <Route index element={<Navigate to="attributes" replace />} />

         <Route
            path="attributes"
            element={
               <AttributeList
                  entries={attributeEntries}
                  editingAttributeName={editingAttributeName}
                  attributeDraftValue={attributeDraftValue}
                  savingAttributeName={savingAttributeName}
                  onSelectAttribute={onSelectAttribute}
                  onAttributeValueChange={onAttributeValueChange}
                  onSaveAttribute={onSaveAttribute}
                  getAttributeChangedStatus={getAttributeChangedStatus}
                  renderEmptyContent={renderEmptyContent}
               />
            }
         />

         <Route
            path="spells"
            element={
               <SpellsTab
                  selectedCharacter={selectedCharacter}
                  setCharacters={setCharacters}
               />
            }
         />

         <Route
            path="potions"
            element={
               <PotionsTab
                  selectedCharacter={selectedCharacter}
                  setCharacters={setCharacters}
               />
            }
         />

         <Route path="inventory" element={renderInventory()} />

         <Route
            path="mysteries"
            element={renderEmptyContent(
               "Mistérios serão vinculados nas próximas sessões."
            )}
         />

         <Route
            path="sessions"
            element={renderEmptyContent("Sessões da campanha ainda não cadastradas.")}
         />

         <Route
            path="relations"
            element={renderEmptyContent("Relações ainda não cadastradas.")}
         />

         <Route path="*" element={<Navigate to="attributes" replace />} />
      </Routes>
   );
};

export default TabContent;