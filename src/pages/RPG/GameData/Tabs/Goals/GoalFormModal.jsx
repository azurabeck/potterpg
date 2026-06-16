import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../../../../components/Modal";
import CustomSelect from "../../../../../components/CustomSelect";
import attributeRules from "../../../../../assets/json/attributeRules.json";
import { getPotionsList, getPotionDisplayName } from "../Potions/helpers";
import { getSpellName, getSpells } from "../Spells/helpers";
import { defaultGoals, goalTypes } from "./defaultGoals";

const emptyForm = {
   year: 1,
   type: "spell",
   title: "",
   description: "",
   target: 5,
   source_key: "",
   current: 0,
   house: "",
};

const yearOptions = [1, 2, 3, 4, 5, 6, 7].map((year) => ({
   value: year,
   label: `Ano ${year}`,
}));

const typeOptions = goalTypes
   .filter((type) => ["spell", "potion", "attribute"].includes(type.value))
   .map((type) => ({ value: type.value, label: type.label }));

const houseOptions = [
   { value: "", label: "Todas as casas" },
   { value: "Grifinória", label: "Grifinória" },
   { value: "Corvinal", label: "Corvinal" },
   { value: "Sonserina", label: "Sonserina" },
   { value: "Lufa-Lufa", label: "Lufa-Lufa" },
];

const normalizeText = (value) =>
   String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

const getDefaultGoalForOption = ({ type, year, sourceKey, title }) => {
   return defaultGoals.find((goal) => {
      return (
         goal.type === type &&
         Number(goal.year) === Number(year) &&
         (goal.source_key === sourceKey || normalizeText(goal.title) === normalizeText(title))
      );
   });
};

const getCatalogMasteryTarget = (item) => {
   const target = item?.attributes?.maestria_required ?? item?.attributes?.mastery_required ?? item?.attributes?.required_mastery;
   return Number(target || 0);
};

const sortOptionsByLabel = (options) => {
   return [...options].sort((a, b) => a.label.localeCompare(b.label));
};

const mergeDefaultOptions = ({ options, type, year }) => {
   const existingKeys = new Set(options.flatMap((option) => [option.value, normalizeText(option.title), normalizeText(option.label)]));
   const extraOptions = defaultGoals
      .filter((goal) => goal.type === type && Number(goal.year) === Number(year))
      .filter((goal) => !existingKeys.has(goal.source_key) && !existingKeys.has(normalizeText(goal.title)))
      .map((goal) => ({
         value: goal.source_key || goal.title,
         label: goal.title,
         title: goal.title,
         target: Number(goal.target || 5),
         description: goal.description || "Meta padrão.",
      }));

   return sortOptionsByLabel([...options, ...extraOptions]);
};

const buildSpellOptions = (year) => {
   const seen = new Set();

   const options = getSpells()
      .map((spell) => {
            const title = getSpellName(spell);
            const defaultGoal = getDefaultGoalForOption({
               type: "spell",
               year,
               sourceKey: spell.id,
               title,
            });
            const target = defaultGoal?.target ?? getCatalogMasteryTarget(spell);

            return {
               value: spell.id,
               label: title,
               title,
               target: Number(target || 5),
               description: defaultGoal?.description || spell.attributes?.effect || "Meta padrão de feitiço.",
            };
         })
      .filter((option) => {
         if (seen.has(option.value)) return false;
         seen.add(option.value);
         return true;
      });

   return mergeDefaultOptions({ options, type: "spell", year });
};

const buildPotionOptions = (year) => {
   const seen = new Set();

   const options = getPotionsList()
      .map((potion) => {
            const title = getPotionDisplayName(potion) || potion.attributes?.name || "Poção";
            const defaultGoal = getDefaultGoalForOption({
               type: "potion",
               year,
               sourceKey: potion.id,
               title,
            });
            const target = defaultGoal?.target ?? getCatalogMasteryTarget(potion);

            return {
               value: potion.id,
               label: title,
               title,
               target: Number(target || 5),
               description: defaultGoal?.description || potion.attributes?.effect || "Meta padrão de poção.",
            };
         })
      .filter((option) => {
         if (seen.has(option.value)) return false;
         seen.add(option.value);
         return true;
      });

   return mergeDefaultOptions({ options, type: "potion", year });
};

const buildAttributeOptions = (year) => {
   const options = (attributeRules.attributes || []).map((attribute) => {
         const defaultGoal = getDefaultGoalForOption({
            type: "attribute",
            year,
            sourceKey: attribute.name,
            title: attribute.name,
         });

         return {
            value: attribute.name,
            label: attribute.name,
            title: attribute.name,
            target: Number(defaultGoal?.target || 5),
            description: defaultGoal?.description || attribute.description || "Meta padrão de atributo.",
         };
      });

   return mergeDefaultOptions({ options, type: "attribute", year });
};


