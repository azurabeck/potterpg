import { useEffect, useMemo, useRef, useState } from "react";
import {
   deleteField,
   doc,
   serverTimestamp,
   updateDoc,
} from "firebase/firestore";
import {
   CheckIcon,
   InformationCircleIcon,
   PlusIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import spellsJson from "../../../../../assets/json/spells_rpg.json";
import masteryRules from "../../../../../assets/json/mastery_rpg.json";
import { db } from "../../../../../services/firebase";
import { getMasteryByXp } from "../helpers/mastery";

const attributeOptions = [
   "Coragem",
   "Inteligência",
   "Agilidade",
   "Carisma",
   "Percepção",
   "Sorte",
   "Magia",
   "Resistência",
   "Ataque",
   "Proteção",
   "Precisão",
   "Controle",
   "Magia Antiga",
   "Liderança",
   "Aprendizado Mágico",
   "Persuasão",
   "Astucia",
   "Equilibrio",
];

const levelOptions = masteryRules.maestria.map((item) => item.aprendizado);

const tableColumns =
   "grid-cols-[52px_minmax(180px,1.4fr)_110px_90px_150px_minmax(150px,1fr)_82px]";

const normalizeText = (text = "") => {
   if (text === null || text === undefined) return "";

   return String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
};

const getSpellsList = () => {
   if (Array.isArray(spellsJson)) return spellsJson;
   if (Array.isArray(spellsJson.data)) return spellsJson.data;
   if (Array.isArray(spellsJson.spells)) return spellsJson.spells;

   return [];
};

const getSpellDisplayName = (spell) => {
   const incantation = spell.attributes?.incantation;

   if (incantation) {
      return incantation.split("(")[0].trim();
   }

   return spell.attributes?.name || "-";
};

const getNextSortDirection = (currentSort, key) => {
   if (currentSort.key !== key) return "asc";
   if (currentSort.direction === "asc") return "desc";
   return "asc";
};

const SpellsTab = ({ selectedCharacter, setCharacters }) => {
   const dropdownRef = useRef(null);
   const attributeDropdownRef = useRef(null);
   const levelDropdownRef = useRef(null);

   const [spellSearch, setSpellSearch] = useState("");
   const [selectedSpell, setSelectedSpell] = useState(null);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [showRules, setShowRules] = useState(false);

   const [editingAttributeSpellId, setEditingAttributeSpellId] = useState("");
   const [editingLevelSpellId, setEditingLevelSpellId] = useState("");

   const [xpDrafts, setXpDrafts] = useState({});
   const [attributeDrafts, setAttributeDrafts] = useState({});
   const [levelDrafts, setLevelDrafts] = useState({});
   const [savingSpellId, setSavingSpellId] = useState("");

   const [tableSearch, setTableSearch] = useState("");
   const [yearFilter, setYearFilter] = useState("");
   const [levelFilter, setLevelFilter] = useState("");
   const [attributeFilter, setAttributeFilter] = useState("");
   const [sortConfig, setSortConfig] = useState({
      key: "year",
      direction: "asc",
   });

   const spells = useMemo(() => getSpellsList(), []);
   const savedSpells = selectedCharacter?.habilidades || {};
   const knownSpellIds = Object.keys(savedSpells);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
         ) {
            setIsDropdownOpen(false);
         }

         if (
            attributeDropdownRef.current &&
            !attributeDropdownRef.current.contains(event.target)
         ) {
            setEditingAttributeSpellId("");
         }

         if (
            levelDropdownRef.current &&
            !levelDropdownRef.current.contains(event.target)
         ) {
            setEditingLevelSpellId("");
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const availableSpells = useMemo(() => {
      const search = normalizeText(spellSearch);

      return spells
         .filter((spell) => !knownSpellIds.includes(spell.id))
         .filter((spell) => {
            if (!search) return true;

            const name = normalizeText(spell.attributes?.name);
            const displayName = normalizeText(getSpellDisplayName(spell));
            const incantation = normalizeText(spell.attributes?.incantation);
            const effect = normalizeText(spell.attributes?.effect);
            const aula = normalizeText(spell.attributes?.aula);

            return (
               name.includes(search) ||
               displayName.includes(search) ||
               incantation.includes(search) ||
               effect.includes(search) ||
               aula.includes(search)
            );
         });
   }, [spells, knownSpellIds, spellSearch]);

   const characterSpells = useMemo(() => {
      return knownSpellIds
         .map((spellId) => {
            const spell = spells.find((item) => item.id === spellId);

            if (!spell) return null;

            const savedData = savedSpells[spellId];

            return {
               spell,
               savedData,
               id: spellId,
               name: getSpellDisplayName(spell),
               year: spell.attributes?.ano_letivo || 0,
               required: spell.attributes?.required || 0,
               xp: savedData?.xp ?? 0,
               level: savedData?.nivel || spell.attributes?.nivel || "",
               attribute: savedData?.atributo || "",
            };
         })
         .filter(Boolean);
   }, [knownSpellIds, savedSpells, spells]);

   const years = useMemo(() => {
      return [...new Set(characterSpells.map((item) => item.year))]
         .filter(Boolean)
         .sort((a, b) => Number(a) - Number(b));
   }, [characterSpells]);

   const filteredAndSortedSpells = useMemo(() => {
      const search = normalizeText(tableSearch);

      const filtered = characterSpells.filter((item) => {
         const matchesSearch =
            !search ||
            normalizeText(item.name).includes(search) ||
            normalizeText(item.attribute).includes(search) ||
            normalizeText(item.level).includes(search);

         const matchesYear =
            !yearFilter || String(item.year) === String(yearFilter);

         const matchesLevel = !levelFilter || item.level === levelFilter;

         const matchesAttribute =
            !attributeFilter || item.attribute === attributeFilter;

         return (
            matchesSearch &&
            matchesYear &&
            matchesLevel &&
            matchesAttribute
         );
      });

      return [...filtered].sort((a, b) => {
         const direction = sortConfig.direction === "asc" ? 1 : -1;

         const valueA = a[sortConfig.key];
         const valueB = b[sortConfig.key];

         if (typeof valueA === "number" && typeof valueB === "number") {
            return (valueA - valueB) * direction;
         }

         return String(valueA || "").localeCompare(String(valueB || "")) * direction;
      });
   }, [
      characterSpells,
      tableSearch,
      yearFilter,
      levelFilter,
      attributeFilter,
      sortConfig,
   ]);

   const updateCharacterState = (spellId, spellData) => {
      setCharacters((currentCharacters) =>
         currentCharacters.map((character) => {
            if (character.id !== selectedCharacter.id) return character;

            return {
               ...character,
               habilidades: {
                  ...(character.habilidades || {}),
                  [spellId]: spellData,
               },
            };
         })
      );
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

   const handleSelectSpell = (spell) => {
      setSelectedSpell(spell);
      setSpellSearch(getSpellDisplayName(spell));
      setIsDropdownOpen(false);
   };

   const handleSearchChange = (event) => {
      setSpellSearch(event.target.value);
      setSelectedSpell(null);
      setIsDropdownOpen(true);
   };

   const handleAddSpell = async () => {
      if (!selectedSpell?.id || !selectedCharacter?.id) return;

      const spellData = {
         xp: 0,
         atributo: "",
         nivel: selectedSpell.attributes?.nivel || "",
      };

      try {
         setSavingSpellId(selectedSpell.id);

         const characterRef = doc(db, "characters", selectedCharacter.id);

         await updateDoc(characterRef, {
            [`habilidades.${selectedSpell.id}`]: spellData,
            updated_at: serverTimestamp(),
         });

         updateCharacterState(selectedSpell.id, spellData);

         setXpDrafts((currentDrafts) => ({
            ...currentDrafts,
            [selectedSpell.id]: "0",
         }));

         setSelectedSpell(null);
         setSpellSearch("");
         setIsDropdownOpen(false);
      } catch (error) {
         console.error("Erro ao adicionar feitiço:", error);
      } finally {
         setSavingSpellId("");
      }
   };

   const handleXpChange = (spellId, value) => {
      if (/^\d*$/.test(value)) {
         setXpDrafts((currentDrafts) => ({
            ...currentDrafts,
            [spellId]: value,
         }));
      }
   };

   const handleSelectAttribute = (spellId, attribute) => {
      setAttributeDrafts((currentDrafts) => ({
         ...currentDrafts,
         [spellId]: attribute,
      }));

      setEditingAttributeSpellId("");
   };

   const handleSelectLevel = (spellId, level) => {
      setLevelDrafts((currentDrafts) => ({
         ...currentDrafts,
         [spellId]: level,
      }));

      setEditingLevelSpellId("");
   };

   const handleOpenAttributeDropdown = (spellId) => {
      setEditingAttributeSpellId((currentSpellId) =>
         currentSpellId === spellId ? "" : spellId
      );
      setEditingLevelSpellId("");
   };

   const handleOpenLevelDropdown = (spellId) => {
      setEditingLevelSpellId((currentSpellId) =>
         currentSpellId === spellId ? "" : spellId
      );
      setEditingAttributeSpellId("");
   };

   const handleSaveSpell = async (spellId, spell, savedData) => {
      const currentXp = savedData?.xp ?? 0;
      const currentAttribute = savedData?.atributo || "";
      const currentLevel = savedData?.nivel || spell.attributes?.nivel || "";

      const draftXp = xpDrafts[spellId];
      const draftAttribute = attributeDrafts[spellId];
      const draftLevel = levelDrafts[spellId];

      const nextXp =
         draftXp === undefined || draftXp === "" ? currentXp : Number(draftXp);

      const nextAttribute =
         draftAttribute === undefined ? currentAttribute : draftAttribute;

      const nextLevel = draftLevel === undefined ? currentLevel : draftLevel;

      const xpChanged = Number(nextXp) !== Number(currentXp);
      const attributeChanged = nextAttribute !== currentAttribute;
      const levelChanged = nextLevel !== currentLevel;

      if (!xpChanged && !attributeChanged && !levelChanged) return;
      if (Number.isNaN(nextXp)) return;

      try {
         setSavingSpellId(spellId);

         const characterRef = doc(db, "characters", selectedCharacter.id);

         await updateDoc(characterRef, {
            [`habilidades.${spellId}.xp`]: nextXp,
            [`habilidades.${spellId}.atributo`]: nextAttribute,
            [`habilidades.${spellId}.nivel`]: nextLevel,
            updated_at: serverTimestamp(),
         });

         updateCharacterState(spellId, {
            ...(savedSpells[spellId] || {}),
            xp: nextXp,
            atributo: nextAttribute,
            nivel: nextLevel,
         });

         setXpDrafts((currentDrafts) => {
            const nextDrafts = { ...currentDrafts };
            delete nextDrafts[spellId];
            return nextDrafts;
         });

         setAttributeDrafts((currentDrafts) => {
            const nextDrafts = { ...currentDrafts };
            delete nextDrafts[spellId];
            return nextDrafts;
         });

         setLevelDrafts((currentDrafts) => {
            const nextDrafts = { ...currentDrafts };
            delete nextDrafts[spellId];
            return nextDrafts;
         });
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

         const characterRef = doc(db, "characters", selectedCharacter.id);

         await updateDoc(characterRef, {
            [`habilidades.${spellId}`]: deleteField(),
            updated_at: serverTimestamp(),
         });

         setCharacters((currentCharacters) =>
            currentCharacters.map((character) => {
               if (character.id !== selectedCharacter.id) return character;

               const nextSkills = { ...(character.habilidades || {}) };
               delete nextSkills[spellId];

               return {
                  ...character,
                  habilidades: nextSkills,
               };
            })
         );
      } catch (error) {
         console.error("Erro ao excluir feitiço:", error);
      } finally {
         setSavingSpellId("");
      }
   };

   return (
      <div className="space-y-6 pb-2">
         <div className="flex items-start gap-2">
            <div ref={dropdownRef} className="relative flex flex-1 gap-2">
               <div className="relative flex-1">
                  <input
                     type="text"
                     value={spellSearch}
                     onChange={handleSearchChange}
                     onFocus={() => setIsDropdownOpen(true)}
                     placeholder="Buscar feitiço para adicionar..."
                     className="h-10 w-full border border-white/10 bg-white/10 px-4 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400/60 focus:bg-white/15"
                  />

                  {isDropdownOpen ? (
                     <div className="absolute left-0 right-0 top-11 z-30 max-h-72 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl">
                        {availableSpells.length ? (
                           availableSpells.map((spell) => (
                              <button
                                 key={spell.id}
                                 type="button"
                                 onMouseDown={(event) =>
                                    event.preventDefault()
                                 }
                                 onClick={() => handleSelectSpell(spell)}
                                 className="flex w-full flex-col border-b border-white/5 px-4 py-3 text-left text-xs transition hover:bg-white/10"
                              >
                                 <span className="text-white">
                                    {getSpellDisplayName(spell)}
                                 </span>

                                 <span className="mt-1 text-[11px] text-[#736868]">
                                    {spell.attributes?.aula || "Feitiço"} •{" "}
                                    {spell.attributes?.nivel || "-"} • Ano{" "}
                                    {spell.attributes?.ano_letivo || "-"}
                                 </span>
                              </button>
                           ))
                        ) : (
                           <div className="px-4 py-4 text-xs text-[#736868]">
                              Nenhum feitiço encontrado.
                           </div>
                        )}
                     </div>
                  ) : null}
               </div>

               <button
                  type="button"
                  disabled={
                     !selectedSpell || savingSpellId === selectedSpell?.id
                  }
                  onClick={handleAddSpell}
                  className="flex h-10 w-10 items-center justify-center bg-white/10 text-white/70 transition hover:bg-yellow-400 hover:text-[#2b0038] disabled:cursor-not-allowed disabled:opacity-40"
                  title="Adicionar feitiço"
               >
                  <PlusIcon className="h-5 w-5" />
               </button>
            </div>

            <button
               type="button"
               onClick={() => setShowRules((currentValue) => !currentValue)}
               className="h-10 whitespace-nowrap bg-white/10 px-4 text-xs uppercase text-white/70 transition hover:bg-white/20 hover:text-white"
            >
               {showRules ? "Esconder regras" : "Ver regras"}
            </button>
         </div>

         {showRules ? (
            <div className="border border-white/10 bg-white/10 p-5 text-left text-xs leading-5 text-[#c3b7c8]">
               <h3 className="mb-4 text-yellow-400">Regras de Feitiços</h3>

               <p className="mb-3">
                  O XP de feitiço usa o nível de aprendizado para calcular a
                  maestria atual.
               </p>

               <p className="mb-3">
                  Ao alterar o nível, a maestria é recalculada automaticamente
                  usando o XP atual do feitiço.
               </p>

               <p>
                  Atributo deve ser escolhido manualmente quando o JSON do
                  feitiço não trouxer essa informação.
               </p>
            </div>
         ) : null}

         <div className="grid grid-cols-[1fr_120px_120px_120px] gap-3">
            <input
               type="text"
               value={tableSearch}
               onChange={(event) => setTableSearch(event.target.value)}
               placeholder="Filtrar tabela..."
               className="h-9 border border-white/10 bg-white/10 px-3 text-xs text-white outline-none placeholder:text-white/30"
            />

            <select
               value={yearFilter}
               onChange={(event) => setYearFilter(event.target.value)}
               className="h-9 border border-white/10 text-white/30 bg-white/10 text-xs text-white outline-none"
            >
               <option value="">Ano</option>
               {years.map((year) => (
                  <option key={year} value={year}>
                     Ano {year}
                  </option>
               ))}
            </select>

            <select
               value={levelFilter}
               onChange={(event) => setLevelFilter(event.target.value)}
               className="h-9 border border-white/10 text-white/30 bg-white/10 text-xs text-white outline-none"
            >
               <option value="">Nível</option>
               {levelOptions.map((level) => (
                  <option key={level} value={level}>
                     {level}
                  </option>
               ))}
            </select>

            <select
               value={attributeFilter}
               onChange={(event) => setAttributeFilter(event.target.value)}
               className="h-9 border border-white/10 text-white/30 bg-white/10 text-xs text-white outline-none"
            >
               <option value="">Atributo</option>
               {attributeOptions.map((attribute) => (
                  <option key={attribute} value={attribute}>
                     {attribute}
                  </option>
               ))}
            </select>
         </div>

         <div className="overflow-visible">
            <div
               className={`grid ${tableColumns} gap-5 border-b border-white/10 pb-3 text-xs text-purple-100/90`}
            >
               <button type="button" onClick={() => handleSort("year")} className="text-left">
                  Ano {renderSortIcon("year")}
               </button>
               <button type="button" onClick={() => handleSort("name")} className="text-left">
                  Nome {renderSortIcon("name")}
               </button>
               <button type="button" onClick={() => handleSort("level")} className="text-left">
                  Nível {renderSortIcon("level")}
               </button>
               <button type="button" onClick={() => handleSort("xp")} className="text-left">
                  XP {renderSortIcon("xp")}
               </button>
               <span  className="text-left">Maestria → Dado</span>
               <button type="button" onClick={() => handleSort("attribute")}  className="text-left">
                  Atributo {renderSortIcon("attribute")}
               </button>
               <span />
            </div>

            <div className="space-y-1 pt-3">
               {filteredAndSortedSpells.length ? (
                  filteredAndSortedSpells.map((item, index) => {
                     const { spell, savedData } = item;

                     const xpAtual = savedData?.xp ?? 0;
                     const draftXp = xpDrafts[spell.id] ?? String(xpAtual);

                     const currentAttribute = savedData?.atributo || "";
                     const draftAttribute =
                        attributeDrafts[spell.id] ?? currentAttribute;

                     const currentLevel =
                        savedData?.nivel || spell.attributes?.nivel || "";
                     const draftLevel = levelDrafts[spell.id] ?? currentLevel;

                     const xpChanged = Number(draftXp) !== Number(xpAtual);
                     const attributeChanged =
                        draftAttribute !== currentAttribute;
                     const levelChanged = draftLevel !== currentLevel;

                     const hasChanged =
                        xpChanged || attributeChanged || levelChanged;

                     const mastery = getMasteryByXp(draftLevel, draftXp);

                     const dropdownDirection = index < 3 ? "top-8" : "bottom-8";

                     return (
                        <div
                           key={spell.id}
                           className={`grid ${tableColumns} min-h-12 items-center gap-5 text-xs text-[#736868] transition hover:bg-white/5`}
                        >
                           <span>
                              {spell.attributes?.ano_letivo || "-"}{" "}
                              {spell.attributes?.required ? (
                                 <span className="text-yellow-400">★</span>
                              ) : null}
                           </span>

                           <span className="flex items-center gap-2">
                              {getSpellDisplayName(spell)}

                              {spell.attributes?.effect ? (
                                 <span className="group relative inline-flex">
                                    <InformationCircleIcon className="h-4 w-4 text-white" />

                                    <span className="pointer-events-none absolute bottom-6 left-1/2 z-40 hidden w-64 -translate-x-1/2 bg-[#21002b] px-3 py-2 text-[11px] leading-4 text-white shadow-2xl ring-1 ring-white/10 group-hover:block">
                                       {spell.attributes.effect}
                                    </span>
                                 </span>
                              ) : null}
                           </span>

                           <div
                              className="relative"
                              ref={
                                 editingLevelSpellId === spell.id
                                    ? levelDropdownRef
                                    : null
                              }
                           >
                              <button
                                 type="button"
                                 onClick={() =>
                                    handleOpenLevelDropdown(spell.id)
                                 }
                                 className="text-left text-[#736868] transition hover:text-white"
                              >
                                 {draftLevel || "+"}
                              </button>

                              {editingLevelSpellId === spell.id ? (
                                 <div
                                    className={`absolute left-0 z-40 max-h-56 w-52 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl ${dropdownDirection}`}
                                 >
                                    {levelOptions.map((level) => (
                                       <button
                                          key={level}
                                          type="button"
                                          onClick={() =>
                                             handleSelectLevel(spell.id, level)
                                          }
                                          className="flex w-full border-b border-white/5 px-3 py-2 text-left text-xs text-white transition hover:bg-white/10"
                                       >
                                          {level}
                                       </button>
                                    ))}
                                 </div>
                              ) : null}
                           </div>

                           <input
                              type="text"
                              value={draftXp}
                              onChange={(event) =>
                                 handleXpChange(spell.id, event.target.value)
                              }
                              className="w-full bg-[#9d564c] px-3 py-1 text-center text-xs text-white outline-none ring-1 ring-transparent focus:ring-yellow-400"
                           />

                           <span>
                              {mastery.maestria} → {mastery.dado}
                           </span>

                           <div
                              className="relative"
                              ref={
                                 editingAttributeSpellId === spell.id
                                    ? attributeDropdownRef
                                    : null
                              }
                           >
                              {draftAttribute ? (
                                 <button
                                    type="button"
                                    onClick={() =>
                                       handleOpenAttributeDropdown(spell.id)
                                    }
                                    className="text-left text-[#736868] transition hover:text-white"
                                 >
                                    {draftAttribute} (
                                    {selectedCharacter?.atributos?.[
                                       draftAttribute
                                    ] ?? 0}
                                    )
                                 </button>
                              ) : (
                                 <button
                                    type="button"
                                    onClick={() =>
                                       handleOpenAttributeDropdown(spell.id)
                                    }
                                    className="flex h-7 w-7 items-center justify-center bg-white/10 text-white transition hover:bg-yellow-400 hover:text-[#2b0038]"
                                 >
                                    <PlusIcon className="h-4 w-4" />
                                 </button>
                              )}

                              {editingAttributeSpellId === spell.id ? (
                                 <div
                                    className={`absolute left-0 z-40 max-h-56 w-52 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl ${dropdownDirection}`}
                                 >
                                    {attributeOptions.map((attribute) => (
                                       <button
                                          key={attribute}
                                          type="button"
                                          onClick={() =>
                                             handleSelectAttribute(
                                                spell.id,
                                                attribute
                                             )
                                          }
                                          className="flex w-full border-b border-white/5 px-3 py-2 text-left text-xs text-white transition hover:bg-white/10"
                                       >
                                          {attribute} (
                                          {selectedCharacter?.atributos?.[
                                             attribute
                                          ] ?? 0}
                                          )
                                       </button>
                                    ))}
                                 </div>
                              ) : null}
                           </div>

                           <div className="flex items-center gap-2">
                              <button
                                 type="button"
                                 disabled={
                                    !hasChanged || savingSpellId === spell.id
                                 }
                                 onClick={() =>
                                    handleSaveSpell(spell.id, spell, savedData)
                                 }
                                 className={`flex h-7 w-7 items-center justify-center rounded transition ${
                                    hasChanged && savingSpellId !== spell.id
                                       ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300"
                                       : "bg-white/10 text-white/30"
                                 }`}
                              >
                                 <CheckIcon className="h-4 w-4" />
                              </button>

                              <button
                                 type="button"
                                 disabled={savingSpellId === spell.id}
                                 onClick={() => handleDeleteSpell(spell.id)}
                                 className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white/40 transition hover:bg-red-500/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                 <TrashIcon className="h-4 w-4" />
                              </button>
                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="flex min-h-[180px] items-center justify-center text-center text-sm text-purple-200/70">
                     Nenhum feitiço encontrado.
                  </div>
               )}
            </div>
         </div>

         <div className="border-t border-white/20 pt-3 text-xs text-[#736868]">
            <span className="text-yellow-400">★</span> Indica que é obrigatório
            aprender o feitiço no ano indicado.
         </div>
      </div>
   );
};

export default SpellsTab;