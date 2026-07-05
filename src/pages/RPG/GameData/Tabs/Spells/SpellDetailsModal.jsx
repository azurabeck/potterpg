import { useEffect, useMemo, useState } from "react";
import {
   CheckIcon,
   CodeBracketSquareIcon,
   PencilSquareIcon,
   StarIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import {
   buildEditableSpellConfig,
   buildSpellPayloadFromForm,
   getSpellCardImage,
   getSpellClass,
   getSpellLearningYear,
   getSpellName,
   getSpellMasteryEffects,
   normalizeSpellJsonPayload,
} from "./helpers";
import { attributeOptions, levelOptions } from "./json-files/constants";

const panelClass = "border border-white/10 bg-[#17001e]/70";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400/80";
const labelClassWhite = "text-[10px] font-semibold uppercase tracking-[0.2em] text-white";
const valueClass = "mt-1 whitespace-pre-wrap text-xs leading-5 text-purple-100/80";
const inputClass = "mt-1 w-full border border-yellow-700/60 bg-[#21002b] px-3 py-2 text-xs leading-5 text-purple-100 outline-none focus:border-yellow-400/80";

const formatValue = (value) => {
   if (value === null || value === undefined || value === "") return "-";
   if (typeof value === "boolean") return value ? "Sim" : "Não";
   return value;
};

const getRequiredValue = (attributes = {}) => Number(attributes.required || 0);

const IconButton = ({ children, onClick, title, disabled, variant = "ghost" }) => {
   const variants = {
      ghost: "text-purple-200 hover:bg-white/10 hover:text-yellow-300",
      save: "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300",
      cancel: "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white",
   };

   return (
      <button
         type="button"
         disabled={disabled}
         onClick={onClick}
         title={title}
         className={`flex h-8 w-8 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
      >
         {children}
      </button>
   );
};

const InfoCard = ({ label, value }) => (
   <div className="min-h-[62px] border border-white/10 bg-[#120016]/45 px-3 py-2 text-center">
      <p className={labelClass}>{label}</p>
      <p className={valueClass}>{formatValue(value)}</p>
   </div>
);

const InfoPill = ({ label, value }) => (
   <div className="flex items-center justify-center gap-2 border border-white/10 bg-[#120016]/45 px-3 py-2 rounded-full">
      <p className={labelClass}>{label}</p>
      <p className={labelClass}>{formatValue(value)}</p>
   </div>
);

const InfoPillSolid = ({ label, value }) => (
   <div className="flex items-center justify-center gap-2 border border-white/10 bg-orange-400/70 px-3 py-2 rounded-full">
      <p className={labelClassWhite}>{label}</p>
      <p className={labelClassWhite}>{formatValue(value)}</p>
   </div>
);

const InfoText = ({ value }) => (
   <div className="px-3 py-2 text-center rounded-full">
      <p className={labelClass}>{formatValue(value)}</p>
   </div>
);

const TextBlock = ({ label, value }) => (
   <div className="space-y-2">
      <p className={labelClass}>{label}</p>
      <div className="min-h-28 border border-yellow-700/45 bg-[#21002b]/40 p-3 text-xs leading-6 text-purple-100/75">
         {formatValue(value)}
      </div>
   </div>
);

const FormField = ({ label, value, onChange, type = "text", options, textarea = false, rows = 3 }) => (
   <label className="block">
      <span className={labelClass}>{label}</span>

      {options ? (
         <select
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            className={`${inputClass} h-9 py-0`}
         >
            <option value="">-</option>
            {options.map((option) => (
               <option key={option} value={option}>
                  {option}
               </option>
            ))}
         </select>
      ) : textarea ? (
         <textarea
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            rows={rows}
            className={`${inputClass} resize-y`}
         />
      ) : (
         <input
            type={type}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            className={`${inputClass} h-9 py-0`}
         />
      )}
   </label>
);

const SpellCardPreview = ({ spell, savedData }) => {
   const cardImage = getSpellCardImage({ spell, savedData });
   const name = getSpellName(spell);

   return (
      <aside className="flex h-full min-h-0 overflow-hidden border-l border-white/10 bg-[#120016]/35 p-4">
         <div className="flex h-full w-full min-h-0 items-center justify-center overflow-hidden">
            <div className="aspect-[1054/1492] h-full max-h-full overflow-hidden rounded border border-yellow-700/70 bg-black/35 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
               {cardImage ? (
                  <img
                     src={cardImage}
                     alt={`Carta de ${name}`}
                     className="h-full w-full object-cover"
                  />
               ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center border border-dashed border-white/15 bg-gradient-to-br from-[#21002b] via-[#32003f] to-[#120016] p-8 text-center">
                     <p className="text-[11px] uppercase tracking-[0.24em] text-yellow-400/70">
                        Sem carta
                     </p>
                     <p className="mt-4 text-xs leading-5 text-purple-100/55">
                        Adicione a imagem da carta pelo botão <strong>Imagem</strong> no álbum.
                     </p>
                  </div>
               )}
            </div>
         </div>
      </aside>
   );
};

const MasteryEffectsView = ({ effects }) => {
   const fallback = [
      { from: 1, to: 4, label: "Maestria 1–4", value: "-", description: "" },
      { from: 5, to: 9, label: "Maestria 5–9", value: "-", description: "" },
      { from: 10, to: 10, label: "Maestria 10", value: "-", description: "" },
   ];
   const visibleEffects = effects?.length ? effects : fallback;

   return (
      <div className="space-y-2">
         <p className={labelClass}>Efeito por maestria</p>
         <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {visibleEffects.map((effect, index) => (
               <div
                  key={`${effect.label}-${index}`}
                  className="min-h-24 border border-yellow-700/60 bg-[#120016]/70 p-3 text-center"
               >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                     Maestria {effect.from ?? "-"}{effect.to ? `–${effect.to}` : ""}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-purple-100">
                     {effect.value || "-"}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-yellow-300">
                     {effect.label || "Efeito"}
                  </p>
                  {effect.description ? (
                     <p className="mt-2 text-[11px] leading-5 text-purple-100/60">
                        {effect.description}
                     </p>
                  ) : null}
               </div>
            ))}
         </div>
      </div>
   );
};

const RequiredInfo = ({ attributes }) => {
   const required = getRequiredValue(attributes);

   return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[90px_1fr_1fr]">
         <div className="flex min-h-[62px] items-center justify-center border border-white/10 bg-[#120016]/45">
            {required > 0 ? (
               <StarIcon className="h-5 w-5 fill-yellow-300 text-yellow-300" />
            ) : (
               <span className="text-xs text-purple-100/30">-</span>
            )}
         </div>
         <InfoCard label="Obrigatório" value={required} />
         <InfoCard label="Maestria obrigatória" value={attributes.maestria_required || 0} />
      </div>
   );
};

const SpellReadView = ({ spell, onEdit, onJson }) => {
   const attributes = spell?.attributes || {};
   const masteryEffects = getSpellMasteryEffects(spell);

   return (
      <section className="space-y-5">
         <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
               <h3 className="text-lg font-semibold text-white">
                  {getSpellName(spell)}
               </h3>
            </div>
            <div className="flex items-center gap-2">
               <IconButton onClick={onEdit} title="Editar campos">
                  <PencilSquareIcon className="h-4 w-4" />
               </IconButton>
               <IconButton onClick={onJson} title="Editar JSON">
                  <CodeBracketSquareIcon className="h-4 w-4" />
               </IconButton>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <InfoPillSolid label="Ano" value={getSpellLearningYear(spell)} /> 
            <InfoText label="Aula" value={getSpellClass(spell)} />
         </div>

         <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
            <InfoPill value={attributes.attribute} />
            <InfoPill value={attributes.range} />
            <InfoPill value={attributes.casting_time} />
            <InfoPill value={attributes.concentration} />
            <InfoPill value={attributes.nivel} />
            <InfoPill label="XP total" value={attributes.xp_total} />
         </div>

         <RequiredInfo attributes={attributes} />

         <MasteryEffectsView effects={masteryEffects} />

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextBlock label="Detalhes" value={attributes.description} />
            <TextBlock label="Efeito" value={attributes.effect} />
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextBlock label="Outros detalhes" value={attributes.limitation} />
            <TextBlock label="Penalidades" value={attributes.penalty} />
         </div>
      </section>
   );
};

const MasteryJsonField = ({ form, updateAttribute }) => (
   <FormField
      label="Efeito por maestria (JSON)"
      value={JSON.stringify(form.attributes.mastery_effects || [], null, 2)}
      textarea
      rows={8}
      onChange={(value) => updateAttribute("mastery_effects", value)}
   />
);

const SpellFormView = ({ form, setForm, onSave, onCancel, saving }) => {
   const updateAttribute = (key, value) => {
      setForm((current) => ({
         ...current,
         attributes: {
            ...current.attributes,
            [key]: value,
         },
      }));
   };

   return (
      <section className="space-y-5">
         <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <FormField
               label="Nome"
               value={form.attributes.name}
               onChange={(value) => updateAttribute("name", value)}
            />
            <div className="flex shrink-0 items-center gap-2 pt-5">
               <IconButton onClick={onSave} title="Salvar" disabled={saving} variant="save">
                  <CheckIcon className="h-4 w-4" />
               </IconButton>
               <IconButton onClick={onCancel} title="Cancelar" disabled={saving} variant="cancel">
                  <XMarkIcon className="h-4 w-4" />
               </IconButton>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <FormField label="Ano" type="number" value={form.attributes.ano_letivo} onChange={(value) => updateAttribute("ano_letivo", value)} />
            <FormField label="Atributo" value={form.attributes.attribute} options={attributeOptions} onChange={(value) => updateAttribute("attribute", value)} />
            <FormField label="Alcance" value={form.attributes.range} onChange={(value) => updateAttribute("range", value)} />
            <FormField label="Tempo de conjuração" value={form.attributes.casting_time} onChange={(value) => updateAttribute("casting_time", value)} />
            <FormField label="Concentração" value={form.attributes.concentration} onChange={(value) => updateAttribute("concentration", value)} />
         </div>

         <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <FormField label="Aula" value={form.attributes.learned_in} onChange={(value) => updateAttribute("learned_in", value)} />
            <FormField label="Nível" value={form.attributes.nivel} options={levelOptions} onChange={(value) => updateAttribute("nivel", value)} />
            <FormField label="XP total" type="number" value={form.attributes.xp_total} onChange={(value) => updateAttribute("xp_total", value)} />
         </div>

         <div className="grid grid-cols-1 gap-3 md:grid-cols-[90px_1fr_1fr]">
            <div className="flex min-h-[62px] items-center justify-center border border-white/10 bg-[#120016]/45">
               {Number(form.attributes.required || 0) > 0 ? (
                  <StarIcon className="h-5 w-5 fill-yellow-300 text-yellow-300" />
               ) : (
                  <span className="text-xs text-purple-100/30">-</span>
               )}
            </div>
            <FormField label="Obrigatório" type="number" value={form.attributes.required} onChange={(value) => updateAttribute("required", value)} />
            <FormField label="Maestria obrigatória" type="number" value={form.attributes.maestria_required} onChange={(value) => updateAttribute("maestria_required", value)} />
         </div>

         <MasteryJsonField form={form} updateAttribute={updateAttribute} />

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Detalhes" value={form.attributes.description} textarea rows={5} onChange={(value) => updateAttribute("description", value)} />
            <FormField label="Efeito" value={form.attributes.effect} textarea rows={5} onChange={(value) => updateAttribute("effect", value)} />
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Outros detalhes" value={form.attributes.limitation} textarea rows={5} onChange={(value) => updateAttribute("limitation", value)} />
            <FormField label="Penalidades" value={form.attributes.penalty} textarea rows={5} onChange={(value) => updateAttribute("penalty", value)} />
         </div>
      </section>
   );
};

const SpellJsonView = ({ jsonDraft, setJsonDraft, jsonError, onSave, onCancel, saving }) => (
   <section className="space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
         <h3 className="text-lg font-semibold text-white">Editar JSON</h3>
         <div className="flex items-center gap-2">
            <IconButton onClick={onSave} title="Salvar" disabled={saving} variant="save">
               <CheckIcon className="h-4 w-4" />
            </IconButton>
            <IconButton onClick={onCancel} title="Cancelar" disabled={saving} variant="cancel">
               <XMarkIcon className="h-4 w-4" />
            </IconButton>
         </div>
      </div>
      <textarea
         value={jsonDraft}
         onChange={(event) => setJsonDraft(event.target.value)}
         rows={30}
         spellCheck={false}
         className="w-full resize-y border border-yellow-700/60 bg-[#120016] p-4 font-mono text-[11px] leading-5 text-purple-100 outline-none focus:border-yellow-400/50"
      />
      {jsonError ? <p className="text-xs text-red-300">{jsonError}</p> : null}
   </section>
);

const SpellDetailsModal = ({
   spell,
   savedData,
   selectedCharacter,
   saving,
   onSaveSpellConfig,
}) => {
   const initialForm = useMemo(() => buildEditableSpellConfig(spell), [spell]);
   const [mode, setMode] = useState("view");
   const [form, setForm] = useState(initialForm);
   const [jsonDraft, setJsonDraft] = useState(JSON.stringify(initialForm, null, 2));
   const [jsonError, setJsonError] = useState("");

   useEffect(() => {
      setForm(initialForm);
      setJsonDraft(JSON.stringify(initialForm, null, 2));
      setJsonError("");
      setMode("view");
   }, [initialForm]);

   const handleSave = async () => {
      try {
         const payload = mode === "json"
            ? normalizeSpellJsonPayload(JSON.parse(jsonDraft), spell)
            : buildSpellPayloadFromForm(form);
         setJsonError("");
         await onSaveSpellConfig(payload);
         setMode("view");
      } catch (error) {
         setJsonError(error?.message || "JSON inválido.");
      }
   };

   const handleCancel = () => {
      setForm(initialForm);
      setJsonDraft(JSON.stringify(initialForm, null, 2));
      setJsonError("");
      setMode("view");
   };

   return (
      <div className="grid h-full min-h-0 overflow-hidden text-xs text-purple-100/80 xl:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
         <section className={`${panelClass} min-h-0 overflow-y-auto p-5 pr-4`}>
            {mode === "view" ? (
               <SpellReadView
                  spell={spell}
                  onEdit={() => setMode("edit")}
                  onJson={() => {
                     setJsonDraft(JSON.stringify(initialForm, null, 2));
                     setMode("json");
                  }}
               />
            ) : null}
            {mode === "edit" ? (
               <SpellFormView
                  form={form}
                  setForm={setForm}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  saving={saving}
               />
            ) : null}
            {mode === "json" ? (
               <SpellJsonView
                  jsonDraft={jsonDraft}
                  setJsonDraft={setJsonDraft}
                  jsonError={jsonError}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  saving={saving}
               />
            ) : null}
         </section>

         <SpellCardPreview spell={spell} savedData={savedData} />
      </div>
   );
};

export default SpellDetailsModal;
