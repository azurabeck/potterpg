import { useEffect, useState } from "react";
import Modal from "../../../../../components/Modal";
import { goalTypes } from "./defaultGoals";

const emptyForm = {
   year: 1,
   type: "spell",
   title: "",
   description: "",
   target: 5,
   source_key: "",
   current: 0,
};

const GoalFormModal = ({ open, onClose, onSave, isSaving, initialYear }) => {
   const [form, setForm] = useState({ ...emptyForm, year: initialYear || 1 });

   useEffect(() => {
      if (open) setForm({ ...emptyForm, year: initialYear || 1 });
   }, [open, initialYear]);

   const updateForm = (key, value) => {
      setForm((current) => ({ ...current, [key]: value }));
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
      <Modal open={open} onClose={onClose} title="Registrar nova meta">
         <form onSubmit={handleSubmit} className="space-y-4 text-xs text-white">
            <div className="grid grid-cols-2 gap-3">
               <label className="space-y-1">
                  <span className="text-purple-100/70">Ano</span>
                  <select
                     value={form.year}
                     onChange={(event) => updateForm("year", event.target.value)}
                     className="h-10 w-full border border-white/10 bg-white/10 px-3 outline-none"
                  >
                     {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                        <option key={year} value={year}>Ano {year}</option>
                     ))}
                  </select>
               </label>

               <label className="space-y-1">
                  <span className="text-purple-100/70">Tipo</span>
                  <select
                     value={form.type}
                     onChange={(event) => updateForm("type", event.target.value)}
                     className="h-10 w-full border border-white/10 bg-white/10 px-3 outline-none"
                  >
                     {goalTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                     ))}
                  </select>
               </label>
            </div>

            <label className="block space-y-1">
               <span className="text-purple-100/70">Nome da meta</span>
               <input
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  required
                  className="h-10 w-full border border-white/10 bg-white/10 px-3 outline-none placeholder:text-white/30"
                  placeholder="Ex: Expelliarmus"
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

               {form.type === "custom" ? (
                  <label className="space-y-1">
                     <span className="text-purple-100/70">Progresso atual</span>
                     <input
                        type="number"
                        min="0"
                        value={form.current}
                        onChange={(event) => updateForm("current", event.target.value)}
                        className="h-10 w-full border border-white/10 bg-white/10 px-3 outline-none"
                     />
                  </label>
               ) : (
                  <label className="space-y-1">
                     <span className="text-purple-100/70">Chave do registro</span>
                     <input
                        value={form.source_key}
                        onChange={(event) => updateForm("source_key", event.target.value)}
                        className="h-10 w-full border border-white/10 bg-white/10 px-3 outline-none placeholder:text-white/30"
                        placeholder="ID do feitiço, poção ou nome do atributo"
                     />
                  </label>
               )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
               <button type="button" onClick={onClose} className="h-10 bg-white/10 px-4 text-white/70 transition hover:bg-white/20">
                  Cancelar
               </button>
               <button disabled={isSaving} className="h-10 bg-yellow-400 px-4 font-semibold text-[#2b0038] transition hover:bg-yellow-300 disabled:opacity-50">
                  {isSaving ? "Salvando..." : "Salvar meta"}
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default GoalFormModal;
