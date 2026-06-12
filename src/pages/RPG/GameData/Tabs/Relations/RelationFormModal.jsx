import { useState } from "react";
import CustomSelect from "../../../../../components/CustomSelect";
import { relationOptions, typeOptions } from "./constants";

const inputClass = "w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400";
const labelClass = "mb-2 block text-xs text-purple-100/70";

const RelationFormModal = ({ relation, onSubmit }) => {
   const [imageError, setImageError] = useState(false);

   const [form, setForm] = useState(() => ({
      image_url: relation?.image_url || "",
      tipo: relation?.tipo || "Aluno",
      relacao: relation?.relacao || "Conhecido",
      confianca: String(relation?.confianca ?? 0),
      amizade: String(relation?.amizade ?? 0),
      caracteristicas: relation?.caracteristicas || "",
      personalidade: relation?.personalidade || "",
      detalhes: relation?.detalhes || "",
   }));

   const handleChange = (key, value) => {
      if (key === "image_url") setImageError(false);
      setForm((current) => ({ ...current, [key]: value }));
   };

   const handleNumberChange = (key, value) => {
      if (!/^\d*$/.test(value)) return;
      const numberValue = Number(value || 0);
      if (numberValue < 0 || numberValue > 10) return;
      handleChange(key, value);
   };

   const handleSubmit = () => {
      onSubmit({
         ...relation,
         ...form,
         confianca: Number(form.confianca || 0),
         amizade: Number(form.amizade || 0),
      });
   };

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="h-[220px] border border-white/10 bg-white/5">
               {form.image_url && !imageError ? (
                  <img
                     src={form.image_url}
                     alt={relation?.name || "Preview"}
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

            <div>
               <label className={labelClass}>URL da imagem</label>
               <input
                  type="url"
                  value={form.image_url}
                  onChange={(event) => handleChange("image_url", event.target.value)}
                  placeholder="https://..."
                  className={inputClass}
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div>
               <label className={labelClass}>Tipo</label>
               <CustomSelect value={form.tipo} options={typeOptions.filter((item) => item !== "Todos")} onChange={(value) => handleChange("tipo", value)} />
            </div>

            <div>
               <label className={labelClass}>Relação</label>
               <CustomSelect value={form.relacao} options={relationOptions.filter((item) => item !== "Todos")} onChange={(value) => handleChange("relacao", value)} />
            </div>

            <div>
               <label className={labelClass}>Confiança</label>
               <input type="text" value={form.confianca} onChange={(event) => handleNumberChange("confianca", event.target.value)} className={inputClass} />
            </div>

            <div>
               <label className={labelClass}>Amizade</label>
               <input type="text" value={form.amizade} onChange={(event) => handleNumberChange("amizade", event.target.value)} className={inputClass} />
            </div>
         </div>

         <textarea value={form.caracteristicas} onChange={(event) => handleChange("caracteristicas", event.target.value)} placeholder="Características" rows={3} className={`${inputClass} resize-none`} />
         <textarea value={form.personalidade} onChange={(event) => handleChange("personalidade", event.target.value)} placeholder="Personalidade" rows={3} className={`${inputClass} resize-none`} />
         <textarea value={form.detalhes} onChange={(event) => handleChange("detalhes", event.target.value)} placeholder="Detalhes" rows={4} className={`${inputClass} resize-none`} />

         <button
            type="button"
            onClick={handleSubmit}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Salvar relação
         </button>
      </div>
   );
};

export default RelationFormModal;