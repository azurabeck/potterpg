import { useMemo, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import { atributoOrdem } from "./atributoOrdem";
import EmptyContent from "../../Shared/EmptyContent";

const AttributesTab = ({ selectedCharacter, setCharacters }) => {
   const [editingAttributeName, setEditingAttributeName] = useState("");
   const [attributeDraftValue, setAttributeDraftValue] = useState("");
   const [savingAttributeName, setSavingAttributeName] = useState("");

   const entries = useMemo(() => {
      const atributos = selectedCharacter?.atributos || {};

      return atributoOrdem
         .filter((attributeName) => attributeName in atributos)
         .map((attributeName) => [attributeName, atributos[attributeName]]);
   }, [selectedCharacter]);

   const handleSelectAttribute = (attributeName, attributeValue) => {
      setEditingAttributeName(attributeName);
      setAttributeDraftValue(String(attributeValue ?? 0));
   };

   const handleAttributeValueChange = (event) => {
      const { value } = event.target;

      if (/^-?\d*$/.test(value)) {
         setAttributeDraftValue(value);
      }
   };

   const getAttributeChangedStatus = (attributeName, originalValue) => {
      if (editingAttributeName !== attributeName) return false;
      if (attributeDraftValue === "") return false;

      return Number(attributeDraftValue) !== Number(originalValue);
   };

   const handleSaveAttribute = async (attributeName, originalValue) => {
      const hasChanged = getAttributeChangedStatus(attributeName, originalValue);

      if (!selectedCharacter?.id || !hasChanged) return;

      const normalizedValue = Number(attributeDraftValue);

      if (Number.isNaN(normalizedValue)) return;

      try {
         setSavingAttributeName(attributeName);

         const characterRef = doc(db, "characters", selectedCharacter.id);

         await updateDoc(characterRef, {
            [`atributos.${attributeName}`]: normalizedValue,
            updated_at: serverTimestamp(),
         });

         setCharacters((currentCharacters) =>
            currentCharacters.map((character) => {
               if (character.id !== selectedCharacter.id) return character;

               return {
                  ...character,
                  atributos: {
                     ...(character.atributos || {}),
                     [attributeName]: normalizedValue,
                  },
               };
            })
         );

         setAttributeDraftValue(String(normalizedValue));
      } catch (requestError) {
         console.error("Erro ao salvar atributo:", requestError);
      } finally {
         setSavingAttributeName("");
      }
   };

   if (!entries.length) {
      return <EmptyContent>Nenhum atributo cadastrado.</EmptyContent>;
   }

   return (
      <div className="space-y-3">
         {entries.map(([name, value]) => {
            const isEditing = editingAttributeName === name;
            const hasChanged = getAttributeChangedStatus(name, value);
            const isSaving = savingAttributeName === name;

            return (
               <div
                  key={name}
                  onClick={() => handleSelectAttribute(name, value)}
                  className="group grid cursor-pointer grid-cols-[1fr_84px_36px] items-center gap-4 rounded-md p-2 text-sm text-[#736868] transition-all duration-200 hover:bg-white/60 hover:text-[#2b0038]"
               >
                  <span>{name}</span>

                  {isEditing ? (
                     <input
                        type="text"
                        value={attributeDraftValue}
                        onClick={(event) => event.stopPropagation()}
                        onChange={handleAttributeValueChange}
                        className="w-full bg-[#603467] px-3 py-1 text-center text-xs text-white outline-none ring-1 ring-white/20 focus:ring-yellow-400"
                     />
                  ) : (
                     <span className="bg-[#603467] px-3 py-1 text-center text-xs text-white">
                        {value}
                     </span>
                  )}

                  {isEditing ? (
                     <button
                        type="button"
                        disabled={!hasChanged || isSaving}
                        onClick={(event) => {
                           event.stopPropagation();
                           handleSaveAttribute(name, value);
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded transition ${
                           hasChanged && !isSaving
                              ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300"
                              : "bg-white/10 text-white/30"
                        }`}
                        title="Salvar atributo"
                     >
                        <CheckIcon className="h-4 w-4" />
                     </button>
                  ) : (
                     <div className="h-7 w-7" />
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default AttributesTab;
