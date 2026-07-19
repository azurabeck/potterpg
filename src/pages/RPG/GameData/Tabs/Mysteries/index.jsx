import { useEffect, useMemo, useState } from "react";
import {
   addDoc,
   arrayRemove,
   arrayUnion,
   collection,
   deleteDoc,
   doc,
   getDocs,
   query,
   serverTimestamp,
   updateDoc,
   where,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import RulesPanel from "../../Shared/RulesPanel";
import MobileFilterDrawer from "../../Shared/MobileFilterDrawer";
import MysteryFormModal from "./MysteryFormModal";
import Side from "./Side";
import Timeline from "./Timeline";
import mysteryRules from "./json-files/mysteryRules.json";
import {
   buildMysteryPayload,
   getFilteredAndSortedMysteries,
   getYears,
   normalizeMystery,
} from "./helpers";

const MysteriesTab = ({ selectedCharacter, setCharacters }) => {
   const [mysteries, setMysteries] = useState([]);
   const [expandedMysteryId, setExpandedMysteryId] = useState("");
   const [search, setSearch] = useState("");
   const [sort, setSort] = useState("name-asc");
   const [statusFilter, setStatusFilter] = useState("");
   const [yearFilter, setYearFilter] = useState("");
   const [categoryFilter, setCategoryFilter] = useState("");
   const [modal, setModal] = useState(null);
   const [isSaving, setIsSaving] = useState(false);

   const years = useMemo(() => getYears(mysteries), [mysteries]);

   const filteredMysteries = useMemo(() => {
      return getFilteredAndSortedMysteries({ mysteries, search, sort, statusFilter, yearFilter, categoryFilter });
   }, [mysteries, search, sort, statusFilter, yearFilter, categoryFilter]);

   useEffect(() => {
      const loadMysteries = async () => {
         if (!selectedCharacter?.id) return;

         const mysteriesQuery = query(collection(db, "mysteries"), where("character_id", "==", selectedCharacter.id));
         const snapshot = await getDocs(mysteriesQuery);
         setMysteries(snapshot.docs.map(normalizeMystery));
      };

      loadMysteries();
   }, [selectedCharacter?.id]);

   const updateLocalMysteries = (mystery) => {
      setMysteries((currentMysteries) => {
         const exists = currentMysteries.some((currentMystery) => currentMystery.id === mystery.id);
         if (!exists) return [...currentMysteries, mystery];

         return currentMysteries.map((currentMystery) => currentMystery.id === mystery.id ? mystery : currentMystery);
      });
   };

   const updateCharacterMysteryIds = async (mysteryId) => {
      if (!selectedCharacter?.id) return;

      await updateDoc(doc(db, "characters", selectedCharacter.id), {
         mystery_ids: arrayUnion(mysteryId),
         updated_at: serverTimestamp(),
      });

      setCharacters((currentCharacters) =>
         currentCharacters.map((character) => {
            if (character.id !== selectedCharacter.id) return character;

            const mysteryIds = character.mystery_ids || [];
            const nextMysteryIds = mysteryIds.includes(mysteryId) ? mysteryIds : [...mysteryIds, mysteryId];

            return { ...character, mystery_ids: nextMysteryIds };
         })
      );
   };

   const removeCharacterMysteryId = async (mysteryId) => {
      if (!selectedCharacter?.id) return;

      await updateDoc(doc(db, "characters", selectedCharacter.id), {
         mystery_ids: arrayRemove(mysteryId),
         updated_at: serverTimestamp(),
      });

      setCharacters((currentCharacters) =>
         currentCharacters.map((character) => {
            if (character.id !== selectedCharacter.id) return character;
            return { ...character, mystery_ids: (character.mystery_ids || []).filter((id) => id !== mysteryId) };
         })
      );
   };

   const handleSaveMystery = async (form) => {
      if (!selectedCharacter?.id) return;

      try {
         setIsSaving(true);

         const payload = buildMysteryPayload({ form, selectedCharacter });

         if (modal?.mystery?.id) {
            await updateDoc(doc(db, "mysteries", modal.mystery.id), {
               ...payload,
               updated_at: serverTimestamp(),
            });

            updateLocalMysteries({ ...payload, id: modal.mystery.id });
            setExpandedMysteryId(modal.mystery.id);
         } else {
            const docRef = await addDoc(collection(db, "mysteries"), {
               ...payload,
               created_at: serverTimestamp(),
               updated_at: serverTimestamp(),
            });

            await updateCharacterMysteryIds(docRef.id);
            updateLocalMysteries({ ...payload, id: docRef.id });
            setExpandedMysteryId(docRef.id);
         }

         setModal(null);
      } catch (error) {
         console.error("Erro ao salvar mistério:", error);
      } finally {
         setIsSaving(false);
      }
   };


   const getMysteriesText = () => {
      if (!mysteries.length) return "";

      return mysteries
         .map((mystery) => {
            if (mystery.category === "proxima sessão") {
               return [
                  `Categoria: Próxima Sessão`,
                  `Nome: ${mystery.name || ""}`,
                  `Ano: ${mystery.year || ""}`,
                  `Detalhes: ${mystery.details || ""}`,
                  `Próxima sessão: ${mystery.next_session ? "Sim" : "Não"}`,
               ].join("\n");
            }

            if (mystery.category === "pendencias narrador") {
               return [
                  `Categoria: Pendências do Narrador`,
                  `Evento aguardado: ${mystery.awaited_event || mystery.name || ""}`,
                  `Ano: ${mystery.year || ""}`,
                  `Situação atual: ${mystery.current_situation || ""}`,
                  `Quem pode responder ao Tomas: ${mystery.responder || ""}`,
               ].join("\n");
            }

            if (mystery.category === "projetos") {
               return [
                  `Categoria: Projetos`,
                  `Projeto: ${mystery.title || mystery.name || ""}`,
                  `Ano: ${mystery.year || ""}`,
                  `Status: ${mystery.status || ""}`,
                  `Última aparição: ${mystery.last_appearance || ""}`,
                  `Detalhes: ${mystery.details || ""}`,
                  `Objetivos: ${(mystery.clues || []).map((clue) => clue.name || clue.details || "").filter(Boolean).join(", ")}`,
               ].join("\n");
            }

            return [
               `Categoria: Mistérios`,
               `Mistério: ${mystery.title || mystery.name || ""}`,
               `Ano: ${mystery.year || ""}`,
               `Status: ${mystery.status || ""}`,
               `Última aparição: ${mystery.last_appearance || ""}`,
               `Pistas: ${(mystery.clues || []).map((clue) => clue.name || clue.details || "").filter(Boolean).join(", ")}`,
            ].join("\n");
         })
         .join("\n\n---\n\n");
   };

   const handleDeleteMystery = async (mysteryId) => {
      if (!mysteryId) return;

      try {
         setIsSaving(true);
         await deleteDoc(doc(db, "mysteries", mysteryId));
         await removeCharacterMysteryId(mysteryId);
         setMysteries((currentMysteries) => currentMysteries.filter((mystery) => mystery.id !== mysteryId));
         if (expandedMysteryId === mysteryId) setExpandedMysteryId("");
      } catch (error) {
         console.error("Erro ao excluir mistério:", error);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2 lg:gap-12">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <MysteryFormModal
                  key={modal.mystery?.id || "new-mystery"}
                  mystery={modal.mystery}
                  onSubmit={handleSaveMystery}
                  isSaving={isSaving}
               />
            ) : null}

            {modal?.type === "rules" ? <RulesPanel activeTab="mysteries" currentRules={mysteryRules} /> : null}
         </Modal>

         <Timeline
            mysteries={filteredMysteries}
            expandedMysteryId={expandedMysteryId}
            setExpandedMysteryId={setExpandedMysteryId}
            onEditMystery={(mystery) => setModal({ type: "form", title: "Editar Registro", mystery })}
            onDeleteMystery={handleDeleteMystery}
         />

         <MobileFilterDrawer title="Filtros de Mistérios">
            <Side
               search={search}
               sort={sort}
               statusFilter={statusFilter}
               yearFilter={yearFilter}
               categoryFilter={categoryFilter}
               years={years}
               setSearch={setSearch}
               setSort={setSort}
               setStatusFilter={setStatusFilter}
               setYearFilter={setYearFilter}
               setCategoryFilter={setCategoryFilter}
               onAddMystery={() => setModal({ type: "form", title: "Adicionar Registro", mystery: null })}
               onOpenRules={() => setModal({ type: "rules", title: "Regras de Mistérios" })}
               onCopyMysteries={getMysteriesText}
            />
         </MobileFilterDrawer>

         <div className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
            <Side
               search={search}
               sort={sort}
               statusFilter={statusFilter}
               yearFilter={yearFilter}
               categoryFilter={categoryFilter}
               years={years}
               setSearch={setSearch}
               setSort={setSort}
               setStatusFilter={setStatusFilter}
               setYearFilter={setYearFilter}
               setCategoryFilter={setCategoryFilter}
               onAddMystery={() => setModal({ type: "form", title: "Adicionar Registro", mystery: null })}
               onOpenRules={() => setModal({ type: "rules", title: "Regras de Mistérios" })}
               onCopyMysteries={getMysteriesText}
            />
         </div>
      </div>
   );
};

export default MysteriesTab;
