import { useEffect, useMemo, useRef, useState } from "react";
import {
   addDoc,
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
import MobileFilterDrawer from "../../Shared/MobileFilterDrawer";
import BulkLocationJsonModal from "./BulkLocationJsonModal";
import LocationFormModal from "./LocationFormModal";
import LocationsFilters from "./LocationsFilters";
import Side from "./Side";
import Table from "./Table";
import {
   getCharacterUserId,
   getFilteredAndSortedLocations,
   normalizeLocationPayload,
} from "./helpers";

const LocationsTab = ({ selectedCharacter }) => {
   const [locations, setLocations] = useState([]);
   const [characters, setCharacters] = useState([]);
   const [selectedLocationId, setSelectedLocationId] = useState("");
   const [search, setSearch] = useState("");
   const [typeFilter, setTypeFilter] = useState("Todos");
   const [accessFilter, setAccessFilter] = useState("Todos");
   const [sort, setSort] = useState("name-asc");
   const [modal, setModal] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const detailsRef = useRef(null);

   const filteredLocations = useMemo(() => {
      return getFilteredAndSortedLocations({
         locations,
         search,
         typeFilter,
         accessFilter,
         sort,
         characters,
      });
   }, [locations, search, typeFilter, accessFilter, sort, characters]);

   const selectedLocation = useMemo(() => {
      return filteredLocations.find((location) => location.id === selectedLocationId) || filteredLocations[0] || null;
   }, [filteredLocations, selectedLocationId]);

   const activeLocationId = selectedLocation?.id || "";

   const handleSelectLocation = (location) => {
      setSelectedLocationId(location.id);

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
      const loadData = async () => {
         const userId = getCharacterUserId(selectedCharacter);
         if (!userId) return;

         setIsLoading(true);

         try {
            const charactersRef = collection(db, "characters");
            const charactersQuery = query(charactersRef, where("user_id", "==", userId));
            const charactersSnapshot = await getDocs(charactersQuery);

            setCharacters(charactersSnapshot.docs.map((document) => ({ id: document.id, ...document.data() })));

            const locationsRef = collection(db, "locations");
            const locationsQuery = query(locationsRef, where("user_id", "==", userId));
            const locationsSnapshot = await getDocs(locationsQuery);

            setLocations(locationsSnapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
         } catch (error) {
            console.error("Erro ao carregar locais:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadData();
   }, [selectedCharacter]);

   const handleOpenCreateModal = () => {
      setModal({ type: "form", title: "Cadastrar local", location: null });
   };

   const handleEditLocation = (location) => {
      setModal({ type: "form", title: location.name || "Editar local", location });
   };

   const handleDeleteLocation = async (location) => {
      if (!location?.id) return;

      const confirmed = window.confirm(`Excluir ${location.name || "este local"}?`);
      if (!confirmed) return;

      try {
         await deleteDoc(doc(db, "locations", location.id));

         setLocations((current) => current.filter((item) => item.id !== location.id));

         if (selectedLocationId === location.id) {
            setSelectedLocationId("");
         }
      } catch (error) {
         console.error("Erro ao excluir local:", error);
      }
   };

   const handleSaveLocation = async (location) => {
      const userId = getCharacterUserId(selectedCharacter);
      if (!userId) return;

      const payload = {
         ...normalizeLocationPayload({ location, selectedCharacter, userId }),
         updated_at: serverTimestamp(),
      };

      try {
         if (location?.id) {
            await updateDoc(doc(db, "locations", location.id), payload);

            setLocations((current) =>
               current.map((item) => item.id === location.id ? { ...item, ...payload } : item)
            );
         } else {
            const newLocation = {
               ...payload,
               created_at: serverTimestamp(),
            };

            const documentRef = await addDoc(collection(db, "locations"), newLocation);

            setLocations((current) => [
               ...current,
               {
                  id: documentRef.id,
                  ...newLocation,
               },
            ]);
            setSelectedLocationId(documentRef.id);
         }

         setModal(null);
      } catch (error) {
         console.error("Erro ao salvar local:", error);
      }
   };

   const handleCreateLocationsFromJson = async (jsonText) => {
      const userId = getCharacterUserId(selectedCharacter);
      if (!userId) return;

      try {
         const parsed = JSON.parse(jsonText);
         const parsedLocations = Array.isArray(parsed) ? parsed : parsed.locations || [];
         const createdLocations = [];

         for (const location of parsedLocations) {
            const newLocation = {
               ...normalizeLocationPayload({ location, selectedCharacter, userId }),
               created_at: serverTimestamp(),
               updated_at: serverTimestamp(),
            };

            const documentRef = await addDoc(collection(db, "locations"), newLocation);

            createdLocations.push({
               id: documentRef.id,
               ...newLocation,
            });
         }

         setLocations((current) => [...current, ...createdLocations]);
         setModal(null);
      } catch (error) {
         console.error("Erro ao cadastrar locais em bloco:", error);
         alert("JSON inválido ou erro ao cadastrar locais.");
      }
   };

   return (
      <div className="grid grid-cols-1 gap-8 pb-2 lg:grid-cols-[0.85fr_1.45fr] lg:gap-12">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <LocationFormModal
                  key={modal.location?.id || "new-location"}
                  location={modal.location}
                  characters={characters}
                  onSubmit={handleSaveLocation}
               />
            ) : null}

            {modal?.type === "bulk-json" ? (
               <BulkLocationJsonModal onSubmit={handleCreateLocationsFromJson} />
            ) : null}
         </Modal>

         <MobileFilterDrawer title="Filtros de Locais">
            <LocationsFilters
               search={search}
               typeFilter={typeFilter}
               accessFilter={accessFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setAccessFilter={setAccessFilter}
               setSort={setSort}
               locations={locations}
               characters={characters}
               onOpenCreateModal={handleOpenCreateModal}
               onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Cadastrar locais por JSON" })}
            />
         </MobileFilterDrawer>

         <Table
            locations={filteredLocations}
            selectedLocationId={activeLocationId}
            onSelectLocation={handleSelectLocation}
            onEditLocation={handleEditLocation}
            onDeleteLocation={handleDeleteLocation}
            search={search}
            typeFilter={typeFilter}
            accessFilter={accessFilter}
            sort={sort}
            setSearch={setSearch}
            setTypeFilter={setTypeFilter}
            setAccessFilter={setAccessFilter}
            setSort={setSort}
            allLocations={locations}
            characters={characters}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenBulkJsonModal={() => setModal({ type: "bulk-json", title: "Cadastrar locais por JSON" })}
         />

         <div className="lg:sticky lg:top-0 lg:self-start" ref={detailsRef}>
            <Side selectedLocation={selectedLocation} characters={characters} />
         </div>

         {isLoading ? (
            <div className="text-center text-xs text-purple-100/50 lg:col-span-2">Carregando locais...</div>
         ) : null}
      </div>
   );
};

export default LocationsTab;
