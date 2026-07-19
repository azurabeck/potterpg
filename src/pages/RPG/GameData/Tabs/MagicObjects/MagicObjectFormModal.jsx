import { useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import { effectTypeOptions, emptyMagicObject, locationOptions, rarityOptions, typeOptions } from "./constants";
import { normalizeMagicObject } from "./helpers";

const inputClass = "w-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40";
const labelClass = "mb-2 block text-xs text-purple-100/70";

const MagicObjectFormModal = ({ object, onSubmit }) => {
   const [form, setForm] = useState(() => normalizeMagicObject(object || emptyMagicObject));

   const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));
   const handleRequirementChange = (key, value) => setForm((current) => ({
      ...current,
      requirements: { ...current.requirements, [key]: value },
   }));

   const handleSubmit = () => {
      if (!form.name.trim()) return;
      onSubmit({ ...form, id: object?.id });
   };

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <div className="grid gap-4 md:grid-cols-2">
            <div>
               <label className={labelClass}>Nome</label>
               <input type="text" value={form.name} onChange={(event) => handleChange("name", event.target.value)} placeholder="Nome do objeto mágico" className={inputClass} />
            </div>
            <div>
               <label className={labelClass}>Tipo</label>
               <CustomSelect value={form.type} options={typeOptions.filter((option) => option.value !== "Todos")} onChange={(value) => handleChange("type", value)} />
            </div>
         </div>

         <div className="grid gap-4 md:grid-cols-2">
            <div>
               <label className={labelClass}>Tipo de efeito</label>
               <CustomSelect value={form.effect_type} options={effectTypeOptions.filter((option) => option.value !== "Todos")} onChange={(value) => handleChange("effect_type", value)} />
            </div>
            <div>
               <label className={labelClass}>Raridade</label>
               <CustomSelect value={form.rarity} options={rarityOptions} onChange={(value) => handleChange("rarity", value)} />
            </div>
         </div>

         <div className="grid gap-4 md:grid-cols-2">
            <div>
               <label className={labelClass}>Local de obtenção</label>
               <CustomSelect value={form.location} options={locationOptions.filter((option) => option.value !== "Todos")} onChange={(value) => handleChange("location", value)} />
            </div>
            <div>
               <label className={labelClass}>Preço</label>
               <input type="number" min="0" value={form.price} onChange={(event) => handleChange("price", Number(event.target.value || 0))} placeholder="0" className={inputClass} />
            </div>
         </div>

         <div className="grid gap-4 md:grid-cols-2">
            <div>
               <label className={labelClass}>Duração</label>
               <input type="text" value={form.duration} onChange={(event) => handleChange("duration", event.target.value)} placeholder="Ex.: 3 turnos, permanente..." className={inputClass} />
            </div>
            <div>
               <label className={labelClass}>URL da imagem</label>
               <input type="url" value={form.img_url} onChange={(event) => handleChange("img_url", event.target.value)} placeholder="https://..." className={inputClass} />
            </div>
         </div>

         <div>
            <label className={labelClass}>Efeito</label>
            <textarea value={form.effect} onChange={(event) => handleChange("effect", event.target.value)} placeholder="Efeito mágico do objeto" rows={3} className={`${inputClass} resize-none`} />
         </div>

         <div className="grid gap-4 md:grid-cols-3">
            {["dice1", "dice2", "dice3"].map((field, index) => (
               <div key={field}>
                  <label className={labelClass}>Dado {index + 1}</label>
                  <input type="text" value={form[field]} onChange={(event) => handleChange(field, event.target.value)} placeholder="Ex.: 1D6" className={inputClass} />
               </div>
            ))}
         </div>

         <div className="border border-white/10 bg-white/5 p-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-400/80">Requisitos</p>
            <div className="grid gap-4 md:grid-cols-3">
               <div>
                  <label className={labelClass}>Ano</label>
                  <input type="number" min="1" value={form.requirements.year} onChange={(event) => handleRequirementChange("year", Number(event.target.value || 1))} className={inputClass} />
               </div>
               <div>
                  <label className={labelClass}>Habilidade</label>
                  <input type="text" value={form.requirements.skill} onChange={(event) => handleRequirementChange("skill", event.target.value)} placeholder="Ex.: Poções" className={inputClass} />
               </div>
               <div>
                  <label className={labelClass}>Maestria</label>
                  <input type="number" min="0" value={form.requirements.mastery} onChange={(event) => handleRequirementChange("mastery", Number(event.target.value || 0))} className={inputClass} />
               </div>
            </div>
         </div>

         <div>
            <label className={labelClass}>Detalhes</label>
            <textarea value={form.detalhes} onChange={(event) => handleChange("detalhes", event.target.value)} placeholder="Campo detalhes" rows={4} className={`${inputClass} resize-none`} />
         </div>

         <div>
            <label className={labelClass}>Details</label>
            <textarea value={form.details} onChange={(event) => handleChange("details", event.target.value)} placeholder="Campo details" rows={4} className={`${inputClass} resize-none`} />
         </div>

         <button type="button" onClick={handleSubmit} className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300">
            {object ? "Salvar objeto" : "Adicionar objeto"}
         </button>
      </div>
   );
};

export default MagicObjectFormModal;
