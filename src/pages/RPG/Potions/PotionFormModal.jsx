import { useState } from "react";

const inputClass =
   "w-full border border-white/10 bg-[#21002b] px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-400";
const labelClass = "space-y-1 text-xs font-semibold uppercase tracking-wide text-purple-200";

const emptyIngredient = () => ({ value: "", name: "", shop: "", drop: "", note: "" });
const emptyMastery = () => ({ mastery: "", effect: "", recipe: "" });

const PotionFormModal = ({ potion, onClose, onSubmit, isSaving }) => {
   const [form, setForm] = useState(() => ({
      ...potion,
      ingredientes_info: (potion?.ingredientes_info || []).map((item) => ({ ...item })),
      mastery_effect: (potion?.mastery_effect || []).map((item) => ({ ...item })),
      xp_maestria: { ...(potion?.xp_maestria || {}) },
   }));

   const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

   const updateArrayItem = (field, index, key, value) => {
      setForm((current) => ({
         ...current,
         [field]: current[field].map((item, itemIndex) =>
            itemIndex === index ? { ...item, [key]: value } : item
         ),
      }));
   };

   const addArrayItem = (field, factory) => {
      setForm((current) => ({ ...current, [field]: [...current[field], factory()] }));
   };

   const removeArrayItem = (field, index) => {
      setForm((current) => ({
         ...current,
         [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
      }));
   };

   const handleSubmit = (event) => {
      event.preventDefault();
      onSubmit({
         ...form,
         ano: Number(form.ano || 1),
         xp_total: Number(form.xp_total || 0),
         xp_maestria: Object.fromEntries(
            Object.entries(form.xp_maestria || {}).map(([key, value]) => [key, Number(value || 0)])
         ),
      });
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
         <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-purple-900 bg-[#190020] shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-purple-900 bg-[#21002b] px-5 py-4">
               <h3 className="text-sm font-semibold text-white">Editar poção</h3>
               <p className="mt-1 text-xs text-purple-300">Documento: {potion.id}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Nome<input value={form.name || ""} onChange={(e) => handleChange("name", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Ano<input type="number" min="1" max="7" value={form.ano || 1} onChange={(e) => handleChange("ano", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Nível<input value={form.nivel || ""} onChange={(e) => handleChange("nivel", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Aula<input value={form.aula || ""} onChange={(e) => handleChange("aula", e.target.value)} className={inputClass} /></label>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label className={labelClass}>XP Total<input type="number" value={form.xp_total || 0} onChange={(e) => handleChange("xp_total", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Card image URL<input value={form.card_image_url || ""} onChange={(e) => handleChange("card_image_url", e.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Image URL<input value={form.image_url || ""} onChange={(e) => handleChange("image_url", e.target.value)} className={inputClass} /></label>
               </div>

               <label className={labelClass}>Efeito<textarea value={form.effect || ""} onChange={(e) => handleChange("effect", e.target.value)} className={`${inputClass} min-h-24 resize-y normal-case leading-5`} /></label>
               <label className={labelClass}>Preparo<textarea value={form.cooking || ""} onChange={(e) => handleChange("cooking", e.target.value)} className={`${inputClass} min-h-28 resize-y normal-case leading-5`} /></label>

               <section className="space-y-3 border-t border-purple-900 pt-5">
                  <div className="flex items-center justify-between">
                     <h4 className="text-sm font-semibold">XP por maestria</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
                     {Array.from({ length: 10 }, (_, index) => `M${index + 1}`).map((key) => (
                        <label key={key} className={labelClass}>{key}<input type="number" value={form.xp_maestria?.[key] ?? 0} onChange={(e) => setForm((current) => ({ ...current, xp_maestria: { ...current.xp_maestria, [key]: e.target.value } }))} className={inputClass} /></label>
                     ))}
                  </div>
               </section>

               <section className="space-y-4 border-t border-purple-900 pt-5">
                  <div className="flex items-center justify-between">
                     <h4 className="text-sm font-semibold">Ingredientes</h4>
                     <button type="button" onClick={() => addArrayItem("ingredientes_info", emptyIngredient)} className="bg-white/10 px-3 py-2 text-xs hover:bg-white/20">Adicionar ingrediente</button>
                  </div>
                  {form.ingredientes_info.map((ingredient, index) => (
                     <div key={`${ingredient.name}-${index}`} className="grid grid-cols-1 gap-3 border border-white/10 bg-[#21002b]/50 p-4 md:grid-cols-5">
                        <label className={labelClass}>Quantidade<input value={ingredient.value || ""} onChange={(e) => updateArrayItem("ingredientes_info", index, "value", e.target.value)} className={inputClass} /></label>
                        <label className={labelClass}>Nome<input value={ingredient.name || ""} onChange={(e) => updateArrayItem("ingredientes_info", index, "name", e.target.value)} className={inputClass} /></label>
                        <label className={labelClass}>Loja<input value={ingredient.shop || ""} onChange={(e) => updateArrayItem("ingredientes_info", index, "shop", e.target.value)} className={inputClass} /></label>
                        <label className={labelClass}>Drop<input value={ingredient.drop || ""} onChange={(e) => updateArrayItem("ingredientes_info", index, "drop", e.target.value)} className={inputClass} /></label>
                        <div className="flex gap-2"><label className={`${labelClass} flex-1`}>Nota<input value={ingredient.note || ""} onChange={(e) => updateArrayItem("ingredientes_info", index, "note", e.target.value)} className={inputClass} /></label><button type="button" onClick={() => removeArrayItem("ingredientes_info", index)} className="mt-5 px-3 text-xs text-red-300 hover:bg-red-500/10">Remover</button></div>
                     </div>
                  ))}
               </section>

               <section className="space-y-4 border-t border-purple-900 pt-5">
                  <div className="flex items-center justify-between">
                     <h4 className="text-sm font-semibold">Efeitos por maestria</h4>
                     <button type="button" onClick={() => addArrayItem("mastery_effect", emptyMastery)} className="bg-white/10 px-3 py-2 text-xs hover:bg-white/20">Adicionar faixa</button>
                  </div>
                  {form.mastery_effect.map((item, index) => (
                     <div key={`${item.mastery}-${index}`} className="grid grid-cols-1 gap-3 border border-white/10 bg-[#21002b]/50 p-4 md:grid-cols-[140px_1fr_1fr_auto]">
                        <label className={labelClass}>Maestria<input value={item.mastery || ""} onChange={(e) => updateArrayItem("mastery_effect", index, "mastery", e.target.value)} className={inputClass} /></label>
                        <label className={labelClass}>Efeito<textarea value={item.effect || ""} onChange={(e) => updateArrayItem("mastery_effect", index, "effect", e.target.value)} className={`${inputClass} min-h-20 resize-y normal-case`} /></label>
                        <label className={labelClass}>Receita<textarea value={item.recipe || ""} onChange={(e) => updateArrayItem("mastery_effect", index, "recipe", e.target.value)} className={`${inputClass} min-h-20 resize-y normal-case`} /></label>
                        <button type="button" onClick={() => removeArrayItem("mastery_effect", index)} className="self-end px-3 py-2 text-xs text-red-300 hover:bg-red-500/10">Remover</button>
                     </div>
                  ))}
               </section>

               <div className="sticky bottom-0 flex justify-end gap-3 border-t border-purple-900 bg-[#190020] py-4">
                  <button type="button" onClick={onClose} disabled={isSaving} className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50">Cancelar</button>
                  <button type="submit" disabled={isSaving} className="rounded bg-yellow-400 px-4 py-2 text-sm font-semibold text-[#2b0038] hover:bg-yellow-300 disabled:opacity-50">{isSaving ? "Salvando..." : "Salvar no Firestore"}</button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default PotionFormModal;
