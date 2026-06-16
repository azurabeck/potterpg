import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CustomSelect from "../../../../../components/CustomSelect";
import { categoryOptions, clueStatusOptions, emptyClue, emptyMystery, statusOptions } from "./constants";
import { getMysteryCategory } from "./helpers";

const inputClass = "w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400";
const textareaClass = `${inputClass} resize-none`;

const getInitialForm = (mystery) => {
   if (!mystery) return { ...emptyMystery, clues: [{ ...emptyClue }] };

   return {
      ...emptyMystery,
      ...mystery,
      category: getMysteryCategory(mystery.category),
      year: String(mystery.year || "1"),
      next_session: Boolean(mystery.next_session),
      clues: mystery.clues?.length ? mystery.clues.map((clue, index) => ({ ...emptyClue, ...clue, order: clue.order || index + 1 })) : [{ ...emptyClue }],
   };
};

const MysteryFormModal = ({ mystery, onSubmit, isSaving }) => {
   const [form, setForm] = useState(() => getInitialForm(mystery));
   const category = getMysteryCategory(form.category);

   const handleChange = (key, value) => {
      setForm((current) => ({ ...current, [key]: value }));
   };

   const handleCategoryChange = (value) => {
      setForm((current) => ({
         ...current,
         category: value,
         next_session: value === "proxima sessão" ? true : current.next_session,
      }));
   };

   const handleClueChange = (index, key, value) => {
      setForm((current) => ({
         ...current,
         clues: current.clues.map((clue, clueIndex) => clueIndex === index ? { ...clue, [key]: value } : clue),
      }));
   };

   const handleAddClue = () => {
      setForm((current) => ({
         ...current,
         clues: [...current.clues, { ...emptyClue, order: current.clues.length + 1 }],
      }));
   };

   const handleRemoveClue = (index) => {
      setForm((current) => ({
         ...current,
         clues: current.clues.filter((_, clueIndex) => clueIndex !== index).map((clue, clueIndex) => ({ ...clue, order: clueIndex + 1 })),
      }));
   };

   const isFormValid = () => {
      if (category === "pendencias narrador") return Boolean(form.awaited_event?.trim());
      return Boolean(form.name?.trim());
   };

   const handleSubmit = () => {
      if (!isFormValid()) return;
      onSubmit(form);
   };

   return (
      <div className="space-y-6 text-xs text-purple-100/80">
         <div className="grid grid-cols-[1fr_90px_150px] gap-3">
            <CustomSelect
               value={form.category}
               options={categoryOptions}
               onChange={handleCategoryChange}
               placeholder="Categoria"
            />

            <input
               type="text"
               value={form.year}
               onChange={(event) => {
                  if (/^\d*$/.test(event.target.value)) handleChange("year", event.target.value);
               }}
               placeholder="Ano"
               className={inputClass}
            />

            {category === "mistérios" ? (
               <CustomSelect value={form.status} options={statusOptions} onChange={(value) => handleChange("status", value)} placeholder="Status" />
            ) : null}
         </div>

         {category === "proxima sessão" ? (
            <div className="space-y-3">
               <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="Nome"
                  className={inputClass}
               />

               <textarea
                  value={form.details}
                  onChange={(event) => handleChange("details", event.target.value)}
                  placeholder="Detalhes"
                  rows={5}
                  className={textareaClass}
               />

               <label className="flex items-center gap-3 bg-white/5 px-3 py-2 text-white/70">
                  <input
                     type="checkbox"
                     checked={Boolean(form.next_session)}
                     onChange={(event) => handleChange("next_session", event.target.checked)}
                  />
                  Próxima sessão
               </label>
            </div>
         ) : null}

         {category === "pendencias narrador" ? (
            <div className="space-y-3">
               <input
                  type="text"
                  value={form.awaited_event}
                  onChange={(event) => handleChange("awaited_event", event.target.value)}
                  placeholder="Evento Aguardado"
                  className={inputClass}
               />

               <textarea
                  value={form.current_situation}
                  onChange={(event) => handleChange("current_situation", event.target.value)}
                  placeholder="Situação Atual"
                  rows={4}
                  className={textareaClass}
               />

               <input
                  type="text"
                  value={form.responder}
                  onChange={(event) => handleChange("responder", event.target.value)}
                  placeholder="Quem pode responder ao Tomas"
                  className={inputClass}
               />
            </div>
         ) : null}

         {category === "mistérios" ? (
            <>
               <div className="grid grid-cols-[1fr_150px] gap-3">
                  <input
                     type="text"
                     value={form.name}
                     onChange={(event) => handleChange("name", event.target.value)}
                     placeholder="Nome do mistério"
                     className={inputClass}
                  />

                  <CustomSelect value={form.status} options={statusOptions} onChange={(value) => handleChange("status", value)} placeholder="Status" />
               </div>

               <input
                  type="text"
                  value={form.last_appearance}
                  onChange={(event) => handleChange("last_appearance", event.target.value)}
                  placeholder="Última aparição. Ex: Campanha 22 - O Reflexo Dourado"
                  className={inputClass}
               />

               <div className="border-t border-white/10 pt-5">
                  <div className="mb-4 flex items-center justify-between">
                     <p className="uppercase tracking-[0.08em] text-white/70">Pistas</p>

                     <button
                        type="button"
                        onClick={handleAddClue}
                        className="flex items-center gap-2 bg-white/10 px-3 py-2 text-xs text-white/80 transition hover:bg-yellow-400 hover:text-[#2b0038]"
                     >
                        <PlusIcon className="h-4 w-4" />
                        Adicionar pista
                     </button>
                  </div>

                  <div className="space-y-5">
                     {form.clues.map((clue, index) => (
                        <div key={index} className="space-y-3 border border-white/10 bg-white/5 p-4">
                           <div className="flex items-center justify-between gap-3">
                              <p className="text-yellow-400">Pista {index + 1}</p>

                              {form.clues.length > 1 ? (
                                 <button
                                    type="button"
                                    onClick={() => handleRemoveClue(index)}
                                    className="text-red-300 transition hover:text-red-200"
                                    title="Remover pista"
                                 >
                                    <TrashIcon className="h-4 w-4" />
                                 </button>
                              ) : null}
                           </div>

                           <div className="grid grid-cols-[70px_1fr_150px] gap-3">
                              <input
                                 type="text"
                                 value={clue.order}
                                 onChange={(event) => {
                                    if (/^\d*$/.test(event.target.value)) handleClueChange(index, "order", event.target.value);
                                 }}
                                 placeholder="Ordem"
                                 className={inputClass}
                              />

                              <input
                                 type="text"
                                 value={clue.name}
                                 onChange={(event) => handleClueChange(index, "name", event.target.value)}
                                 placeholder="Nome da pista"
                                 className={inputClass}
                              />

                              <CustomSelect
                                 value={clue.status}
                                 options={clueStatusOptions}
                                 onChange={(value) => handleClueChange(index, "status", value)}
                                 placeholder="Status"
                              />
                           </div>

                           <textarea
                              value={clue.question}
                              onChange={(event) => handleClueChange(index, "question", event.target.value)}
                              placeholder="Pergunta levantada pela pista"
                              rows={2}
                              className={textareaClass}
                           />

                           <textarea
                              value={clue.details}
                              onChange={(event) => handleClueChange(index, "details", event.target.value)}
                              placeholder="Detalhes da pista"
                              rows={3}
                              className={textareaClass}
                           />

                           <textarea
                              value={clue.resolution}
                              onChange={(event) => handleClueChange(index, "resolution", event.target.value)}
                              placeholder="Resolução ou teoria atual"
                              rows={3}
                              className={textareaClass}
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </>
         ) : null}

         <button
            type="button"
            disabled={isSaving || !isFormValid()}
            onClick={handleSubmit}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
         >
            {mystery ? "Salvar registro" : "Adicionar registro"}
         </button>
      </div>
   );
};

export default MysteryFormModal;
