import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../services/firebase";
import { getCharactersByUserId } from "../../../../services/rpg/character.service";

import { atributoOrdem, regrasPorAba, tabs } from "./constants";
import SheetHeader from "./components/SheetHeader";
import CharacterImage from "./components/CharacterImage";
import SheetTabs from "./components/SheetTabs";
import TabContent from "./components/TabContent";
import RulesPanel from "./components/RulesPanel";

const CharacterSheet = () => {
   const [activeTab, setActiveTab] = useState("attributes");
   const [characters, setCharacters] = useState([]);
   const [selectedCharacterId, setSelectedCharacterId] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [editingAttributeName, setEditingAttributeName] = useState("");
   const [attributeDraftValue, setAttributeDraftValue] = useState("");
   const [savingAttributeName, setSavingAttributeName] = useState("");

   const selectedCharacter = useMemo(() => {
      return characters.find(
         (character) => character.id === selectedCharacterId
      );
   }, [characters, selectedCharacterId]);

   const currentRules = regrasPorAba[activeTab] || regrasPorAba.spells;

   const attributeEntries = useMemo(() => {
      const atributos = selectedCharacter?.atributos || {};

      return atributoOrdem
         .filter((attributeName) => attributeName in atributos)
         .map((attributeName) => [attributeName, atributos[attributeName]]);
   }, [selectedCharacter]);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (!user) {
            setCharacters([]);
            setSelectedCharacterId("");
            setLoading(false);
            return;
         }

         try {
            setLoading(true);
            setError("");

            const userCharacters = await getCharactersByUserId(user.uid);

            setCharacters(userCharacters);
            setSelectedCharacterId(userCharacters[0]?.id || "");
         } catch (requestError) {
            console.error("Erro ao carregar personagem:", requestError);
            setError("Não foi possível carregar sua ficha.");
         } finally {
            setLoading(false);
         }
      });

      return () => unsubscribe();
   }, []);

   const clearAttributeEditing = () => {
      setEditingAttributeName("");
      setAttributeDraftValue("");
   };

   const handleTabChange = (tabKey) => {
      setActiveTab(tabKey);

      if (tabKey !== "attributes") {
         clearAttributeEditing();
      }
   };

   const handleCharacterChange = (event) => {
      setSelectedCharacterId(event.target.value);
      clearAttributeEditing();
   };

   const handleSelectAttribute = (attributeName, attributeValue) => {
      setEditingAttributeName(attributeName);
      setAttributeDraftValue(String(attributeValue ?? 0));
   };

   const handleAttributeValueChange = (event) => {
      const value = event.target.value;

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

   if (loading) {
      return (
         <section className="mx-auto min-h-[530px] max-w-6xl bg-[#30003f] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
               Perfil RPG
            </p>
            <h1 className="mt-3 text-sm uppercase tracking-[0.16em]">
               Carregando ficha...
            </h1>
         </section>
      );
   }

   if (error) {
      return (
         <section className="mx-auto min-h-[530px] max-w-6xl bg-[#30003f] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
               Perfil RPG
            </p>
            <h1 className="mt-3 text-sm uppercase tracking-[0.16em]">
               {error}
            </h1>
         </section>
      );
   }

   if (!selectedCharacter) {
      return (
         <section className="mx-auto min-h-[530px] max-w-6xl bg-[#30003f] p-8 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-6">
               <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
                     Perfil RPG
                  </p>
                  <h1 className="mt-3 text-sm uppercase tracking-[0.16em]">
                     Nenhum personagem encontrado
                  </h1>
               </div>

               <NavLink
                  to="/rpg/sheet/create"
                  className="text-3xl font-bold text-yellow-400 transition hover:text-yellow-300"
               >
                  +
               </NavLink>
            </div>
         </section>
      );
   }

   const isSpellsTab = activeTab === "spells";

   return (
      <section className="flex h-[calc(100vh-65px)] w-full flex-col bg-[#30003f] px-8 pb-7 pt-6 text-white shadow-2xl">
         <SheetHeader
            characters={characters}
            selectedCharacter={selectedCharacter}
            selectedCharacterId={selectedCharacterId}
            onCharacterChange={handleCharacterChange}
         />

         <div className="mt-5 min-h-0 flex-1 border-t border-white/20 pt-4">
            <div className="grid h-full min-h-0 w-full grid-cols-12">
               <CharacterImage character={selectedCharacter} />

               <div className="col-span-9 grid h-full min-h-0 grid-rows-[52px_1fr]">
                  <SheetTabs
                     tabs={tabs}
                     activeTab={activeTab}
                     onTabChange={handleTabChange}
                  />

                  <div className="min-h-0 overflow-y-auto px-12 py-12">
                     <div
                        className={
                           isSpellsTab
                              ? "min-h-full"
                              : "grid min-h-[1200px] grid-cols-12 gap-8"
                        }
                     >
                        <div
                           className={
                              isSpellsTab
                                 ? "text-left"
                                 : "col-span-6 pr-6 text-left"
                           }
                        >
                           <div
                              className={
                                 isSpellsTab ? "" : "sticky top-0"
                              }
                           >
                              <TabContent
                                 activeTab={activeTab}
                                 selectedCharacter={selectedCharacter}
                                 setCharacters={setCharacters}
                                 attributeEntries={attributeEntries}
                                 editingAttributeName={editingAttributeName}
                                 attributeDraftValue={attributeDraftValue}
                                 savingAttributeName={savingAttributeName}
                                 onSelectAttribute={handleSelectAttribute}
                                 onAttributeValueChange={handleAttributeValueChange}
                                 onSaveAttribute={handleSaveAttribute}
                                 getAttributeChangedStatus={
                                    getAttributeChangedStatus
                                 }
                              />
                           </div>
                        </div>

                        {!isSpellsTab ? (
                           <>
                              <div className="col-span-1 border-l border-dashed border-white/25" />

                              <div className="col-span-5 pr-2">
                                 <RulesPanel
                                    activeTab={activeTab}
                                    currentRules={currentRules}
                                 />
                              </div>
                           </>
                        ) : null}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default CharacterSheet;