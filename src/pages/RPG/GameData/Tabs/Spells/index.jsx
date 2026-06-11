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
import spellRules from "./json-files/spellRules.json";
import Modal from "../../../../../components/Modal";
import { filterSpells, getSpellName, getSpells, normalize, sortSpells } from "./helpers";

const SpellsTab = ({ selectedCharacter, setCharacters }) => {
   const dropdownRef = useRef(null);
   const attributeDropdownRef = useRef(null);
   const levelDropdownRef = useRef(null);

   const [spellSearch, setSpellSearch] = useState("");
   const [selectedSpell, setSelectedSpell] = useState(null);
   const [showRules, setShowRules] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [savingSpellId, setSavingSpellId] = useState("");

   const [filters, setFilters] = useState({
      search: "",
      year: "",
      level: "",
      attribute: "",
   });

   const [drafts, setDrafts] = useState({
      xp: {},
      attribute: {},
      level: {},
   });

   const [editing, setEditing] = useState({
      attribute: "",
      level: "",
   });

   const [sort, setSort] = useState({
      key: "year",
      direction: "asc",
   });

   const spells = useMemo(() => getSpells(), []);
   const savedSpells = selectedCharacter?.habilidades || {};
   const knownIds = Object.keys(savedSpells);

   const rows = useMemo(() => {
      return knownIds
         .map((spellId) => {
            const spell = spells.find((item) => item.id === spellId);
            if (!spell) return null;

            const savedData = savedSpells[spellId];

            return {
               id: spellId,
               spell,
               savedData,
               name: getSpellName(spell),
               year: spell.attributes?.ano_letivo || 0,
               required: spell.attributes?.required || 0,
               xp: savedData?.xp ?? 0,
               level: savedData?.nivel || spell.attributes?.nivel || "",
               attribute: savedData?.atributo || "",
            };
         })
         .filter(Boolean);
   }, [knownIds, savedSpells, spells]);

   const availableSpells = useMemo(() => {
      const search = normalize(spellSearch);

      return spells.filter((spell) => {
         if (knownIds.includes(spell.id)) return false;
         if (!search) return true;

         const text = normalize(`
            ${spell.attributes?.name}
            ${getSpellName(spell)}
            ${spell.attributes?.incantation}
            ${spell.attributes?.effect}
            ${spell.attributes?.aula}
         `);

         return text.includes(search);
      });
   }, [spells, knownIds, spellSearch]);

   const years = useMemo(() => {
      return [...new Set(rows.map((row) => row.year))]
         .filter(Boolean)
         .sort((a, b) => Number(a) - Number(b));
   }, [rows]);

   const filteredAndSortedSpells = useMemo(() => {
      const filtered = filterSpells({
         rows,
         search: filters.search,
         year: filters.year,
         level: filters.level,
         attribute: filters.attribute,
      });

      return sortSpells({ rows: filtered, sort });
   }, [rows, filters, sort]);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
         }

         if (
            attributeDropdownRef.current &&
            !attributeDropdownRef.current.contains(event.target)
         ) {
            setEditing((current) => ({ ...current, attribute: "" }));
         }

         if (
            levelDropdownRef.current &&
            !levelDropdownRef.current.contains(event.target)
         ) {
            setEditing((current) => ({ ...current, level: "" }));
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const updateCharacter = (spellId, data) => {
      setCharacters((characters) =>
         characters.map((character) =>
            character.id === selectedCharacter.id
               ? {
                    ...character,
                    habilidades: {
                       ...(character.habilidades || {}),
                       [spellId]: data,
                    },
                 }
               : character
         )
      );
   };

   const updateFilter = (key, value) => {
      setFilters((current) => ({ ...current, [key]: value }));
   };

   const updateDraft = (type, spellId, value) => {
      setDrafts((current) => ({
         ...current,
         [type]: {
            ...current[type],
            [spellId]: value,
         },
      }));
   };

   const clearDraft = (spellId) => {
      setDrafts((current) => {
         const xp = { ...current.xp };
         const attribute = { ...current.attribute };
         const level = { ...current.level };

         delete xp[spellId];
         delete attribute[spellId];
         delete level[spellId];

         return { xp, attribute, level };
      });
   };

   const handleSearchChange = (event) => {
      setSpellSearch(event.target.value);
      setSelectedSpell(null);
      setIsDropdownOpen(true);
   };

   const handleSelectSpell = (spell) => {
      setSelectedSpell(spell);
      setSpellSearch(getSpellName(spell));
      setIsDropdownOpen(false);
   };

   const handleAddSpell = async () => {
      if (!selectedSpell?.id || !selectedCharacter?.id) return;

      const data = {
         xp: 0,
         atributo: "",
         nivel: selectedSpell.attributes?.nivel || "",
      };

      try {
         setSavingSpellId(selectedSpell.id);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`habilidades.${selectedSpell.id}`]: data,
            updated_at: serverTimestamp(),
         });

         updateCharacter(selectedSpell.id, data);
         updateDraft("xp", selectedSpell.id, "0");

         setSelectedSpell(null);
         setSpellSearch("");
         setIsDropdownOpen(false);
      } catch (error) {
         console.error("Erro ao adicionar feitiço:", error);
      } finally {
         setSavingSpellId("");
      }
   };

   const handleSaveSpell = async (spellId, spell, savedData) => {
      const currentXp = savedData?.xp ?? 0;
      const currentAttribute = savedData?.atributo || "";
      const currentLevel = savedData?.nivel || spell.attributes?.nivel || "";

      const xp =
         drafts.xp[spellId] === undefined || drafts.xp[spellId] === ""
            ? currentXp
            : Number(drafts.xp[spellId]);

      const attribute = drafts.attribute[spellId] ?? currentAttribute;
      const level = drafts.level[spellId] ?? currentLevel;

      const changed =
         Number(xp) !== Number(currentXp) ||
         attribute !== currentAttribute ||
         level !== currentLevel;

      if (!changed || Number.isNaN(xp)) return;

      try {
         setSavingSpellId(spellId);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`habilidades.${spellId}.xp`]: xp,
            [`habilidades.${spellId}.atributo`]: attribute,
            [`habilidades.${spellId}.nivel`]: level,
            updated_at: serverTimestamp(),
         });

         updateCharacter(spellId, {
            ...(savedSpells[spellId] || {}),
            xp,
            atributo: attribute,
            nivel: level,
         });

         clearDraft(spellId);
      } catch (error) {
         console.error("Erro ao salvar feitiço:", error);
      } finally {
         setSavingSpellId("");
      }
   };

   const handleDeleteSpell = async (spellId) => {
      if (!selectedCharacter?.id) return;

      try {
         setSavingSpellId(spellId);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`habilidades.${spellId}`]: deleteField(),
            updated_at: serverTimestamp(),
         });

         setCharacters((characters) =>
            characters.map((character) => {
               if (character.id !== selectedCharacter.id) return character;

               const habilidades = { ...(character.habilidades || {}) };
               delete habilidades[spellId];

               return { ...character, habilidades };
            })
         );
      } catch (error) {
         console.error("Erro ao excluir feitiço:", error);
      } finally {
         setSavingSpellId("");
      }
   };

   const handleSort = (key) => {
      setSort((current) => ({
         key,
         direction:
            current.key !== key || current.direction === "desc" ? "asc" : "desc",
      }));
   };

   const renderSortIcon = (key) => {
      if (sort.key !== key) return "↕";
      return sort.direction === "asc" ? "↑" : "↓";
   };

   return (
      <div className="space-y-6 pb-2">
         <Header
            dropdownRef={dropdownRef}
            spellSearch={spellSearch}
            selectedSpell={selectedSpell}
            isDropdownOpen={isDropdownOpen}
            availableSpells={availableSpells}
            savingSpellId={savingSpellId}
            showRules={showRules}
            tableSearch={filters.search}
            yearFilter={filters.year}
            levelFilter={filters.level}
            attributeFilter={filters.attribute}
            years={years}
            setIsDropdownOpen={setIsDropdownOpen}
            setShowRules={setShowRules}
            setTableSearch={(value) => updateFilter("search", value)}
            setYearFilter={(value) => updateFilter("year", value)}
            setLevelFilter={(value) => updateFilter("level", value)}
            setAttributeFilter={(value) => updateFilter("attribute", value)}
            handleSearchChange={handleSearchChange}
            handleSelectSpell={handleSelectSpell}
            handleAddSpell={handleAddSpell}
         />

         <>
            <Modal
               isOpen={showRules}
               title="Regras de Feitiços"
               onClose={() => setShowRules(false)}
            >
               <RulesPanel activeTab="spells" currentRules={spellRules} />
            </Modal>
         </>

         <Table
            selectedCharacter={selectedCharacter}
            filteredAndSortedSpells={filteredAndSortedSpells}
            xpDrafts={drafts.xp}
            attributeDrafts={drafts.attribute}
            levelDrafts={drafts.level}
            savingSpellId={savingSpellId}
            editingAttributeSpellId={editing.attribute}
            editingLevelSpellId={editing.level}
            attributeDropdownRef={attributeDropdownRef}
            levelDropdownRef={levelDropdownRef}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
            handleXpChange={(spellId, value) => {
               if (/^\d*$/.test(value)) updateDraft("xp", spellId, value);
            }}
            handleOpenAttributeDropdown={(spellId) => {
               setEditing((current) => ({
                  attribute: current.attribute === spellId ? "" : spellId,
                  level: "",
               }));
            }}
            handleOpenLevelDropdown={(spellId) => {
               setEditing((current) => ({
                  attribute: "",
                  level: current.level === spellId ? "" : spellId,
               }));
            }}
            handleSelectAttribute={(spellId, attribute) => {
               updateDraft("attribute", spellId, attribute);
               setEditing((current) => ({ ...current, attribute: "" }));
            }}
            handleSelectLevel={(spellId, level) => {
               updateDraft("level", spellId, level);
               setEditing((current) => ({ ...current, level: "" }));
            }}
            handleSaveSpell={handleSaveSpell}
            handleDeleteSpell={handleDeleteSpell}
         />

         <div className="border-t border-white/20 pt-3 text-xs text-[#736868]">
            <span className="text-yellow-400">★</span> Indica que é obrigatório
            aprender o feitiço no ano indicado.
         </div>
      </div>
   );
};

export default SpellsTab;