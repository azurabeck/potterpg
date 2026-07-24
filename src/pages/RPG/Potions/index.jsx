import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/services/firebase";

import PotionFormModal from "./PotionFormModal";
import PotionsTable from "./PotionsTable";
import SearchBar from "./SearchBar";
import YearCards from "./YearCards";
import { YEARS } from "./constants";
import {
   getPotionSearchText,
   hydratePotionFromFirestore,
   normalizePotionForFirestore,
   POTIONS_COLLECTION,
} from "./helpers";


const Potions = () => {
   const [search, setSearch] = useState("");
   const [selectedYear, setSelectedYear] = useState(1);
   const [potions, setPotions] = useState([]);
   const [isLoadingPotions, setIsLoadingPotions] = useState(false);
   const [editingPotion, setEditingPotion] = useState(null);
   const [isSavingPotion, setIsSavingPotion] = useState(false);
   const [deletingPotionId, setDeletingPotionId] = useState(null);

   useEffect(() => {
      const loadPotions = async () => {
         setIsLoadingPotions(true);

         try {
            const snapshot = await getDocs(collection(db, POTIONS_COLLECTION));

            if (!snapshot.empty) {
               setPotions(snapshot.docs.map((document) => hydratePotionFromFirestore(document.id, document.data())));
            }
         } catch (error) {
            console.error("Erro ao carregar poções do Firestore:", error);
         } finally {
            setIsLoadingPotions(false);
         }
      };

      loadPotions();
   }, []);

   const potionsByYear = useMemo(
      () => YEARS.map((year) => {
         const yearPotions = potions.filter((potion) => Number(potion.ano) === Number(year));
         const levelCounts = yearPotions.reduce((accumulator, potion) => {
            const level = potion.nivel || "Sem nível";
            accumulator[level] = (accumulator[level] || 0) + 1;
            return accumulator;
         }, {});

         return {
            year,
            potions: yearPotions,
            levels: Object.entries(levelCounts),
         };
      }),
      [potions]
   );

   const filteredPotions = useMemo(() => {
      const searchValue = search.trim().toLowerCase();

      return potions.filter((potion) => {
         if (Number(potion.ano) !== Number(selectedYear)) return false;
         if (!searchValue) return true;
         return getPotionSearchText(potion).includes(searchValue);
      });
   }, [potions, search, selectedYear]);

   const handleSaveEditedPotion = async (updatedPotion) => {
      setIsSavingPotion(true);
      try {
         const normalizedPotion = normalizePotionForFirestore(updatedPotion);
         await setDoc(
            doc(db, POTIONS_COLLECTION, normalizedPotion.id),
            { ...normalizedPotion, updated_at: serverTimestamp() },
            { merge: true }
         );
         setPotions((current) => current.map((potion) =>
            potion.id === normalizedPotion.id ? normalizedPotion : potion
         ));
         setEditingPotion(null);
         alert("Poção atualizada no Firestore.");
      } catch (error) {
         console.error("Erro ao atualizar poção no Firestore:", error);
         alert("Não foi possível atualizar a poção no Firestore.");
      } finally {
         setIsSavingPotion(false);
      }
   };

   const handleDeletePotion = async (potion) => {
      const confirmed = window.confirm(
         `Excluir “${potion.name}” definitivamente do Firestore? Esta ação não pode ser desfeita.`
      );

      if (!confirmed) return;

      setDeletingPotionId(potion.id);
      try {
         const firestoreId = potion.firestore_id || potion.id;
         await deleteDoc(doc(db, POTIONS_COLLECTION, firestoreId));
         setPotions((current) => current.filter((item) => item.id !== potion.id));
         if (editingPotion?.id === potion.id) setEditingPotion(null);
      } catch (error) {
         console.error("Erro ao excluir poção do Firestore:", error);
         alert("Não foi possível excluir a poção do Firestore.");
      } finally {
         setDeletingPotionId(null);
      }
   };

   return (
      <div className="min-h-[calc(100vh-65px)] bg-[#2b0038] text-white">
         <SearchBar search={search} onSearchChange={setSearch} />

         <main className="p-4 md:p-8">
            <YearCards potionsByYear={potionsByYear} selectedYear={selectedYear} onSelectYear={setSelectedYear} />
            <PotionsTable
               potions={filteredPotions}
               selectedYear={selectedYear}
               onEditPotion={setEditingPotion}
               onDeletePotion={handleDeletePotion}
               deletingPotionId={deletingPotionId}
            />

            {isLoadingPotions ? (
               <p className="mt-4 text-center text-xs text-purple-200/60">Carregando poções do Firestore...</p>
            ) : null}
         </main>

         {editingPotion ? (
            <PotionFormModal
               potion={editingPotion}
               onClose={() => setEditingPotion(null)}
               onSubmit={handleSaveEditedPotion}
               isSaving={isSavingPotion}
            />
         ) : null}
      </div>
   );
};

export default Potions;
