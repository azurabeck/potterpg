import { useEffect, useMemo, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import Modal from "@/components/Modal";
import RulesPanel from "../../Shared/RulesPanel";
import MobileFilterDrawer from "../../Shared/MobileFilterDrawer";
import CopyButton from "@/components/CopyButton";

import Side from "./Side";
import Table from "./Table";
import AttributeFormModal from "./AttributeFormModal";
import { atributoOrdem } from "./atributoOrdem";
import attributeRules from "@/assets/json/attributeRules.json";

const normalizeList = (value) => {
   return Array.isArray(value) ? value : [];
};

const createId = () => {
   return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
};

const getAttributeRulesText = () => {
   const lines = [attributeRules.title, ""];

   if (Array.isArray(attributeRules.description)) {
      lines.push(...attributeRules.description, "");
   }

   if (attributeRules.evolutionTitle) {
      lines.push(attributeRules.evolutionTitle, "");
   }

   if (Array.isArray(attributeRules.attributes)) {
      attributeRules.attributes.forEach((attribute) => {
         lines.push(attribute.name || "Atributo");

         if (attribute.description) {
            lines.push(attribute.description);
         }

         if (Array.isArray(attribute.examples) && attribute.examples.length) {
            lines.push("Exemplos:");
            attribute.examples.forEach((example) => lines.push(`- ${example}`));
         }

         lines.push("");
      });
   }

   if (attributeRules.gainRule) {
      lines.push(attributeRules.gainRule.title || "Regra de ganho", "");

      if (Array.isArray(attributeRules.gainRule.conditions)) {
         lines.push("Um atributo só deve receber ponto quando:");
         attributeRules.gainRule.conditions.forEach((condition) => lines.push(`- ${condition}`));
         lines.push("");
      }

      if (Array.isArray(attributeRules.gainRule.normal)) {
         lines.push("Normalmente:");
         attributeRules.gainRule.normal.forEach((rule) => lines.push(`- ${rule}`));
      }
   }

   return lines.join("\n");
};

const ATTRIBUTE_MAXIMUM_BY_YEAR = {
   1: 5,
   2: 7,
   3: 9,
   4: 11,
   5: 12,
   6: 13,
   7: 14,
};

const ADULT_ATTRIBUTE_MAXIMUM = 15;

const getAttributeMaximumByYear = (year) => {
   const normalizedYear = Number(year) || 1;

   if (normalizedYear >= 8) {
      return ADULT_ATTRIBUTE_MAXIMUM;
   }

   return ATTRIBUTE_MAXIMUM_BY_YEAR[Math.max(1, normalizedYear)] ?? ATTRIBUTE_MAXIMUM_BY_YEAR[1];
};

const AttributesTab = ({ selectedCharacter, setCharacters }) => {
   const [search, setSearch] = useState("");
   const [typeFilter, setTypeFilter] = useState("all");
   const [orderBy, setOrderBy] = useState("default");
   const [modal, setModal] = useState(null);
   const [isSaving, setIsSaving] = useState(false);
   const [resourceDrafts, setResourceDrafts] = useState({ hp: "0", xp: "0" });

   const characterYear = Number(selectedCharacter?.ano || 1);
   const attributeMaximum = getAttributeMaximumByYear(characterYear);

   useEffect(() => {
      setResourceDrafts({
         hp: String(selectedCharacter?.hp ?? 0),
         xp: String(selectedCharacter?.xp ?? 0),
      });
   }, [selectedCharacter?.id, selectedCharacter?.hp, selectedCharacter?.xp]);

   const atributos = selectedCharacter?.atributos || {};
   const talentos = normalizeList(selectedCharacter?.talentos);
   const titulos = normalizeList(selectedCharacter?.titulos);

   const rows = useMemo(() => {
      const attributeRows = atributoOrdem
         .map((name) => ({
            id: name,
            tipo: "atributo",
            nome: name,
            nivel: atributos[name] ?? 0,
            maximo: attributeMaximum,
         }));

      const talentRows = talentos.map((item) => ({
         ...item,
         tipo: "talento",
      }));

      const titleRows = titulos.map((item) => ({
         ...item,
         tipo: "titulo",
      }));

      let result = [...attributeRows, ...talentRows, ...titleRows];

      if (typeFilter !== "all") {
         result = result.filter((item) => item.tipo === typeFilter);
      }

      if (search.trim()) {
         const searchValue = search.toLowerCase();

         result = result.filter((item) =>
            [item.nome, item.descricao, item.vantagem, item.conhecidoPor, item.titulo]
               .filter(Boolean)
               .some((value) => String(value).toLowerCase().includes(searchValue))
         );
      }

      if (orderBy === "name") {
         result = [...result].sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || "")));
      }

      if (orderBy === "level") {
         result = [...result].sort((a, b) => Number(b.nivel || 0) - Number(a.nivel || 0));
      }

      return result;
   }, [atributos, talentos, titulos, search, typeFilter, orderBy, attributeMaximum]);

   const updateLocalCharacter = (payload) => {
      setCharacters((currentCharacters) =>
         currentCharacters.map((character) => {
            if (character.id !== selectedCharacter.id) return character;
            return { ...character, ...payload };
         })
      );
   };

   const saveCharacterFields = async (payload) => {
      if (!selectedCharacter?.id) return;

      try {
         setIsSaving(true);

         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            ...payload,
            updated_at: serverTimestamp(),
         });

         updateLocalCharacter(payload);
      } catch (error) {
         console.error("Erro ao salvar atributos:", error);
      } finally {
         setIsSaving(false);
      }
   };

   const handleSaveAttribute = async (attributeName, value) => {
      const normalizedValue = Math.min(
         attributeMaximum,
         Math.max(0, Number(value || 0))
      );

      await saveCharacterFields({
         atributos: {
            ...atributos,
            [attributeName]: normalizedValue,
         },
      });
   };

   const handleResourceChange = (field, value) => {
      if (!/^\d*$/.test(value)) return;
      setResourceDrafts((current) => ({ ...current, [field]: value }));
   };

   const handleSaveResources = async () => {
      await saveCharacterFields({
         hp: Math.max(0, Number(resourceDrafts.hp || 0)),
         xp: Math.max(0, Number(resourceDrafts.xp || 0)),
      });
   };

   const handleSaveExtra = async (form) => {
      const normalizedItem = {
         ...form,
         id: form.id || createId(),
         nivel: Number(form.nivel || 0),
         maximo: Number(form.maximo || 10),
      };

      if (normalizedItem.tipo === "talento") {
         const nextTalentos = talentos.some((talent) => talent.id === normalizedItem.id)
            ? talentos.map((talent) => (talent.id === normalizedItem.id ? normalizedItem : talent))
            : [...talentos, normalizedItem];

         await saveCharacterFields({ talentos: nextTalentos });
      }

      if (normalizedItem.tipo === "titulo") {
         const nextTitulos = titulos.some((title) => title.id === normalizedItem.id)
            ? titulos.map((title) => (title.id === normalizedItem.id ? normalizedItem : title))
            : [...titulos, normalizedItem];

         await saveCharacterFields({ titulos: nextTitulos });
      }

      setModal(null);
   };

   const handleDeleteExtra = async (item) => {
      if (item.tipo === "talento") {
         await saveCharacterFields({ talentos: talentos.filter((talent) => talent.id !== item.id) });
      }

      if (item.tipo === "titulo") {
         await saveCharacterFields({ titulos: titulos.filter((title) => title.id !== item.id) });
      }
   };

   const openAddTalentModal = () => {
      setModal({ type: "form", extraType: "talento", title: "Adicionar Talento", item: null });
   };

   const openAddTitleModal = () => {
      setModal({ type: "form", extraType: "titulo", title: "Adicionar Título", item: null });
   };

   const openEditExtraModal = (item) => {
      setModal({
         type: "form",
         extraType: item.tipo,
         title: item.tipo === "talento" ? "Editar Talento" : "Editar Título",
         item,
      });
   };

   const openRulesModal = () => {
      setModal({ type: "rules", title: "Regras de Atributos" });
   };

   const formatRowsToCopy = (rowsToCopy) => {
      const grouped = rowsToCopy.reduce((acc, row) => {
         acc[row.tipo] = [...(acc[row.tipo] || []), row];
         return acc;
      }, {});

      return ["atributo", "talento", "titulo"]
         .map((type) => {
            const items = grouped[type] || [];
            if (!items.length) return "";

            const title =
               type === "atributo"
                  ? "ATRIBUTOS"
                  : type === "talento"
                     ? "TALENTOS"
                     : "TÍTULOS E REPUTAÇÕES";

            const lines = items.map((item) => {
               const base = `${item.nome}: ${item.nivel ?? 0}/${item.maximo ?? 10}`;

               const details = [
                  item.descricao ? `Descrição: ${item.descricao}` : "",
                  item.vantagem ? `Vantagem: ${item.vantagem}` : "",
                  item.conhecidoPor ? `Conhecido por: ${item.conhecidoPor}` : "",
                  item.titulo ? `Título: ${item.titulo}` : "",
               ].filter(Boolean);

               return details.length
                  ? `${base}\n${details.join("\n")}`
                  : base;
            });

            return `${title}\n${lines.join("\n\n")}`;
         })
         .filter(Boolean)
         .join("\n\n");
   };

   const getAllAttributesText = () => {
      return formatRowsToCopy(rows);
   };

   return (
      <div className="grid grid-cols-1 gap-8 pb-2 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "form" ? (
               <AttributeFormModal
                  key={modal.item?.id || modal.extraType}
                  item={modal.item}
                  type={modal.extraType}
                  onSubmit={handleSaveExtra}
               />
            ) : null}

            {modal?.type === "rules" ? (
               <div className="space-y-4">
                  <div className="flex justify-end">
                     <CopyButton
                        getText={getAttributeRulesText}
                        title="Copiar regras"
                        className="bg-yellow-400 px-4 py-2 text-[#2b0038] hover:bg-yellow-300 hover:text-[#2b0038]"
                     />
                  </div>

                  <RulesPanel activeTab="attributes" />
               </div>
            ) : null}
         </Modal>

         <div className="space-y-7 border-0 border-dashed border-white/20 pr-0 md:border-e md:pr-[60px]">
            <section className="border border-white/10 bg-white/[0.035] p-4">
               <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                     <p className="text-xs uppercase tracking-[0.18em] text-yellow-400">Recursos do personagem</p>
                     <p className="mt-1 text-[11px] text-purple-100/45">Salvos diretamente na ficha do Firestore.</p>
                  </div>

                  <button
                     type="button"
                     disabled={isSaving}
                     onClick={handleSaveResources}
                     className="bg-yellow-400 px-4 py-2 text-xs text-[#2b0038] transition hover:bg-yellow-300 disabled:opacity-50"
                  >
                     Salvar HP e XP
                  </button>
               </div>

               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[{ key: "hp", label: "HP" }, { key: "xp", label: "XP" }].map((resource) => (
                     <label key={resource.key} className="space-y-1">
                        <span className="text-[11px] text-purple-100/60">{resource.label}</span>
                        <input
                           type="text"
                           inputMode="numeric"
                           value={resourceDrafts[resource.key]}
                           onChange={(event) => handleResourceChange(resource.key, event.target.value)}
                           className="w-full bg-white/10 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-yellow-400"
                        />
                     </label>
                  ))}
               </div>
            </section>

            <p className="text-[11px] text-purple-100/45">
               Limite dos atributos no {characterYear}º ano: <span className="text-yellow-400">{attributeMaximum}</span>.
            </p>

            <Table
               rows={rows}
               isSaving={isSaving}
               onSaveAttribute={handleSaveAttribute}
               onEditExtra={openEditExtraModal}
               onDeleteExtra={handleDeleteExtra}
               onOpenRules={(item) =>
                  setModal({
                     item,
                     type: "rules",
                     title: `Regras — ${item.nome}`,
                  })
               }
            />
         </div>

         <MobileFilterDrawer title="Filtros de Atributos">
            <Side
               search={search}
               typeFilter={typeFilter}
               orderBy={orderBy}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setOrderBy={setOrderBy}
               onAddTalent={openAddTalentModal}
               onAddTitle={openAddTitleModal}
               onOpenRules={openRulesModal}
               onCopyAllAttributes={getAllAttributesText}
            />
         </MobileFilterDrawer>

         <div className="hidden lg:sticky lg:top-0 lg:block lg:self-start">
            <Side
               search={search}
               typeFilter={typeFilter}
               orderBy={orderBy}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setOrderBy={setOrderBy}
               onAddTalent={openAddTalentModal}
               onAddTitle={openAddTitleModal}
               onOpenRules={openRulesModal}
               onCopyAllAttributes={getAllAttributesText}
            />
         </div>
      </div>
   );
};

export default AttributesTab;
