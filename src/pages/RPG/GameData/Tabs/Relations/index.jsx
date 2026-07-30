import { useEffect, useMemo, useRef, useState } from "react";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import Side from "./Side";
import Table from "./Table";
import RelationsFilters from "./RelationsFilters";
import MobileFilterDrawer from "../../Shared/MobileFilterDrawer";
import RelationFormModal from "./RelationFormModal";
import BulkNpcJsonModal from "./BulkNpcJsonModal";
import CopyRelationsModal from "./CopyRelationsModal";
import CustomSelect from "../../../../../components/CustomSelect";
import { getCharacterUserId, getFilteredAndSortedRelations, getRelatedCharacters, isNpc } from "./helpers";

// Prop `characters` (estado local, a lista de NPCs) não deve ser
// confundida com o `setCharacters` do personagem do jogador (vem de
// CharacterSheet/tabs_json.js, igual pras outras abas) — usado só pra
// marcar um NPC como adversário conhecido, ver handleMarkNpcAsKnown.
const RelationsTab = ({ selectedCharacter, setCharacters: setPlayerCharacters }) => {
   const [characters, setCharacters] = useState([]);
   const [selectedRelationId, setSelectedRelationId] = useState("");
   const [search, setSearch] = useState("");
   const [typeFilter, setTypeFilter] = useState("Todos");
   const [relationFilter, setRelationFilter] = useState("Todos");
   const [yearFilter, setYearFilter] = useState("Todos");
   const [studentYearFilter, setStudentYearFilter] = useState("Todos");
   const [sort, setSort] = useState("name-asc");
   const [modal, setModal] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [selectedNpcId, setSelectedNpcId] = useState("");
   const [isLinkingNpc, setIsLinkingNpc] = useState(false);
   const [isMigrating, setIsMigrating] = useState(false);
   const [markingKnownId, setMarkingKnownId] = useState("");

   const detailsRef = useRef(null);

   const knownAdversaryNpcIds = useMemo(() => {
      const known = selectedCharacter?.adversarios_conhecidos || [];
      return new Set(known.filter((item) => item.tipo === "npc").map((item) => item.id));
   }, [selectedCharacter]);

   const relatedCharacters = useMemo(() => {
      return getRelatedCharacters({ characters, selectedCharacter });
   }, [characters, selectedCharacter]);

   const filteredRelations = useMemo(() => {
      return getFilteredAndSortedRelations({
         characters: relatedCharacters,
         search,
         typeFilter,
         relationFilter,
         yearFilter,
         studentYearFilter,
         sort,
      });
   }, [relatedCharacters, search, typeFilter, relationFilter, yearFilter, studentYearFilter, sort]);

   const selectedRelation = useMemo(() => {
      return filteredRelations.find((relation) => relation.id === selectedRelationId) || filteredRelations[0] || null;
   }, [filteredRelations, selectedRelationId]);

   const activeRelationId = selectedRelation?.id || "";

   const handleSelectRelation = (relation) => {
      setSelectedRelationId(relation.id);

      if (window.innerWidth < 1024) {
         setTimeout(() => {
            detailsRef.current?.scrollIntoView({
               behavior: "smooth",
               block: "start",
            });
         }, 100);
      }
   };

   useEffect(() => {
      const loadRelations = async () => {
         const userId = getCharacterUserId(selectedCharacter);
         if (!userId) return;

         setIsLoading(true);

         try {
            const snapshot = await getDocs(collection(db, "npcs"));

            setCharacters(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
         } catch (error) {
            console.error("Erro ao carregar relações:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadRelations();
   }, [selectedCharacter]);

   const availableNpcOptions = useMemo(() => {
      const relatedIds = new Set(relatedCharacters.map((npc) => npc.id));

      return characters
         .filter((npc) => isNpc(npc) && !relatedIds.has(npc.id))
         .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
         .map((npc) => ({
            value: npc.id,
            label: npc.name || "NPC sem nome",
         }));
   }, [characters, relatedCharacters]);

   const handleLinkExistingNpc = async () => {
      if (!selectedNpcId || !selectedCharacter?.id) return;

      const userId = getCharacterUserId(selectedCharacter);
      const npc = characters.find((item) => item.id === selectedNpcId);
      if (!npc) return;

      const currentRelatedIds = Array.isArray(npc.relacionado)
         ? npc.relacionado
         : npc.relacionado
           ? [npc.relacionado]
           : [];

      const relacionado = Array.from(new Set([...currentRelatedIds, selectedCharacter.id]));

      setIsLinkingNpc(true);

      try {
         await updateDoc(doc(db, "npcs", npc.id), {
            relacionado,
            user_id: userId,
            updated_at: serverTimestamp(),
         });

         setCharacters((current) =>
            current.map((item) =>
               item.id === npc.id ? { ...item, relacionado, user_id: userId } : item
            )
         );
         setSelectedRelationId(npc.id);
         setSelectedNpcId("");
      } catch (error) {
         console.error("Erro ao vincular NPC existente:", error);
         alert("Não foi possível adicionar o NPC à relação.");
      } finally {
         setIsLinkingNpc(false);
      }
   };

   const handleMigrateLegacyRelations = async () => {
      const userId = getCharacterUserId(selectedCharacter);
      if (!userId || !selectedCharacter?.id) return;

      const legacyNpcs = characters.filter((npc) => {
         if (!isNpc(npc) || npc.user_id !== userId) return false;

         const relatedIds = Array.isArray(npc.relacionado)
            ? npc.relacionado
            : npc.relacionado
              ? [npc.relacionado]
              : [];

         return !relatedIds.includes(selectedCharacter.id);
      });

      if (!legacyNpcs.length) {
         alert("Nenhuma relação antiga precisa ser migrada para este personagem.");
         return;
      }

      const confirmed = window.confirm(
         `Migrar ${legacyNpcs.length} NPC(s) antigos para o personagem ${selectedCharacter.name || "selecionado"}?`
      );
      if (!confirmed) return;

      setIsMigrating(true);

      try {
         const migratedById = new Map();

         await Promise.all(legacyNpcs.map(async (npc) => {
            const currentRelatedIds = Array.isArray(npc.relacionado)
               ? npc.relacionado
               : npc.relacionado
                 ? [npc.relacionado]
                 : [];
            const relacionado = Array.from(new Set([...currentRelatedIds, selectedCharacter.id]));

            await updateDoc(doc(db, "npcs", npc.id), {
               relacionado,
               user_id: userId,
               updated_at: serverTimestamp(),
            });

            migratedById.set(npc.id, relacionado);
         }));

         setCharacters((current) =>
            current.map((npc) =>
               migratedById.has(npc.id)
                  ? { ...npc, relacionado: migratedById.get(npc.id), user_id: userId }
                  : npc
            )
         );

         alert(`${legacyNpcs.length} relação(ões) migrada(s) com sucesso.`);
      } catch (error) {
         console.error("Erro ao migrar relações antigas:", error);
         alert("Ocorreu um erro durante a migração das relações.");
      } finally {
         setIsMigrating(false);
      }
   };

   const handleEditRelation = (relation) => {
      setModal({ type: "form", title: relation.name || "Editar Relação", relation });
   };

   const handleDeleteRelation = async (relation) => {
      if (!relation?.id) return;

      const confirmed = window.confirm(`Excluir ${relation.name || "este NPC"}?`);
      if (!confirmed) return;

      try {
         await deleteDoc(doc(db, "npcs", relation.id));

         setCharacters((current) => current.filter((character) => character.id !== relation.id));

         if (selectedRelationId === relation.id) {
            setSelectedRelationId("");
         }
      } catch (error) {
         console.error("Erro ao excluir relação:", error);
      }
   };

   // Marca este NPC como adversário conhecido/enfrentado pelo personagem
   // selecionado — mesma key usada pelo potter-pg (app do jogador) pra
   // filtrar a aba "Adversários" dele: `adversarios_conhecidos`, um
   // array de `{ id, tipo }` (tipo "npc" aqui, "enemy" na aba Enemies).
   // Um NPC pode virar adversário sem deixar de ser NPC (ex: um "amigo"
   // que se revela hostil) — por isso não mexe em `relacionado`.
   const handleMarkNpcAsKnown = async (npc) => {
      if (!selectedCharacter?.id || !npc?.id) return;

      const entry = { id: npc.id, tipo: "npc" };

      setMarkingKnownId(npc.id);

      try {
         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            adversarios_conhecidos: arrayUnion(entry),
            updated_at: serverTimestamp(),
         });

         setPlayerCharacters?.((players) =>
            players.map((player) => {
               if (player.id !== selectedCharacter.id) return player;

               const current = player.adversarios_conhecidos || [];
               if (current.some((item) => item.id === entry.id && item.tipo === entry.tipo)) return player;

               return { ...player, adversarios_conhecidos: [...current, entry] };
            })
         );
      } catch (error) {
         console.error("Erro ao marcar NPC como adversário conhecido:", error);
         alert("Não foi possível marcar este NPC como adversário conhecido.");
      } finally {
         setMarkingKnownId("");
      }
   };

   const handleSaveRelation = async (relation) => {
      if (!relation?.id) return;

      try {
         await updateDoc(doc(db, "npcs", relation.id), {
            image_url: relation.image_url || "",
            tipo: relation.tipo || "",
            relacao: relation.relacao || "Conhecido",
            ano: Number(relation.ano || relation.year || 1),
            year: Number(relation.year || relation.ano || 1),
            student_year: relation.student_year === "" ? "" : Number(relation.student_year || 0),
            confianca: Number(relation.confianca || 0),
            amizade: Number(relation.amizade || 0),
            caracteristicas: relation.caracteristicas || "",
            personalidade: relation.personalidade || "",
            detalhes: relation.detalhes || "",
            atributos: relation.atributos || {},
            updated_at: serverTimestamp(),
         });

         setCharacters((current) =>
            current.map((character) => character.id === relation.id ? { ...character, ...relation } : character)
         );

         setModal(null);
      } catch (error) {
         console.error("Erro ao salvar relação:", error);
      }
   };

   const handleCreateRelationsFromJson = async (jsonText) => {
      const userId = getCharacterUserId(selectedCharacter);
      if (!userId) return;

      const defaultAttributes = {
         Agilidade: 0,
         "Aprendizado Mágico": 0,
         Astucia: 0,
         Ataque: 0,
         Carisma: 0,
         Controle: 0,
         Coragem: 0,
         Equilibrio: 0,
         Inteligência: 0,
         Liderança: 0,
         Magia: 0,
         "Magia Antiga": 0,
         Percepção: 0,
         Persuasão: 0,
         Precisão: 0,
         Proteção: 0,
         Resistência: 0,
         Sorte: 0,
      };

      try {
         const parsed = JSON.parse(jsonText);
         const npcs = Array.isArray(parsed) ? parsed : parsed.npcs || [];

         const createdNpcs = [];

         for (const npc of npcs) {
            const newNpc = {
               name: npc.name || npc.nome || "",
               character_type: "npc",
               tipo: npc.tipo || npc.type || "Aluno",
               relacao: npc.relacao || npc.relation || "Conhecido",
               relacionado: [selectedCharacter.id],
               user_id: userId,

               ano: Number(npc.ano || npc.year || 1),
               year: Number(npc.year || npc.ano || 1),
               student_year: npc.student_year === "" ? "" : Number(npc.student_year || npc.studentYear || 0),
               casa: npc.casa || npc.house || "",
               image_url: npc.image_url || npc.image || "",

               amizade: Number(npc.amizade || 0),
               confianca: Number(npc.confianca || 0),

               caracteristicas: npc.caracteristicas || npc.physical_traits || "",
               personalidade: npc.personalidade || npc.personality || "",
               detalhes: npc.detalhes || npc.description || "",

               atributos: {
                  ...defaultAttributes,
                  ...(npc.atributos || {}),
               },

               habilidades: npc.habilidades || {},
               pocoes: npc.pocoes || {},

               created_at: serverTimestamp(),
               updated_at: serverTimestamp(),
            };

            const documentRef = await addDoc(collection(db, "npcs"), newNpc);

            createdNpcs.push({
               id: documentRef.id,
               ...newNpc,
            });
         }

         setCharacters((current) => [...current, ...createdNpcs]);
         setModal(null);
      } catch (error) {
         console.error("Erro ao cadastrar NPCs em bloco:", error);
         alert("JSON inválido ou erro ao cadastrar NPCs.");
      }
   };

   return (
      <div className="grid grid-cols-1 gap-8 pb-2 lg:grid-cols-[0.85fr_1.45fr] lg:gap-12">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <RelationFormModal key={modal.relation?.id} relation={modal.relation} onSubmit={handleSaveRelation} />
            ) : null}

            {modal?.type === "bulk-json" ? (
               <BulkNpcJsonModal onSubmit={handleCreateRelationsFromJson} />
            ) : null}

            {modal?.type === "copy" ? (
               <CopyRelationsModal relations={relatedCharacters} />
            ) : null}
         </Modal>


         <div className="lg:col-span-2 border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
               <div className="min-w-0 flex-1">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-yellow-400/80">
                     Adicionar NPC existente
                  </p>
                  <CustomSelect
                     value={selectedNpcId}
                     options={availableNpcOptions}
                     onChange={setSelectedNpcId}
                     placeholder={availableNpcOptions.length ? "Selecione um NPC" : "Todos os NPCs já estão relacionados"}
                  />
               </div>

               <button
                  type="button"
                  onClick={handleLinkExistingNpc}
                  disabled={!selectedNpcId || isLinkingNpc}
                  className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
               >
                  {isLinkingNpc ? "Adicionando..." : "Adicionar relação"}
               </button>

               <button
                  type="button"
                  onClick={handleMigrateLegacyRelations}
                  disabled={isMigrating || isLoading}
                  className="border border-yellow-400/30 px-4 py-2 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-40"
               >
                  {isMigrating ? "Migrando..." : "Migrar relações antigas"}
               </button>
            </div>

            <p className="mt-3 text-[11px] text-purple-100/45">
               A migração converte vínculos antigos para o array de IDs e associa os NPCs deste usuário ao personagem atual.
            </p>
         </div>

         <MobileFilterDrawer title="Filtros de Relações">
            <RelationsFilters
               search={search}
               typeFilter={typeFilter}
               relationFilter={relationFilter}
               yearFilter={yearFilter}
               studentYearFilter={studentYearFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setRelationFilter={setRelationFilter}
               setYearFilter={setYearFilter}
               setStudentYearFilter={setStudentYearFilter}
               setSort={setSort}
               relations={relatedCharacters}
               onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Cadastrar NPCs por JSON" })}
               onOpenCopyModal={() => setModal({ type: "copy", title: "Copiar NPCs por ano de campanha" })}
            />
         </MobileFilterDrawer>

         <Table
            relations={filteredRelations}
            selectedRelationId={activeRelationId}
            onSelectRelation={handleSelectRelation}
            onEditRelation={handleEditRelation}
            onDeleteRelation={handleDeleteRelation}
            onMarkNpcAsKnown={handleMarkNpcAsKnown}
            knownAdversaryNpcIds={knownAdversaryNpcIds}
            markingKnownId={markingKnownId}
            hasSelectedCharacter={Boolean(selectedCharacter?.id)}
            onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Cadastrar NPCs por JSON" })}
            onOpenCopyModal={() => setModal({ type: "copy", title: "Copiar NPCs por ano de campanha" })}
            search={search}
            typeFilter={typeFilter}
            relationFilter={relationFilter}
            yearFilter={yearFilter}
            studentYearFilter={studentYearFilter}
            sort={sort}
            setSearch={setSearch}
            setTypeFilter={setTypeFilter}
            setRelationFilter={setRelationFilter}
            setYearFilter={setYearFilter}
            setStudentYearFilter={setStudentYearFilter}
            setSort={setSort}
            allRelations={relatedCharacters}
         />

         <div className="lg:sticky lg:top-0 lg:self-start" ref={detailsRef}>
            <Side selectedRelation={selectedRelation} />
         </div>

         {isLoading ? (
            <div className="lg:col-span-2 text-center text-xs text-purple-100/50">Carregando relações...</div>
         ) : null}
      </div>
   );
};

export default RelationsTab;