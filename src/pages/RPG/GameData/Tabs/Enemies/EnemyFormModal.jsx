import { useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import { attributeOptions, difficultyOptions, distanceOptions, enemyTypeOptions } from "./constants";
import { normalizeEnemy } from "./helpers";

const inputClass = "w-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40";
const labelClass = "mb-2 block text-xs text-purple-100/70";
const cardClass = "space-y-3 border border-white/10 bg-white/5 p-4";

const DamageFields = ({ damage, onChange }) => {
   const handleDamageChange = (key, value) => {
      onChange({
         ...(damage || {}),
         [key]: value,
      });
   };

   return (
      <div>
         <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-purple-100/45">Dano contra Tomas</p>
         <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <input value={damage?.partial || ""} onChange={(event) => handleDamageChange("partial", event.target.value)} placeholder="Parcial" className={inputClass} />
            <input value={damage?.normal || ""} onChange={(event) => handleDamageChange("normal", event.target.value)} placeholder="Normal" className={inputClass} />
            <input value={damage?.strong || ""} onChange={(event) => handleDamageChange("strong", event.target.value)} placeholder="Forte" className={inputClass} />
            <input value={damage?.critical || ""} onChange={(event) => handleDamageChange("critical", event.target.value)} placeholder="Crítico" className={inputClass} />
         </div>
      </div>
   );
};

const AttackFields = ({ title, attack, onChange, allowDisable = false }) => {
   const isDisabled = attack === null;

   if (isDisabled) {
      return (
         <div className={cardClass}>
            <div className="flex items-center justify-between gap-3">
               <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">{title}</p>
               {allowDisable ? (
                  <button
                     type="button"
                     onClick={() => onChange(normalizeEnemy({}).secondary_attack)}
                     className="text-[11px] text-yellow-400 transition hover:text-yellow-300"
                  >
                     Adicionar ataque
                  </button>
               ) : null}
            </div>
            <p className="text-xs text-purple-100/45">Este adversário não possui ataque secundário.</p>
         </div>
      );
   }

   return (
      <div className={cardClass}>
         <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">{title}</p>
            {allowDisable ? (
               <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-[11px] text-red-300/80 transition hover:text-red-300"
               >
                  Remover
               </button>
            ) : null}
         </div>

         <div>
            <label className={labelClass}>Nome do ataque</label>
            <input
               value={attack.name || ""}
               onChange={(event) => onChange({ ...attack, name: event.target.value })}
               placeholder="Ex: Presas Cortantes"
               className={inputClass}
            />
         </div>

         <div className="grid gap-3 md:grid-cols-3">
            <div>
               <label className={labelClass}>Atributo</label>
               <CustomSelect
                  value={attack.attribute}
                  options={attributeOptions}
                  onChange={(value) => onChange({ ...attack, attribute: value })}
               />
            </div>

            <div>
               <label className={labelClass}>Valor</label>
               <input
                  type="number"
                  value={attack.attribute_value}
                  onChange={(event) => onChange({ ...attack, attribute_value: Number(event.target.value || 0) })}
                  className={inputClass}
               />
            </div>

            <div>
               <label className={labelClass}>Distância</label>
               <CustomSelect
                  value={attack.distance}
                  options={distanceOptions}
                  onChange={(value) => onChange({ ...attack, distance: value })}
               />
            </div>
         </div>

         <textarea
            value={attack.effect || ""}
            onChange={(event) => onChange({ ...attack, effect: event.target.value })}
            placeholder="Efeito do ataque"
            rows={3}
            className={`${inputClass} resize-none`}
         />

         <DamageFields damage={attack.damage} onChange={(damage) => onChange({ ...attack, damage })} />
      </div>
   );
};

const EnemyFormModal = ({ enemy, onSubmit }) => {
   const [imageError, setImageError] = useState(false);
   const [form, setForm] = useState(() => normalizeEnemy(enemy));

   const handleChange = (key, value) => {
      if (key === "image_url") setImageError(false);
      setForm((current) => ({ ...current, [key]: value }));
   };

   const handleSubmit = () => {
      onSubmit({
         ...(enemy || {}),
         ...form,
         hp: Number(form.hp || 0),
      });
   };

   return (
      <div className="space-y-5 text-xs text-purple-100/80">
         <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="h-[220px] border border-white/10 bg-white/5">
               {form.image_url && !imageError ? (
                  <img
                     src={form.image_url}
                     alt={form.name || "Preview"}
                     className="h-full w-full object-cover"
                     style={{ objectPosition: "center 15%" }}
                     onError={() => setImageError(true)}
                  />
               ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-white/40">
                     {form.image_url ? "Não foi possível carregar essa imagem." : "Preview da imagem"}
                  </div>
               )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
               <div className="md:col-span-2">
                  <label className={labelClass}>Nome</label>
                  <input value={form.name} onChange={(event) => handleChange("name", event.target.value)} className={inputClass} />
               </div>

               <div className="md:col-span-2">
                  <label className={labelClass}>URL da imagem</label>
                  <input type="url" value={form.image_url} onChange={(event) => handleChange("image_url", event.target.value)} placeholder="https://..." className={inputClass} />
               </div>

               <div>
                  <label className={labelClass}>Tipo</label>
                  <CustomSelect value={form.type} options={enemyTypeOptions.filter((item) => item !== "Todos")} onChange={(value) => handleChange("type", value)} />
               </div>

               <div>
                  <label className={labelClass}>Dificuldade</label>
                  <CustomSelect value={form.difficulty} options={difficultyOptions.filter((item) => item !== "Todos")} onChange={(value) => handleChange("difficulty", value)} />
               </div>

               <div>
                  <label className={labelClass}>HP</label>
                  <input type="number" value={form.hp} onChange={(event) => handleChange("hp", Number(event.target.value || 0))} className={inputClass} />
               </div>

               <div>
                  <label className={labelClass}>Local</label>
                  <input value={form.local} onChange={(event) => handleChange("local", event.target.value)} className={inputClass} />
               </div>
            </div>
         </div>

         <div className={cardClass}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">Defesa</p>
            <div className="grid gap-3 md:grid-cols-2">
               <div>
                  <label className={labelClass}>Atributo de defesa</label>
                  <CustomSelect
                     value={form.defense.attribute}
                     options={attributeOptions}
                     onChange={(value) => handleChange("defense", { ...form.defense, attribute: value })}
                  />
               </div>

               <div>
                  <label className={labelClass}>Valor da defesa</label>
                  <input
                     type="number"
                     value={form.defense.attribute_value}
                     onChange={(event) => handleChange("defense", { ...form.defense, attribute_value: Number(event.target.value || 0) })}
                     className={inputClass}
                  />
               </div>
            </div>
         </div>

         <div className="grid gap-4 xl:grid-cols-2">
            <AttackFields title="Ataque principal" attack={form.main_attack} onChange={(value) => handleChange("main_attack", value)} />
            <AttackFields title="Ataque secundário" attack={form.secondary_attack} onChange={(value) => handleChange("secondary_attack", value)} allowDisable />
         </div>

         <div>
            <label className={labelClass}>Características</label>
            <textarea
               value={form.caracteristicas}
               onChange={(event) => handleChange("caracteristicas", event.target.value)}
               placeholder="Características"
               rows={4}
               className={`${inputClass} resize-none`}
            />
         </div>

         <button
            type="button"
            onClick={handleSubmit}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Salvar adversário
         </button>
      </div>
   );
};

export default EnemyFormModal;
