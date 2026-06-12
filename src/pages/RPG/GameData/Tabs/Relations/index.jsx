import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import Side from "./Side";
import Table from "./Table";
import RelationFormModal from "./RelationFormModal";
import { getCharacterUserId, getFilteredAndSortedRelations, getRelatedCharacters } from "./helpers";

const RelationsTab = ({ selectedCharacter }) => {
   const [characters, setCharacters] = useState([]);
   const [selectedRelationId, setSelectedRelationId] = useState("");
   const [expandedRelationId, setExpandedRelationId] = useState("");
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

   useEffect(() => {
      const firstRelation = filteredRelations[0];
      setSelectedRelationId(firstRelation?.id || "");
      setExpandedRelationId(firstRelation?.id || "");
   }, [selectedCharacter?.id, search, typeFilter, relationFilter, sort, filteredRelations.length]);

   const handleSelectRelation = (relation) => {
      setSelectedRelationId(relation.id);
   };

   const handleEditRelation = (relation) => {
      setModal({ type: "form", title: relation.name || "Editar Relação", relation });
   };

   const handleSaveRelation = async (relation) => {
      if (!relation?.id) return;

      try {
         await updateDoc(doc(db, "characters", relation.id), {
            tipo: relation.tipo || "",
            relacao: relation.relacao || "Conhecido",
            confianca: Number(relation.confianca || 0),
            amizade: Number(relation.amizade || 0),
            caracteristicas: relation.caracteristicas || "",
            personalidade: relation.personalidade || "",
            detalhes: relation.detalhes || "",
            updated_at: serverTimestamp(),
         });

         setCharacters((current) => current.map((character) => character.id === relation.id ? { ...character, ...relation } : character));
         setModal(null);
      } catch (error) {
         console.error("Erro ao salvar relação:", error);
      }
   };

   return (
      <div className="grid grid-cols-[1.25fr_1fr] gap-12 pb-2">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <RelationFormModal key={modal.relation?.id} relation={modal.relation} onSubmit={handleSaveRelation} />
            ) : null}
         </Modal>

         <Table
            relations={filteredRelations}
            expandedRelationId={expandedRelationId}
            setExpandedRelationId={setExpandedRelationId}
            onSelectRelation={handleSelectRelation}
            onEditRelation={handleEditRelation}
         />

         <div className="sticky top-0 self-start">
            <Side
               selectedRelation={selectedRelation}
               search={search}
               typeFilter={typeFilter}
               relationFilter={relationFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setRelationFilter={setRelationFilter}
               setSort={setSort}
            />
         </div>

         {isLoading ? (
            <div className="col-span-2 text-center text-xs text-purple-100/50">Carregando relações...</div>
         ) : null}
      </div>
   );
};

export default RelationsTab;
