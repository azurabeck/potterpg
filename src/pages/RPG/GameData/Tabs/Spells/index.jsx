import { useEffect, useMemo, useRef, useState } from "react";
import {
   collection,
   deleteDoc,
   deleteField,
   doc,
   getDocs,
   serverTimestamp,
   setDoc,
   updateDoc,
} from "firebase/firestore";

import { db } from "../../../../../services/firebase";
import RulesPanel from "../../Shared/RulesPanel";
import Header from "./Header";
import Table from "./Table";
import Album from "./Album";
import CardImageModal from "./CardImageModal";
import SpellDetailsModal from "./SpellDetailsModal";
import spellRules from "./json-files/spellRules.json";
import Modal from "../../../../../components/Modal";
import { buildSpellRow, filterSpells, getSpellMasteryByXp, getSpellName, getSpells, normalize, sortSpells } from "./helpers";

const SpellsTab = ({ selectedCharacter, setCharacters }) => {
   const dropdownRef = useRef(null);
   const attributeDropdownRef = useRef(null);
   const levelDropdownRef = useRef(null);

   const [spellSearch, setSpellSearch] = useState("");
   const [selectedSpell, setSelectedSpell] = useState(null);
   const [showRules, setShowRules] = useState(false);
   const [detailsModal, setDetailsModal] = useState(null);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [savingSpellId, setSavingSpellId] = useState("");
   const [viewMode, setViewMode] = useState("album");
   const [cardImageModal, setCardImageModal] = useState(null);
   const [spellOverrides, setSpellOverrides] = useState({});

   const [filters, setFilters] = useState({
      search: "",
      year: "",
      level: "",
      attribute: "",
      category: "",
      status: "",
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

   const spells = useMemo(() => getSpells(spellOverrides), [spellOverrides]);
   const savedSpells = selectedCharacter?.habilidades || {};

   useEffect(() => {
      const loadFirestoreSpells = async () => {
         try {
            const snapshot = await getDocs(collection(db, "spells"));
            const data = {};

            snapshot.docs.forEach((spellDoc) => {
               data[spellDoc.id] = {
                  id: spellDoc.id,
                  ...spellDoc.data(),
               };
            });

            setSpellOverrides(data);
         } catch (error) {
            console.error("Erro ao carregar collection spells:", error);
         }
      };

      loadFirestoreSpells();
   }, []);
   const knownIds = Object.keys(savedSpells);

   const rows = useMemo(() => {
      return knownIds
         .map((spellId) => {
            const spell = spells.find((item) => item.id === spellId);
            if (!spell) return null;
            return buildSpellRow({ spell, savedSpells });
         })
         .filter(Boolean);
   }, [knownIds, savedSpells, spells]);

   const albumRows = useMemo(() => {
      return spells.map((spell) => buildSpellRow({ spell, savedSpells }));
   }, [savedSpells, spells]);

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
      return [...new Set(albumRows.map((row) => row.year))]
         .filter(Boolean)
         .sort((a, b) => Number(a) - Number(b));
   }, [albumRows]);

   const categories = useMemo(() => {
      return [...new Set(albumRows.map((row) => row.category))]
         .filter(Boolean)
         .sort((a, b) => a.localeCompare(b));
   }, [albumRows]);

   const filteredAndSortedSpells = useMemo(() => {
      const filtered = filterSpells({
         rows,
         search: filters.search,
         year: filters.year,
         level: filters.level,
         attribute: filters.attribute,
         category: filters.category,
      });

      return sortSpells({ rows: filtered, sort });
   }, [rows, filters, sort]);

   const filteredAlbumSpells = useMemo(() => {
      const filtered = filterSpells({
         rows: albumRows,
         search: filters.search,
         year: filters.year,
         level: filters.level,
         attribute: filters.attribute,
         category: filters.category,
      }).filter((row) => {
         if (!filters.status) return true;
         if (filters.status === "unlocked") return row.isKnown;
         if (filters.status === "locked") return !row.isKnown;
         return true;
      });

      return sortSpells({ rows: filtered, sort });
   }, [albumRows, filters, sort]);

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

   const handleAddSpell = async (spellToAdd = selectedSpell) => {
      if (!spellToAdd?.id || !selectedCharacter?.id) return;

      const data = {
         xp: 0,
      };

      try {
         setSavingSpellId(spellToAdd.id);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`habilidades.${spellToAdd.id}`]: data,
            updated_at: serverTimestamp(),
         });

         updateCharacter(spellToAdd.id, data);
         updateDraft("xp", spellToAdd.id, "0");

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

      const xp =
         drafts.xp[spellId] === undefined || drafts.xp[spellId] === ""
            ? currentXp
            : Number(drafts.xp[spellId]);

      const changed = Number(xp) !== Number(currentXp);

      if (!changed || Number.isNaN(xp)) return;

      try {
         setSavingSpellId(spellId);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            [`habilidades.${spellId}.xp`]: xp,
            updated_at: serverTimestamp(),
         });

         updateCharacter(spellId, {
            ...(savedSpells[spellId] || {}),
            xp,
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

   const handleDeleteSpellFromCatalog = async (spell) => {
      if (!spell?.id) return;

      const confirmed = window.confirm(
         `Excluir o feitiço "${getSpellName(spell)}" do banco? Ele também será removido da ficha deste personagem, caso esteja aprendido.`
      );

      if (!confirmed) return;

      try {
         setSavingSpellId(spell.id);

         await deleteDoc(doc(db, "spells", spell.id));

         if (selectedCharacter?.id && savedSpells[spell.id]) {
            await updateDoc(doc(db, "characters", selectedCharacter.id), {
               [`habilidades.${spell.id}`]: deleteField(),
               updated_at: serverTimestamp(),
            });

            setCharacters((characters) =>
               characters.map((character) => {
                  if (character.id !== selectedCharacter.id) return character;

                  const habilidades = { ...(character.habilidades || {}) };
                  delete habilidades[spell.id];

                  return { ...character, habilidades };
               })
            );
         }

         setSpellOverrides((current) => {
            const nextSpells = { ...current };
            delete nextSpells[spell.id];
            return nextSpells;
         });

         setDetailsModal((current) =>
            current?.spell?.id === spell.id ? null : current
         );
         setCardImageModal((current) =>
            current?.spell?.id === spell.id ? null : current
         );
      } catch (error) {
         console.error("Erro ao excluir feitiço do banco:", error);
      } finally {
         setSavingSpellId("");
      }
   };

   const handleSaveCardImage = async (spellId, imageUrl) => {
      if (!spellId) return;

      try {
         setSavingSpellId(spellId);

         await setDoc(
            doc(db, "spells", spellId),
            {
               id: spellId,
               attributes: {
                  card_image_url: imageUrl,
                  image_url: imageUrl,
               },
               updated_at: serverTimestamp(),
            },
            { merge: true }
         );

         setSpellOverrides((current) => {
            const previous = current[spellId] || {};
            return {
               ...current,
               [spellId]: {
                  ...previous,
                  id: spellId,
                  attributes: {
                     ...(previous.attributes || {}),
                     card_image_url: imageUrl,
                     image_url: imageUrl,
                  },
               },
            };
         });

         setDetailsModal((current) =>
            current?.spell?.id === spellId
               ? {
                    ...current,
                    spell: {
                       ...current.spell,
                       attributes: {
                          ...(current.spell?.attributes || {}),
                          card_image_url: imageUrl,
                          image_url: imageUrl,
                       },
                    },
                 }
               : current
         );

         setCardImageModal(null);
      } catch (error) {
         console.error("Erro ao salvar imagem da carta:", error);
      } finally {
         setSavingSpellId("");
      }
   };

   const handleSaveSpellConfig = async (payload) => {
      if (!payload?.id) return;

      try {
         setSavingSpellId(payload.id);

         await setDoc(
            doc(db, "spells", payload.id),
            {
               ...payload,
               updated_at: serverTimestamp(),
            },
            { merge: true }
         );

         setSpellOverrides((current) => ({
            ...current,
            [payload.id]: payload,
         }));

         setDetailsModal((current) =>
            current?.spell?.id === payload.id
               ? {
                    ...current,
                    spell: {
                       ...current.spell,
                       ...payload,
                       attributes: {
                          ...(current.spell?.attributes || {}),
                          ...(payload.attributes || {}),
                       },
                    },
                 }
               : current
         );
      } catch (error) {
         console.error("Erro ao salvar configuração do feitiço:", error);
         throw error;
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

   const getAllSpellsText = () => {
      if (!rows.length) return "";

      return rows
         .map((row) => {
            const mastery = getSpellMasteryByXp(row.spell, row.xp);

            return [
               `Feitiço: ${row.name}`,
               `Ano: ${row.year || ""}`,
               `Nível: ${row.level || ""}`,
               `XP: ${row.xp ?? 0}`,
               `Maestria: ${mastery?.maestria ?? 0}`,
               `Dado: ${mastery?.dado || ""}`,
               `Dice: ${row.dice || ""}`,
               `Atributo: ${row.attribute || ""}`,
            ].join("\n");
         })
         .join("\n\n---\n\n");
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
            categoryFilter={filters.category}
            statusFilter={filters.status}
            years={years}
            categories={categories}
            viewMode={viewMode}
            setIsDropdownOpen={setIsDropdownOpen}
            setShowRules={setShowRules}
            setTableSearch={(value) => updateFilter("search", value)}
            setYearFilter={(value) => updateFilter("year", value)}
            setLevelFilter={(value) => updateFilter("level", value)}
            setAttributeFilter={(value) => updateFilter("attribute", value)}
            setCategoryFilter={(value) => updateFilter("category", value)}
            setStatusFilter={(value) => updateFilter("status", value)}
            setViewMode={setViewMode}
            handleSearchChange={handleSearchChange}
            handleSelectSpell={handleSelectSpell}
            handleAddSpell={handleAddSpell}
            onCopyAllSpells={getAllSpellsText}
         />

         <>
            <Modal
               isOpen={showRules}
               title="Regras de Feitiços"
               onClose={() => setShowRules(false)}
            >
               <RulesPanel activeTab="spells" currentRules={spellRules} />
            </Modal>

            <Modal
               isOpen={Boolean(cardImageModal)}
               title="Imagem da Carta"
               onClose={() => setCardImageModal(null)}
            >
               {cardImageModal ? (
                  <CardImageModal
                     spell={cardImageModal.spell}
                     savedData={cardImageModal.savedData}
                     saving={savingSpellId === cardImageModal.spell?.id}
                     onSave={handleSaveCardImage}
                  />
               ) : null}
            </Modal>

            <Modal
               isOpen={Boolean(detailsModal)}
               title="Detalhes do Feitiço"
               onClose={() => setDetailsModal(null)}
               size="full"
               bodyClassName="max-h-[calc(100vh-150px)] overflow-hidden pr-0"
            >
               {detailsModal ? (
                  <SpellDetailsModal
                     spell={detailsModal.spell}
                     savedData={detailsModal.savedData}
                     mastery={detailsModal.mastery}
                     selectedCharacter={selectedCharacter}
                     saving={savingSpellId === detailsModal.spell?.id}
                     initialMode={detailsModal.initialMode || "view"}
                     onSaveSpellConfig={handleSaveSpellConfig}
                  />
               ) : null}
            </Modal>
         </>

         {viewMode === "album" ? (
            <Album
               selectedCharacter={selectedCharacter}
               albumItems={filteredAlbumSpells}
               savingSpellId={savingSpellId}
               onAddSpell={handleAddSpell}
               onDeleteSpell={handleDeleteSpell}
               onDeleteSpellFromCatalog={handleDeleteSpellFromCatalog}
               onOpenImageEditor={(spell) =>
                  setCardImageModal({
                     spell,
                     savedData: savedSpells[spell.id],
                  })
               }
               onOpenDetails={(spell, savedData, mastery) =>
                  setDetailsModal({ spell, savedData, mastery, initialMode: "view" })
               }
               onOpenEdit={(spell, savedData, mastery) =>
                  setDetailsModal({ spell, savedData, mastery, initialMode: "edit" })
               }
            />
         ) : (
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
               handleOpenDetails={(spell, savedData, mastery) =>
                  setDetailsModal({ spell, savedData, mastery })
               }
            />
         )}

         <div className="border-t border-white/20 pt-3 text-xs text-[#736868]">
            <span className="text-yellow-400">★</span> Indica que é obrigatório
            aprender o feitiço no ano indicado.
         </div>
      </div>
   );
};

export default SpellsTab;