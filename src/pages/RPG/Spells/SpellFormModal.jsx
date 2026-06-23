import { useState } from "react";
import { SPELL_CATEGORY_OPTIONS } from "./helpers";

const inputClass =
   "w-full border border-white/10 bg-[#21002b] px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-400";

const labelClass = "space-y-1 text-xs font-semibold uppercase tracking-wide text-purple-200";

const SpellFormModal = ({ spell, onClose, onSubmit }) => {
   const [form, setForm] = useState(() => ({
      category: spell?.attributes?.category || "Utilitário",
      effect: spell?.attributes?.effect || "",
      image: spell?.attributes?.image || "",
      incantation: spell?.attributes?.incantation || "",
      light: spell?.attributes?.light || "",
      name: spell?.attributes?.name || "",
      ano_letivo: spell?.attributes?.ano_letivo || 1,
      nivel: spell?.attributes?.nivel || "",
      xp_total: spell?.attributes?.xp_total || 0,
      required: spell?.attributes?.required || 0,
      maestria_required: spell?.attributes?.maestria_required || 0,
      aula: spell?.attributes?.aula || "",
      penalidade_crime_magico: spell?.attributes?.penalidade_crime_magico || 0,
      effect_dice: spell?.attributes?.effect_dice || "",
   }));

   const handleChange = (field, value) => {
      setForm((current) => ({ ...current, [field]: value }));
   };

   const handleSubmit = (event) => {
      event.preventDefault();

      onSubmit({
         ...spell,
         attributes: {
            ...spell.attributes,
            category: form.category,
            effect: form.effect,
            image: form.image || null,
            incantation: form.incantation || null,
            light: form.light || null,
            name: form.name || form.incantation || spell.attributes?.name || "",
            ano_letivo: Number(form.ano_letivo || 1),
            nivel: form.nivel,
            xp_total: Number(form.xp_total || 0),
            required: Number(form.required || 0),
            maestria_required: Number(form.maestria_required || 0),
            aula: form.aula || null,
            penalidade_crime_magico: Number(form.penalidade_crime_magico || 0),
            effect_dice: form.effect_dice || null,
         },
      });
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
         <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-purple-900 bg-[#190020] shadow-2xl">
            <div className="border-b border-purple-900 bg-[#21002b] px-5 py-4">
               <h3 className="text-sm font-semibold text-white">
                  Editar feitiço
               </h3>
               <p className="mt-1 text-xs text-purple-300">
                  Original ID: {spell?.original_id || spell?.id}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label className={labelClass}>
                     Categoria
                     <select
                        value={form.category}
                        onChange={(event) => handleChange("category", event.target.value)}
                        className={inputClass}
                     >
                        {SPELL_CATEGORY_OPTIONS.map((option) => (
                           <option key={option} value={option}>{option}</option>
                        ))}
                     </select>
                  </label>

                  <label className={labelClass}>
                     Nome
                     <input
                        value={form.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Incantation
                     <input
                        value={form.incantation}
                        onChange={(event) => handleChange("incantation", event.target.value)}
                        className={inputClass}
                     />
                  </label>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>
                     Ano letivo
                     <input
                        type="number"
                        value={form.ano_letivo}
                        onChange={(event) => handleChange("ano_letivo", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Nível
                     <input
                        value={form.nivel}
                        onChange={(event) => handleChange("nivel", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Aula
                     <input
                        value={form.aula}
                        onChange={(event) => handleChange("aula", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Dice
                     <input
                        value={form.effect_dice}
                        onChange={(event) => handleChange("effect_dice", event.target.value)}
                        className={inputClass}
                        placeholder="1D6, 1D8..."
                     />
                  </label>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>
                     XP Total
                     <input
                        type="number"
                        value={form.xp_total}
                        onChange={(event) => handleChange("xp_total", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Required
                     <input
                        type="number"
                        value={form.required}
                        onChange={(event) => handleChange("required", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Maestria Req.
                     <input
                        type="number"
                        value={form.maestria_required}
                        onChange={(event) => handleChange("maestria_required", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Penalidade Crime
                     <input
                        type="number"
                        value={form.penalidade_crime_magico}
                        onChange={(event) => handleChange("penalidade_crime_magico", event.target.value)}
                        className={inputClass}
                     />
                  </label>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className={labelClass}>
                     Luz
                     <input
                        value={form.light}
                        onChange={(event) => handleChange("light", event.target.value)}
                        className={inputClass}
                     />
                  </label>

                  <label className={labelClass}>
                     Imagem
                     <input
                        value={form.image}
                        onChange={(event) => handleChange("image", event.target.value)}
                        className={inputClass}
                     />
                  </label>
               </div>

               <label className={labelClass}>
                  Efeito
                  <textarea
                     value={form.effect}
                     onChange={(event) => handleChange("effect", event.target.value)}
                     className={`${inputClass} min-h-32 resize-y normal-case leading-5`}
                  />
               </label>

               <div className="flex justify-end gap-3 border-t border-purple-900 pt-5">
                  <button
                     type="button"
                     onClick={onClose}
                     className="rounded bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                  >
                     Cancelar
                  </button>

                  <button
                     type="submit"
                     className="rounded bg-yellow-400 px-4 py-2 text-sm font-semibold text-[#2b0038] transition hover:bg-yellow-300"
                  >
                     Salvar
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default SpellFormModal;
