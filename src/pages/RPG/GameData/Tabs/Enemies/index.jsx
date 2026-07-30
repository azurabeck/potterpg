import { useEffect, useMemo, useRef, useState } from "react";
import {
   addDoc,
   arrayUnion,
   collection,
   deleteDoc,
   deleteField,
   doc,
   getDocs,
   serverTimestamp,
   updateDoc,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import MobileFilterDrawer from "../../Shared/MobileFilterDrawer";
import Side from "./Side";
import Table from "./Table";
import EnemiesFilters from "./EnemiesFilters";
import EnemyFormModal from "./EnemyFormModal";
import BulkEnemyJsonModal from "./BulkEnemyJsonModal";
import { getFilteredAndSortedEnemies, normalizeEnemy, normalizeText } from "./helpers";

const EnemiesTab = ({ selectedCharacter, setCharacters }) => {
   const [enemies, setEnemies] = useState([]);
   const [selectedEnemyId, setSelectedEnemyId] = useState("");
   const [search, setSearch] = useState("");
   const [typeFilter, setTypeFilter] = useState("Todos");
   const [difficultyFilter, setDifficultyFilter] = useState("Todos");
   const [sort, setSort] = useState("name-asc");
   const [modal, setModal] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [markingKnownId, setMarkingKnownId] = useState("");

   const detailsRef = useRef(null);

   const knownEnemyIds = useMemo(() => {
      const known = selectedCharacter?.adversarios_conhecidos || [];
      return new Set(known.filter((item) => item.tipo === "enemy").map((item) => item.id));
   }, [selectedCharacter]);

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

   // Marca este adversário como conhecido/enfrentado pelo personagem
   // selecionado — mesma key usada pelo potter-pg (app do jogador) pra
   // filtrar a aba "Adversários" dele: `adversarios_conhecidos`, um
   // array de `{ id, tipo }` (tipo "enemy" aqui, "npc" na aba Relações).
   const handleMarkEnemyAsKnown = async (enemy) => {
      if (!selectedCharacter?.id || !enemy?.id) return;

      const entry = { id: enemy.id, tipo: "enemy" };

      setMarkingKnownId(enemy.id);

      try {
         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            adversarios_conhecidos: arrayUnion(entry),
            updated_at: serverTimestamp(),
         });

         setCharacters((characters) =>
            characters.map((character) => {
               if (character.id !== selectedCharacter.id) return character;

               const current = character.adversarios_conhecidos || [];
               if (current.some((item) => item.id === entry.id && item.tipo === entry.tipo)) return character;

               return { ...character, adversarios_conhecidos: [...current, entry] };
            })
         );
      } catch (error) {
         console.error("Erro ao marcar adversário como conhecido:", error);
         alert("Não foi possível marcar este adversário como conhecido.");
      } finally {
         setMarkingKnownId("");
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

   const getEnemiesFromJson = (jsonText) => {
      const parsed = JSON.parse(jsonText);
      const parsedEnemies = Array.isArray(parsed) ? parsed : parsed.enemies || [];

      if (!Array.isArray(parsedEnemies)) return [];

      return parsedEnemies;
   };

   const mergeEnemyForUpdate = (currentEnemy, jsonEnemy) => ({
      ...currentEnemy,
      ...jsonEnemy,
      main_attack: jsonEnemy.main_attack
         ? {
              ...(currentEnemy.main_attack || {}),
              ...jsonEnemy.main_attack,
           }
         : currentEnemy.main_attack,
      secondary_attack: jsonEnemy.secondary_attack === null
         ? null
         : jsonEnemy.secondary_attack
           ? {
                ...(currentEnemy.secondary_attack || {}),
                ...jsonEnemy.secondary_attack,
             }
           : currentEnemy.secondary_attack,
      defense: jsonEnemy.defense ? { ...(currentEnemy.defense || {}), ...jsonEnemy.defense } : currentEnemy.defense,
   });

   const handleCreateEnemiesFromJson = async (jsonText) => {
      try {
         const parsedEnemies = getEnemiesFromJson(jsonText);
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
         alert(`${createdEnemies.length} adversário(s) cadastrado(s).`);
      } catch (error) {
         console.error("Erro ao cadastrar adversários em bloco:", error);
         alert("JSON inválido ou erro ao cadastrar adversários.");
      }
   };


   const removeAttackDamage = (attack) => {
      if (!attack) return attack;
      const {  ...cleanAttack } = attack;
      return cleanAttack;
   };

   const handleCleanObsoleteFields = async () => {
      const confirmed = window.confirm(
         [
            "Remover campos obsoletos de todos os adversários?",
            "",
            "Campos removidos:",
            "- instinct_die",
            "- natural_attack_die",
            "- natural_defense_die",
            "- main_attack.damage",
            "- secondary_attack.damage",
         ].join("\n")
      );

      if (!confirmed) return;

      try {
         const snapshot = await getDocs(collection(db, "enemies"));
         let cleanedCount = 0;

         for (const document of snapshot.docs) {
            const data = document.data();
            const hasObsoleteFields =
               Object.prototype.hasOwnProperty.call(data, "instinct_die") ||
               Object.prototype.hasOwnProperty.call(data, "natural_attack_die") ||
               Object.prototype.hasOwnProperty.call(data, "natural_defense_die") ||
               Object.prototype.hasOwnProperty.call(data?.main_attack || {}, "damage") ||
               Object.prototype.hasOwnProperty.call(data?.secondary_attack || {}, "damage");

            if (!hasObsoleteFields) continue;

            const updatePayload = {
               updated_at: serverTimestamp(),
            };

            if (Object.prototype.hasOwnProperty.call(data, "instinct_die")) {
               updatePayload.instinct_die = deleteField();
            }

            if (Object.prototype.hasOwnProperty.call(data, "natural_attack_die")) {
               updatePayload.natural_attack_die = deleteField();
            }

            if (Object.prototype.hasOwnProperty.call(data, "natural_defense_die")) {
               updatePayload.natural_defense_die = deleteField();
            }

            if (Object.prototype.hasOwnProperty.call(data?.main_attack || {}, "damage")) {
               updatePayload["main_attack.damage"] = deleteField();
            }

            if (Object.prototype.hasOwnProperty.call(data?.secondary_attack || {}, "damage")) {
               updatePayload["secondary_attack.damage"] = deleteField();
            }

            await updateDoc(doc(db, "enemies", document.id), updatePayload);

            cleanedCount += 1;
         }

         setEnemies((current) =>
            current.map(({ ...enemy }) => ({
               ...enemy,
               main_attack: removeAttackDamage(enemy.main_attack),
               secondary_attack: removeAttackDamage(enemy.secondary_attack),
            }))
         );

         alert(`${cleanedCount} adversário(s) limpo(s).`);
      } catch (error) {
         console.error("Erro ao limpar campos obsoletos:", error);
         alert("Erro ao limpar campos obsoletos.");
      }
   };

   const handleUpdateEnemiesFromJson = async (jsonText) => {
      try {
         const parsedEnemies = getEnemiesFromJson(jsonText);
         const enemiesById = new Map(enemies.map((enemy) => [enemy.id, enemy]));
         const enemiesByName = new Map(enemies.map((enemy) => [normalizeText(enemy.name), enemy]));
         const updatedEnemies = [];
         const notFoundEnemies = [];

         for (const enemy of parsedEnemies) {
            const existingEnemy = enemy.id ? enemiesById.get(enemy.id) : enemiesByName.get(normalizeText(enemy.name));

            if (!existingEnemy?.id) {
               notFoundEnemies.push(enemy.name || enemy.id || "Adversário sem nome");
               continue;
            }

            const normalizedEnemy = normalizeEnemy(mergeEnemyForUpdate(existingEnemy, enemy));

            await updateDoc(doc(db, "enemies", existingEnemy.id), {
               ...normalizedEnemy,
               updated_at: serverTimestamp(),
            });

            updatedEnemies.push({ id: existingEnemy.id, ...normalizedEnemy });
         }

         setEnemies((current) =>
            current.map((currentEnemy) => {
               const updatedEnemy = updatedEnemies.find((enemy) => enemy.id === currentEnemy.id);
               return updatedEnemy || currentEnemy;
            })
         );

         setModal(null);

         const notFoundMessage = notFoundEnemies.length ? `\nNão encontrados: ${notFoundEnemies.join(", ")}` : "";
         alert(`${updatedEnemies.length} adversário(s) atualizado(s).${notFoundMessage}`);
      } catch (error) {
         console.error("Erro ao atualizar adversários em bloco:", error);
         alert("JSON inválido ou erro ao atualizar adversários.");
      }
   };

   return (
      <div className="grid grid-cols-1 gap-8 pb-2 lg:grid-cols-[0.85fr_1.45fr] lg:gap-12">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <EnemyFormModal key={modal.enemy?.id || "new-enemy"} enemy={modal.enemy} onSubmit={handleSaveEnemy} />
            ) : null}

            {modal?.type === "bulk-json" ? (
               <BulkEnemyJsonModal onCreate={handleCreateEnemiesFromJson} onUpdate={handleUpdateEnemiesFromJson} />
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
               onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Importar adversários por JSON" })}
               onCleanObsoleteFields={handleCleanObsoleteFields}
            />
         </MobileFilterDrawer>

         <Table
            enemies={filteredEnemies}
            selectedEnemyId={activeEnemyId}
            onSelectEnemy={handleSelectEnemy}
            onEditEnemy={handleEditEnemy}
            onDeleteEnemy={handleDeleteEnemy}
            onMarkEnemyAsKnown={handleMarkEnemyAsKnown}
            knownEnemyIds={knownEnemyIds}
            markingKnownId={markingKnownId}
            hasSelectedCharacter={Boolean(selectedCharacter?.id)}
            onOpenFormModal={handleOpenCreateModal}
            onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Importar adversários por JSON" })}
            onCleanObsoleteFields={handleCleanObsoleteFields}
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
