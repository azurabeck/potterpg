import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";

import spellsJson from "@/assets/json/spells_rpg.json";
import { db } from "@/services/firebase";

import SearchBar from "./SearchBar";
import SpellFormModal from "./SpellFormModal";
import SpellsTable from "./SpellsTable";
import YearCards from "./YearCards";
import { YEARS } from "./constants";
import {
   getSpellSearchText,
   hydrateSpellFromFirestore,
   normalizeSpellForFirestore,
   SPELLS_COLLECTION,
} from "./helpers";

const getStaticSpells = () => {
   return spellsJson.map((spell) => {
      const normalizedSpell = normalizeSpellForFirestore(spell);

      return {
         id: normalizedSpell.original_id,
         firestore_id: normalizedSpell.original_id,
         ...normalizedSpell,
      };
   });
};

const Spells = () => {
   const [search, setSearch] = useState("");
   const [selectedYear, setSelectedYear] = useState(1);
   const [spells, setSpells] = useState(() => getStaticSpells());
   const [editingSpell, setEditingSpell] = useState(null);
   const [isLoadingSpells, setIsLoadingSpells] = useState(false);
   const [isSavingSpells, setIsSavingSpells] = useState(false);

   useEffect(() => {
      const loadSpells = async () => {
         setIsLoadingSpells(true);

         try {
            const snapshot = await getDocs(collection(db, SPELLS_COLLECTION));

            if (!snapshot.empty) {
               setSpells(
                  snapshot.docs.map((document) =>
                     hydrateSpellFromFirestore(document.id, document.data())
                  )
               );
            }
         } catch (error) {
            console.error("Erro ao carregar feitiços do Firestore:", error);
         } finally {
            setIsLoadingSpells(false);
         }
      };

      loadSpells();
   }, []);

   const spellsByYear = useMemo(() => {
      return YEARS.map((year) => ({
         year,
         spells: spells.filter(
            (spell) => Number(spell.attributes.ano_letivo) === Number(year)
         ),
         required: spells.filter(
            (spell) => Number(spell.attributes.required) === Number(year)
         ),
      }));
   }, [spells]);

   const filteredSpells = useMemo(() => {
      const searchValue = search.trim().toLowerCase();

      return spells.filter((spell) => {
         const isFromSelectedYear =
            Number(spell.attributes.ano_letivo) === Number(selectedYear);

         if (!isFromSelectedYear) return false;

         if (!searchValue) return true;

         return getSpellSearchText(spell).includes(searchValue);
      });
   }, [search, selectedYear, spells]);

   const handleSaveSpellsOnFirestore = async () => {
      const confirmed = window.confirm(
         `Salvar ${spellsJson.length} feitiços na collection ${SPELLS_COLLECTION}?`
      );

      if (!confirmed) return;

      setIsSavingSpells(true);

      try {
         const batch = writeBatch(db);
         const normalizedSpells = getStaticSpells();

         normalizedSpells.forEach((spell) => {
            const documentRef = doc(db, SPELLS_COLLECTION, spell.original_id);
            batch.set(documentRef, {
               original_id: spell.original_id,
               attributes: spell.attributes,
               updated_at: serverTimestamp(),
            });
         });

         await batch.commit();
         setSpells(normalizedSpells);
      } catch (error) {
         console.error("Erro ao salvar feitiços no Firestore:", error);
         alert("Não foi possível salvar os feitiços no Firestore.");
      } finally {
         setIsSavingSpells(false);
      }
   };

   const handleSaveEditedSpell = async (updatedSpell) => {
      const normalizedSpell = normalizeSpellForFirestore(updatedSpell);
      const documentId = updatedSpell.firestore_id || normalizedSpell.original_id;

      try {
         await updateDoc(doc(db, SPELLS_COLLECTION, documentId), {
            original_id: normalizedSpell.original_id,
            attributes: normalizedSpell.attributes,
            updated_at: serverTimestamp(),
         });

         setSpells((current) =>
            current.map((spell) =>
               spell.id === updatedSpell.id
                  ? {
                       id: normalizedSpell.original_id,
                       firestore_id: documentId,
                       ...normalizedSpell,
                    }
                  : spell
            )
         );

         setEditingSpell(null);
      } catch (error) {
         console.error("Erro ao editar feitiço:", error);
         alert("Não foi possível editar o feitiço. Salve a lista no Firestore primeiro.");
      }
   };

   return (
      <div className="min-h-[calc(100vh-65px)] bg-[#2b0038] text-white">
         {editingSpell ? (
            <SpellFormModal
               spell={editingSpell}
               onClose={() => setEditingSpell(null)}
               onSubmit={handleSaveEditedSpell}
            />
         ) : null}

         <SearchBar
            search={search}
            onSearchChange={setSearch}
            onSaveSpells={handleSaveSpellsOnFirestore}
            isSavingSpells={isSavingSpells}
         />

         <main className="p-4 md:p-8">
            <YearCards
               spellsByYear={spellsByYear}
               selectedYear={selectedYear}
               onSelectYear={setSelectedYear}
            />

            <SpellsTable
               spells={filteredSpells}
               selectedYear={selectedYear}
               onEditSpell={setEditingSpell}
            />

            {isLoadingSpells ? (
               <p className="mt-4 text-center text-xs text-purple-200/60">
                  Carregando feitiços do Firestore...
               </p>
            ) : null}
         </main>
      </div>
   );
};

export default Spells;
