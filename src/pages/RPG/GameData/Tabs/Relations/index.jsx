import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import Side from "./Side";
import Table from "./Table";
import RelationFormModal from "./RelationFormModal";
import BulkNpcJsonModal from "./BulkNpcJsonModal";
import { getCharacterUserId, getFilteredAndSortedRelations, getRelatedCharacters } from "./helpers";

const RelationsTab = ({ selectedCharacter }) => {
   const [characters, setCharacters] = useState([]);
   const [selectedRelationId, setSelectedRelationId] = useState("");
   const [search, setSearch] = useState("");
   const [typeFilter, setTypeFilter] = useState("Todos");
   const [relationFilter, setRelationFilter] = useState("Todos");
   const [sort, setSort] = useState("name-asc");
   const [modal, setModal] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const relatedCharacters = useMemo(() => {
      return getRelatedCharacters({ characters, selectedCharacter });
   }, [characters, selectedCharacter]);

   const filteredRelations = useMemo(() => {
      return getFilteredAndSortedRelations({
         characters: relatedCharacters,
         search,
         typeFilter,
         relationFilter,
         sort,
      });
   }, [relatedCharacters, search, typeFilter, relationFilter, sort]);

   const selectedRelation = useMemo(() => {
      return filteredRelations.find((relation) => relation.id === selectedRelationId) || filteredRelations[0] || null;
   }, [filteredRelations, selectedRelationId]);

   const activeRelationId = selectedRelation?.id || "";

   useEffect(() => {
      const loadRelations = async () => {
         const userId = getCharacterUserId(selectedCharacter);
         if (!userId) return;

         setIsLoading(true);

         try {
            const charactersRef = collection(db, "characters");
            const charactersQuery = query(charactersRef, where("user_id", "==", userId));
            const snapshot = await getDocs(charactersQuery);

            setCharacters(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
         } catch (error) {
            console.error("Erro ao carregar relações:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadRelations();
   }, [selectedCharacter]);

   const handleSelectRelation = (relation) => {
      setSelectedRelationId(relation.id);
   };

   const handleEditRelation = (relation) => {
      setModal({ type: "form", title: relation.name || "Editar Relação", relation });
   };

   const handleDeleteRelation = async (relation) => {
      if (!relation?.id) return;

      const confirmed = window.confirm(`Excluir ${relation.name || "este NPC"}?`);
      if (!confirmed) return;

      try {
         await deleteDoc(doc(db, "characters", relation.id));

         setCharacters((current) => current.filter((character) => character.id !== relation.id));

         if (selectedRelationId === relation.id) {
            setSelectedRelationId("");
         }
      } catch (error) {
         console.error("Erro ao excluir relação:", error);
      }
   };

   const handleSaveRelation = async (relation) => {
      if (!relation?.id) return;

      try {
         await updateDoc(doc(db, "characters", relation.id), {
            image_url: relation.image_url || "",
            tipo: relation.tipo || "",
            relacao: relation.relacao || "Conhecido",
            confianca: Number(relation.confianca || 0),
            amizade: Number(relation.amizade || 0),
            caracteristicas: relation.caracteristicas || "",
            personalidade: relation.personalidade || "",
            detalhes: relation.detalhes || "",
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
               relacionado: selectedCharacter.id,
               user_id: userId,

               ano: Number(npc.ano || 1),
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

            const documentRef = await addDoc(collection(db, "characters"), newNpc);

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
      <div className="grid grid-cols-[0.85fr_1.45fr] gap-12 pb-2">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <RelationFormModal key={modal.relation?.id} relation={modal.relation} onSubmit={handleSaveRelation} />
            ) : null}
         </Modal>

         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <RelationFormModal key={modal.relation?.id} relation={modal.relation} onSubmit={handleSaveRelation} />
            ) : null}

            {modal?.type === "bulk-json" ? (
               <BulkNpcJsonModal onSubmit={handleCreateRelationsFromJson} />
            ) : null}
         </Modal>

         <Table
            relations={filteredRelations}
            selectedRelationId={activeRelationId}
            onSelectRelation={handleSelectRelation}
            onEditRelation={handleEditRelation}
            onDeleteRelation={handleDeleteRelation}
            onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Cadastrar NPCs por JSON" })}
            search={search}
            typeFilter={typeFilter}
            relationFilter={relationFilter}
            sort={sort}
            setSearch={setSearch}
            setTypeFilter={setTypeFilter}
            setRelationFilter={setRelationFilter}
            setSort={setSort}
            allRelations={relatedCharacters}
         />

         <div className="sticky top-0 self-start">
            <Side selectedRelation={selectedRelation} />
         </div>

         {isLoading ? (
            <div className="col-span-2 text-center text-xs text-purple-100/50">Carregando relações...</div>
         ) : null}
      </div>
   );
};

export default RelationsTab;