import { useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import MobileFilterDrawer from "../../Shared/MobileFilterDrawer";
import Side from "./Side";
import Table from "./Table";
import MagicObjectsFilters from "./MagicObjectsFilters";
import MagicObjectFormModal from "./MagicObjectFormModal";
import MagicObjectJsonModal from "./MagicObjectJsonModal";
import { getFilteredAndSortedMagicObjects, normalizeMagicObject } from "./helpers";

const MagicObjectsTab = () => {
   const [objects, setObjects] = useState([]);
   const [selectedObjectId, setSelectedObjectId] = useState("");
   const [search, setSearch] = useState("");
   const [locationFilter, setLocationFilter] = useState("Todos");
   const [typeFilter, setTypeFilter] = useState("Todos");
   const [effectTypeFilter, setEffectTypeFilter] = useState("Todos");
   const [sort, setSort] = useState("name-asc");
   const [modal, setModal] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const detailsRef = useRef(null);

   const filteredObjects = useMemo(() => getFilteredAndSortedMagicObjects({ objects, search, locationFilter, typeFilter, effectTypeFilter, sort }), [objects, search, locationFilter, typeFilter, effectTypeFilter, sort]);
   const selectedObject = useMemo(() => filteredObjects.find((object) => object.id === selectedObjectId) || filteredObjects[0] || null, [filteredObjects, selectedObjectId]);
   const activeObjectId = selectedObject?.id || "";

   useEffect(() => {
      const loadObjects = async () => {
         setIsLoading(true);
         try {
            const snapshot = await getDocs(collection(db, "objects"));
            setObjects(snapshot.docs.map((document) => ({ id: document.id, ...normalizeMagicObject(document.data()) })));
         } catch (error) {
            console.error("Erro ao carregar objetos mágicos:", error);
         } finally {
            setIsLoading(false);
         }
      };
      loadObjects();
   }, []);

   const handleSelectObject = (object) => {
      setSelectedObjectId(object.id);
      if (window.innerWidth < 1024) setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
   };

   const handleSaveObject = async (object) => {
      const normalizedObject = normalizeMagicObject(object);
      try {
         if (object?.id) {
            await updateDoc(doc(db, "objects", object.id), { ...normalizedObject, updated_at: serverTimestamp() });
            setObjects((current) => current.map((currentObject) => currentObject.id === object.id ? { ...currentObject, ...normalizedObject } : currentObject));
         } else {
            const newObject = { ...normalizedObject, created_at: serverTimestamp(), updated_at: serverTimestamp() };
            const documentRef = await addDoc(collection(db, "objects"), newObject);
            setObjects((current) => [...current, { id: documentRef.id, ...newObject }]);
            setSelectedObjectId(documentRef.id);
         }
         setModal(null);
      } catch (error) {
         console.error("Erro ao salvar objeto mágico:", error);
      }
   };


   const handleSaveJsonObject = async (jsonObject) => {
      const { id: rawId, ...jsonData } = jsonObject;
      const objectId = String(rawId || "").trim();
      const normalizedObject = normalizeMagicObject(jsonData);
      const objectToSave = { ...jsonData, ...normalizedObject, updated_at: serverTimestamp() };

      try {
         if (objectId) {
            const documentRef = doc(db, "objects", objectId);
            const snapshot = await getDoc(documentRef);

            if (snapshot.exists()) {
               await updateDoc(documentRef, objectToSave);
            } else {
               await setDoc(documentRef, { ...objectToSave, created_at: serverTimestamp() });
            }

            setObjects((current) => {
               const existsLocally = current.some((currentObject) => currentObject.id === objectId);
               if (existsLocally) {
                  return current.map((currentObject) => currentObject.id === objectId ? { ...currentObject, ...normalizedObject, id: objectId } : currentObject);
               }
               return [...current, { id: objectId, ...normalizedObject }];
            });
            setSelectedObjectId(objectId);
         } else {
            const documentRef = await addDoc(collection(db, "objects"), {
               ...objectToSave,
               created_at: serverTimestamp(),
            });
            setObjects((current) => [...current, { id: documentRef.id, ...normalizedObject }]);
            setSelectedObjectId(documentRef.id);
         }

         setModal(null);
      } catch (error) {
         console.error("Erro ao salvar objeto mágico por JSON:", error);
         throw new Error("Erro ao salvar no Firestore. Confira as permissões e tente novamente.");
      }
   };

   const handleDeleteObject = async (object) => {
      if (!object?.id || !window.confirm(`Excluir ${object.name || "este objeto mágico"}?`)) return;
      try {
         await deleteDoc(doc(db, "objects", object.id));
         setObjects((current) => current.filter((currentObject) => currentObject.id !== object.id));
         if (selectedObjectId === object.id) setSelectedObjectId("");
      } catch (error) {
         console.error("Erro ao excluir objeto mágico:", error);
      }
   };

   const openCreateModal = () => setModal({ type: "form", title: "Novo objeto mágico", object: null });
   const openEditModal = (object) => setModal({ type: "form", title: object.name || "Editar objeto mágico", object });
   const openJsonModal = () => setModal({ type: "json", title: "Adicionar ou atualizar por JSON" });

   return (
      <div className="grid grid-cols-1 gap-8 pb-2 lg:grid-cols-[0.85fr_1.45fr] lg:gap-12">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "json" ? (
               <MagicObjectJsonModal onSubmit={handleSaveJsonObject} />
            ) : (
               <MagicObjectFormModal key={modal?.object?.id || "new-magic-object"} object={modal?.object} onSubmit={handleSaveObject} />
            )}
         </Modal>

         <MobileFilterDrawer title="Filtros de Objetos Mágicos">
            <MagicObjectsFilters search={search} locationFilter={locationFilter} typeFilter={typeFilter} effectTypeFilter={effectTypeFilter} sort={sort} setSearch={setSearch} setLocationFilter={setLocationFilter} setTypeFilter={setTypeFilter} setEffectTypeFilter={setEffectTypeFilter} setSort={setSort} objects={objects} onOpenFormModal={openCreateModal} onOpenJsonModal={openJsonModal} />
         </MobileFilterDrawer>

         <Table objects={filteredObjects} selectedObjectId={activeObjectId} onSelectObject={handleSelectObject} onEditObject={openEditModal} onDeleteObject={handleDeleteObject} search={search} locationFilter={locationFilter} typeFilter={typeFilter} effectTypeFilter={effectTypeFilter} sort={sort} setSearch={setSearch} setLocationFilter={setLocationFilter} setTypeFilter={setTypeFilter} setEffectTypeFilter={setEffectTypeFilter} setSort={setSort} allObjects={objects} onOpenFormModal={openCreateModal} onOpenJsonModal={openJsonModal} />

         <div className="lg:sticky lg:top-0 lg:self-start" ref={detailsRef}>
            <Side selectedObject={selectedObject} />
         </div>

         {isLoading ? <div className="text-center text-xs text-purple-100/50 lg:col-span-2">Carregando objetos mágicos...</div> : null}
      </div>
   );
};

export default MagicObjectsTab;
