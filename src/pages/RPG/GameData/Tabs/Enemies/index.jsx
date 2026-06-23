import { useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import MobileFilterDrawer from "../../Shared/MobileFilterDrawer";
import Side from "./Side";
import Table from "./Table";
import EnemiesFilters from "./EnemiesFilters";
import EnemyFormModal from "./EnemyFormModal";
import BulkEnemyJsonModal from "./BulkEnemyJsonModal";
import { getFilteredAndSortedEnemies, normalizeEnemy } from "./helpers";

const EnemiesTab = () => {
   const [enemies, setEnemies] = useState([]);
   const [selectedEnemyId, setSelectedEnemyId] = useState("");
   const [search, setSearch] = useState("");
   const [typeFilter, setTypeFilter] = useState("Todos");
   const [difficultyFilter, setDifficultyFilter] = useState("Todos");
   const [sort, setSort] = useState("name-asc");
   const [modal, setModal] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const detailsRef = useRef(null);

   const filteredEnemies = useMemo(() => {
      return getFilteredAndSortedEnemies({
         enemies,
         search,
         typeFilter,
         difficultyFilter,
         sort,
      });
   }, [enemies, search, typeFilter, difficultyFilter, sort]);

   const selectedEnemy = useMemo(() => {
      return filteredEnemies.find((enemy) => enemy.id === selectedEnemyId) || filteredEnemies[0] || null;
   }, [filteredEnemies, selectedEnemyId]);

   const activeEnemyId = selectedEnemy?.id || "";

   const handleSelectEnemy = (enemy) => {
      setSelectedEnemyId(enemy.id);

      if (window.innerWidth < 1024) {
         setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
         }, 100);
      }
   };

   useEffect(() => {
      const loadEnemies = async () => {
         setIsLoading(true);

         try {
            const snapshot = await getDocs(collection(db, "enemies"));
            setEnemies(snapshot.docs.map((document) => ({ id: document.id, ...normalizeEnemy(document.data()) })));
         } catch (error) {
            console.error("Erro ao carregar adversários:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadEnemies();
   }, []);

   const handleOpenCreateModal = () => {
      setModal({ type: "form", title: "Novo adversário", enemy: null });
   };

   const handleEditEnemy = (enemy) => {
      setModal({ type: "form", title: enemy.name || "Editar adversário", enemy });
   };

   const handleDeleteEnemy = async (enemy) => {
      if (!enemy?.id) return;

      const confirmed = window.confirm(`Excluir ${enemy.name || "este adversário"}?`);
      if (!confirmed) return;

      try {
         await deleteDoc(doc(db, "enemies", enemy.id));
         setEnemies((current) => current.filter((currentEnemy) => currentEnemy.id !== enemy.id));

         if (selectedEnemyId === enemy.id) setSelectedEnemyId("");
      } catch (error) {
         console.error("Erro ao excluir adversário:", error);
      }
   };

   const handleSaveEnemy = async (enemy) => {
      const normalizedEnemy = normalizeEnemy(enemy);

      try {
         if (enemy?.id) {
            await updateDoc(doc(db, "enemies", enemy.id), {
               ...normalizedEnemy,
               updated_at: serverTimestamp(),
            });

            setEnemies((current) =>
               current.map((currentEnemy) => currentEnemy.id === enemy.id ? { ...currentEnemy, ...normalizedEnemy } : currentEnemy)
            );
         } else {
            const newEnemy = {
               ...normalizedEnemy,
               created_at: serverTimestamp(),
               updated_at: serverTimestamp(),
            };

            const documentRef = await addDoc(collection(db, "enemies"), newEnemy);
            setEnemies((current) => [...current, { id: documentRef.id, ...newEnemy }]);
            setSelectedEnemyId(documentRef.id);
         }

         setModal(null);
      } catch (error) {
         console.error("Erro ao salvar adversário:", error);
      }
   };

   const handleCreateEnemiesFromJson = async (jsonText) => {
      try {
         const parsed = JSON.parse(jsonText);
         const parsedEnemies = Array.isArray(parsed) ? parsed : parsed.enemies || [];
         const createdEnemies = [];

         for (const enemy of parsedEnemies) {
            const newEnemy = {
               ...normalizeEnemy(enemy),
               created_at: serverTimestamp(),
               updated_at: serverTimestamp(),
            };

            const documentRef = await addDoc(collection(db, "enemies"), newEnemy);
            createdEnemies.push({ id: documentRef.id, ...newEnemy });
         }

         setEnemies((current) => [...current, ...createdEnemies]);
         setModal(null);
      } catch (error) {
         console.error("Erro ao cadastrar adversários em bloco:", error);
         alert("JSON inválido ou erro ao cadastrar adversários.");
      }
   };

   return (
      <div className="grid grid-cols-1 gap-8 pb-2 lg:grid-cols-[0.85fr_1.45fr] lg:gap-12">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <EnemyFormModal key={modal.enemy?.id || "new-enemy"} enemy={modal.enemy} onSubmit={handleSaveEnemy} />
            ) : null}

            {modal?.type === "bulk-json" ? (
               <BulkEnemyJsonModal onSubmit={handleCreateEnemiesFromJson} />
            ) : null}
         </Modal>

         <MobileFilterDrawer title="Filtros de Adversários">
            <EnemiesFilters
               search={search}
               typeFilter={typeFilter}
               difficultyFilter={difficultyFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setDifficultyFilter={setDifficultyFilter}
               setSort={setSort}
               enemies={enemies}
               onOpenFormModal={handleOpenCreateModal}
               onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Cadastrar adversários por JSON" })}
            />
         </MobileFilterDrawer>

         <Table
            enemies={filteredEnemies}
            selectedEnemyId={activeEnemyId}
            onSelectEnemy={handleSelectEnemy}
            onEditEnemy={handleEditEnemy}
            onDeleteEnemy={handleDeleteEnemy}
            onOpenFormModal={handleOpenCreateModal}
            onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Cadastrar adversários por JSON" })}
            search={search}
            typeFilter={typeFilter}
            difficultyFilter={difficultyFilter}
            sort={sort}
            setSearch={setSearch}
            setTypeFilter={setTypeFilter}
            setDifficultyFilter={setDifficultyFilter}
            setSort={setSort}
            allEnemies={enemies}
         />

         <div className="lg:sticky lg:top-0 lg:self-start" ref={detailsRef}>
            <Side selectedEnemy={selectedEnemy} />
         </div>

         {isLoading ? (
            <div className="text-center text-xs text-purple-100/50 lg:col-span-2">Carregando adversários...</div>
         ) : null}
      </div>
   );
};

export default EnemiesTab;
