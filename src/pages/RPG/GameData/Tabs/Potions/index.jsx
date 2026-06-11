import { useEffect, useMemo, useRef, useState } from "react";
import {
   deleteField,
   doc,
   serverTimestamp,
   updateDoc,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import RulesPanel from "../../Shared/RulesPanel";
import Header from "./Header";
import Table from "./Table";
import potionRules from "./json-files/potionRules.json";
import {
   filterAvailablePotions,
   getCharacterPotions,
   getFilteredAndSortedPotions,
   getNextSortDirection,
   getPotionDisplayName,
   getPotionsList,
   getYears,
} from "./helpers";

const PotionsTab = ({ selectedCharacter, setCharacters }) => {
   const dropdownRef = useRef(null);
   const levelDropdownRef = useRef(null);

   const [potionSearch, setPotionSearch] = useState("");
   const [selectedPotion, setSelectedPotion] = useState(null);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [showRules, setShowRules] = useState(false);

   const [editingLevelPotionId, setEditingLevelPotionId] = useState("");
   const [xpDrafts, setXpDrafts] = useState({});
   const [levelDrafts, setLevelDrafts] = useState({});
   const [locationDrafts, setLocationDrafts] = useState({});
   const [savingPotionId, setSavingPotionId] = useState("");

   const [tableSearch, setTableSearch] = useState("");
   const [yearFilter, setYearFilter] = useState("");
   const [levelFilter, setLevelFilter] = useState("");
   const [locationFilter, setLocationFilter] = useState("");
   const [sortConfig, setSortConfig] = useState({
      key: "year",
      direction: "asc",
   });

   const potions = useMemo(() => getPotionsList(), []);

   const savedPotions = useMemo(() => {
      return selectedCharacter?.pocoes || {};
   }, [selectedCharacter]);

   const knownPotionIds = useMemo(() => Object.keys(savedPotions), [savedPotions]);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
         }

         if (
            levelDropdownRef.current &&
            !levelDropdownRef.current.contains(event.target)
         ) {
            setEditingLevelPotionId("");
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const availablePotions = useMemo(() => {
      return filterAvailablePotions({ potions, knownPotionIds, potionSearch });
   }, [potions, knownPotionIds, potionSearch]);

   const characterPotions = useMemo(() => {
      return getCharacterPotions({ knownPotionIds, savedPotions, potions });
   }, [knownPotionIds, savedPotions, potions]);

   const years = useMemo(() => getYears(characterPotions), [characterPotions]);

   const filteredAndSortedPotions = useMemo(() => {
      return getFilteredAndSortedPotions({
         rows: characterPotions,
         tableSearch,
         yearFilter,
         levelFilter,
         locationFilter,
         sortConfig,
      });
   }, [
      characterPotions,
      tableSearch,
      yearFilter,
      levelFilter,
      locationFilter,
      sortConfig,
   ]);

   const updateCharacterPotion = (potionId, potionData) => {
      setCharacters((currentCharacters) =>
         currentCharacters.map((character) => {
            if (character.id !== selectedCharacter.id) return character;

            return {
               ...character,
               pocoes: {
                  ...(character.pocoes || {}),
                  [potionId]: potionData,
               },
            };
         })
      );
   };

   const clearDrafts = (potionId) => {
      setXpDrafts((currentDrafts) => {
         const nextDrafts = { ...currentDrafts };
         delete nextDrafts[potionId];
         return nextDrafts;
      });

      setLevelDrafts((currentDrafts) => {
         const nextDrafts = { ...currentDrafts };
         delete nextDrafts[potionId];
         return nextDrafts;
      });

      setLocationDrafts((currentDrafts) => {
         const nextDrafts = { ...currentDrafts };
         delete nextDrafts[potionId];
         return nextDrafts;
      });
   };

   const handleSort = (key) => {
      setSortConfig((currentSort) => ({
         key,
         direction: getNextSortDirection(currentSort, key),
      }));
   };

   const renderSortIcon = (key) => {
      if (sortConfig.key !== key) return "↕";
      return sortConfig.direction === "asc" ? "↑" : "↓";
   };

   const handleSearchChange = (event) => {
      setPotionSearch(event.target.value);
      setSelectedPotion(null);
      setIsDropdownOpen(true);
   };

   const handleSelectPotion = (potion) => {
      setSelectedPotion(potion);
      setPotionSearch(getPotionDisplayName(potion));
      setIsDropdownOpen(false);
   };

   const handleXpChange = (potionId, value) => {
      if (/^\d*$/.test(value)) {
         setXpDrafts((currentDrafts) => ({
            ...currentDrafts,
            [potionId]: value,
         }));
      }
   };

   const handleLocationChange = (potionId, value) => {
      setLocationDrafts((currentDrafts) => ({
         ...currentDrafts,
         [potionId]: value,
      }));
   };

   const handleSelectLevel = (potionId, level) => {
      setLevelDrafts((currentDrafts) => ({
         ...currentDrafts,
         [potionId]: level,
      }));

      setEditingLevelPotionId("");
   };

   const handleOpenLevelDropdown = (potionId) => {
      setEditingLevelPotionId((currentPotionId) =>
         currentPotionId === potionId ? "" : potionId
      );
   };

   const handleAddPotion = async () => {
      if (!selectedPotion?.id || !selectedCharacter?.id) return;

      const potionData = {
         xp: 0,
         nivel: selectedPotion.attributes?.nivel || "",
         local_ingredientes: "",
      };

      try {
         setSavingPotionId(selectedPotion.id);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`pocoes.${selectedPotion.id}`]: potionData,
            updated_at: serverTimestamp(),
         });

         updateCharacterPotion(selectedPotion.id, potionData);

         setXpDrafts((currentDrafts) => ({
            ...currentDrafts,
            [selectedPotion.id]: "0",
         }));

         setSelectedPotion(null);
         setPotionSearch("");
         setIsDropdownOpen(false);
      } catch (error) {
         console.error("Erro ao adicionar poção:", error);
      } finally {
         setSavingPotionId("");
      }
   };

   const handleSavePotion = async (potionId, potion, savedData) => {
      const currentXp = savedData?.xp ?? 0;
      const currentLevel = savedData?.nivel || potion.attributes?.nivel || "";
      const currentLocation = savedData?.local_ingredientes || "";

      const nextXp =
         xpDrafts[potionId] === undefined || xpDrafts[potionId] === ""
            ? currentXp
            : Number(xpDrafts[potionId]);

      const nextLevel = levelDrafts[potionId] ?? currentLevel;
      const nextLocation = locationDrafts[potionId] ?? currentLocation;

      const hasChanged =
         Number(nextXp) !== Number(currentXp) ||
         nextLevel !== currentLevel ||
         nextLocation !== currentLocation;

      if (!hasChanged || Number.isNaN(nextXp)) return;

      try {
         setSavingPotionId(potionId);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`pocoes.${potionId}.xp`]: nextXp,
            [`pocoes.${potionId}.nivel`]: nextLevel,
            [`pocoes.${potionId}.local_ingredientes`]: nextLocation,
            updated_at: serverTimestamp(),
         });

         updateCharacterPotion(potionId, {
            ...(savedPotions[potionId] || {}),
            xp: nextXp,
            nivel: nextLevel,
            local_ingredientes: nextLocation,
         });

         clearDrafts(potionId);
      } catch (error) {
         console.error("Erro ao salvar poção:", error);
      } finally {
         setSavingPotionId("");
      }
   };

   const handleDeletePotion = async (potionId) => {
      if (!selectedCharacter?.id) return;

      try {
         setSavingPotionId(potionId);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`pocoes.${potionId}`]: deleteField(),
            updated_at: serverTimestamp(),
         });

         setCharacters((currentCharacters) =>
            currentCharacters.map((character) => {
               if (character.id !== selectedCharacter.id) return character;

               const nextPotions = { ...(character.pocoes || {}) };
               delete nextPotions[potionId];

               return {
                  ...character,
                  pocoes: nextPotions,
               };
            })
         );
      } catch (error) {
         console.error("Erro ao excluir poção:", error);
      } finally {
         setSavingPotionId("");
      }
   };

   return (
      <div className="space-y-6 pb-2">
         <Header
            dropdownRef={dropdownRef}
            potionSearch={potionSearch}
            selectedPotion={selectedPotion}
            isDropdownOpen={isDropdownOpen}
            availablePotions={availablePotions}
            savingPotionId={savingPotionId}
            showRules={showRules}
            tableSearch={tableSearch}
            yearFilter={yearFilter}
            levelFilter={levelFilter}
            locationFilter={locationFilter}
            years={years}
            setIsDropdownOpen={setIsDropdownOpen}
            setShowRules={setShowRules}
            setTableSearch={setTableSearch}
            setYearFilter={setYearFilter}
            setLevelFilter={setLevelFilter}
            setLocationFilter={setLocationFilter}
            handleSearchChange={handleSearchChange}
            handleSelectPotion={handleSelectPotion}
            handleAddPotion={handleAddPotion}
         />

         {showRules ? (
            <RulesPanel activeTab="potions" currentRules={potionRules} />
         ) : null}

         <Table
            filteredAndSortedPotions={filteredAndSortedPotions}
            xpDrafts={xpDrafts}
            levelDrafts={levelDrafts}
            locationDrafts={locationDrafts}
            savingPotionId={savingPotionId}
            editingLevelPotionId={editingLevelPotionId}
            levelDropdownRef={levelDropdownRef}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
            handleXpChange={handleXpChange}
            handleLocationChange={handleLocationChange}
            handleOpenLevelDropdown={handleOpenLevelDropdown}
            handleSelectLevel={handleSelectLevel}
            handleSavePotion={handleSavePotion}
            handleDeletePotion={handleDeletePotion}
         />
      </div>
   );
};

export default PotionsTab;