const GoalSearchSelect = ({ value, options, onChange, placeholder, type }) => {
   const wrapperRef = useRef(null);
   const selectedOption = options.find((option) => option.value === value);
   const [search, setSearch] = useState(selectedOption?.label || "");
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
      const nextOption = options.find((option) => option.value === value);
      setSearch(nextOption?.label || "");
   }, [value, options]);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const filteredOptions = useMemo(() => {
      const normalizedSearch = normalizeText(search);
      if (!normalizedSearch) return options;

      return options.filter((option) => {
         const searchable = normalizeText(`${option.label} ${option.description || ""}`);
         return searchable.includes(normalizedSearch);
      });
   }, [options, search]);

   const handleSelect = (option) => {
      setSearch(option.label);
      setIsOpen(false);
      onChange(option.value);
   };

   return (
      <div ref={wrapperRef} className="relative">
         <input
            type="text"
            value={search}
            onChange={(event) => {
               setSearch(event.target.value);
               setIsOpen(true);
               if (value) onChange("");
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="h-10 w-full border border-white/10 bg-white/10 px-4 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400/60 focus:bg-white/15"
         />

         {isOpen ? (
            <div className="absolute left-0 right-0 top-11 z-50 max-h-72 overflow-y-auto border border-white/10 bg-[#21002b] shadow-2xl">
               {filteredOptions.length ? (
                  filteredOptions.map((option) => (
                     <button
                        key={option.value}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelect(option)}
                        className="flex w-full flex-col border-b border-white/5 px-4 py-3 text-left text-xs transition hover:bg-white/10"
                     >
                        <span className="text-white">{option.label}</span>
                        <span className="mt-1 text-[11px] text-[#736868]">
                           {type === "attribute" ? "Atributo" : type === "potion" ? "Poção" : "Feitiço"} • meta {option.target || 5}
                        </span>
                     </button>
                  ))
               ) : (
                  <div className="px-4 py-4 text-xs text-[#736868]">Nenhum registro encontrado.</div>
               )}
            </div>
         ) : null}
      </div>
   );
};

const GoalFormModal = ({ open, onClose, onSave, isSaving, initialYear }) => {
   const [form, setForm] = useState({ ...emptyForm, year: initialYear || 1 });

   useEffect(() => {
      if (open) setForm({ ...emptyForm, year: initialYear || 1 });
   }, [open, initialYear]);

   const goalOptions = useMemo(() => {
      if (form.type === "spell") return buildSpellOptions(form.year);
      if (form.type === "potion") return buildPotionOptions(form.year);
      if (form.type === "attribute") return buildAttributeOptions(form.year);
      return [];
   }, [form.type, form.year]);

   const applyGoalOption = (sourceKey, currentForm = form) => {
      const selectedOption = goalOptions.find((option) => option.value === sourceKey);

      setForm({
         ...currentForm,
         source_key: sourceKey,
         title: selectedOption?.title || "",
         description: selectedOption?.description || "",
         target: selectedOption?.target || currentForm.target || 5,
      });
   };

   const updateForm = (key, value) => {
      setForm((current) => ({ ...current, [key]: value }));
   };

   const handleYearChange = (year) => {
      setForm((current) => ({
         ...current,
         year: Number(year),
         title: "",
         description: "",
         source_key: "",
         target: 5,
      }));
   };

   const handleTypeChange = (type) => {
      setForm((current) => ({
         ...current,
         type,
         title: "",
         description: "",
         source_key: "",
         target: 5,
         house: type === "attribute" ? current.house : "",
      }));
   };

   const handleSubmit = (event) => {
      event.preventDefault();
      onSave({
         ...form,
         year: Number(form.year),
         target: Number(form.target),
         current: Number(form.current || 0),
      });
   };

   return (
      <Modal isOpen={open} onClose={onClose} title="Registrar nova meta">
         <form onSubmit={handleSubmit} className="space-y-4 text-xs text-white">
            <div className="grid grid-cols-2 gap-3">
               <label className="space-y-1">
                  <span className="text-purple-100/70">Ano</span>
                  <CustomSelect value={Number(form.year)} options={yearOptions} onChange={handleYearChange} />
               </label>

               <label className="space-y-1">
                  <span className="text-purple-100/70">Tipo</span>
                  <CustomSelect value={form.type} options={typeOptions} onChange={handleTypeChange} />
               </label>
            </div>

            <label className="block space-y-1">
               <span className="text-purple-100/70">Nome da meta</span>
               <GoalSearchSelect
                  value={form.source_key}
                  options={goalOptions}
                  onChange={applyGoalOption}
                  type={form.type}
                  placeholder={form.type === "attribute" ? "Buscar atributo..." : form.type === "potion" ? "Buscar poção..." : "Buscar feitiço..."}
               />
            </label>

            <label className="block space-y-1">
               <span className="text-purple-100/70">Descrição</span>
               <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  rows={3}
                  className="w-full border border-white/10 bg-white/10 px-3 py-2 outline-none placeholder:text-white/30"
                  placeholder="O que precisa ser feito para concluir essa meta."
               />
            </label>

            <div className="grid grid-cols-2 gap-3">
               <label className="space-y-1">
                  <span className="text-purple-100/70">Meta de maestria / nível</span>
                  <input
                     type="number"
                     min="1"
                     value={form.target}
                     onChange={(event) => updateForm("target", event.target.value)}
                     required
                     className="h-10 w-full border border-white/10 bg-white/10 px-3 outline-none"
                  />
               </label>

               <label className="space-y-1">
                  <span className="text-purple-100/70">Chave do registro</span>
                  <input
                     value={form.source_key}
                     readOnly
                     className="h-10 w-full border border-white/10 bg-white/5 px-3 text-white/50 outline-none"
                     placeholder="ID do feitiço, poção ou nome do atributo"
                  />
               </label>
            </div>

            {form.type === "attribute" && (
               <label className="block space-y-1">
                  <span className="text-purple-100/70">Casa</span>
                  <CustomSelect value={form.house} options={houseOptions} onChange={(value) => updateForm("house", value)} />
               </label>
            )}

            <div className="flex justify-end gap-2 pt-2">
               <button type="button" onClick={onClose} className="h-10 bg-white/10 px-4 text-white/70 transition hover:bg-white/20">
                  Cancelar
               </button>
               <button disabled={isSaving || !form.source_key} className="h-10 bg-yellow-400 px-4 font-semibold text-[#2b0038] transition hover:bg-yellow-300 disabled:opacity-50">
                  {isSaving ? "Salvando..." : "Salvar meta"}
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default GoalFormModal;
