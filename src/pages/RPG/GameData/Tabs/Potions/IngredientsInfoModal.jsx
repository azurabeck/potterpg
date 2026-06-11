import { useRef, useState } from "react";
import {
   EyeIcon,
   PencilSquareIcon,
   PlusIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";

const emptyIngredient = {
   name: "",
   drop: "",
   shop: "",
   value: "",
};

const IngredientsInfoModal = ({ ingredientsInfo, setIngredientsInfo }) => {
   const formRef = useRef(null);

   const hasSavedIngredients = ingredientsInfo.some(
      (ingredient) => ingredient.name || ingredient.drop || ingredient.shop || ingredient.value
   );

   const [form, setForm] = useState(emptyIngredient);
   const [editingIndex, setEditingIndex] = useState(null);
   const [showForm, setShowForm] = useState(!hasSavedIngredients);

   const filledIngredients = ingredientsInfo
    .map((ingredient, originalIndex) => ({ ...ingredient, originalIndex }))
    .filter((ingredient) => ingredient.name || ingredient.drop || ingredient.shop || ingredient.value);

   const handleFormChange = (key, value) => {
      setForm((currentForm) => ({ ...currentForm, [key]: value }));
   };

   const resetForm = () => {
      setForm(emptyIngredient);
      setEditingIndex(null);
   };

   const scrollToForm = () => {
      setTimeout(() => {
         formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
   };

   const handleSubmit = () => {
      const hasValue = form.name || form.drop || form.shop || form.value;
      if (!hasValue) return;

      if (editingIndex !== null) {
         setIngredientsInfo((current) =>
            current.map((ingredient, index) => index === editingIndex ? form : ingredient)
         );
         resetForm();
         setShowForm(false);
         return;
      }

      setIngredientsInfo((current) => [...current, form]);
      resetForm();
      setShowForm(false);
   };

   const handleEdit = (index) => {
      setForm(ingredientsInfo[index]);
      setEditingIndex(index);
      setShowForm(true);
      scrollToForm();
   };

   const handleRemove = (index) => {
      setIngredientsInfo((current) => current.filter((_, currentIndex) => currentIndex !== index));
      if (editingIndex === index) resetForm();
   };

   const handleToggleForm = () => {
      setShowForm((current) => !current);
   };

   return (
      <div className="space-y-7 text-xs text-purple-100/80">
         <div ref={formRef} className="flex items-center justify-between border-b border-white/10 pb-3">
            <p className="uppercase tracking-[0.08em] text-white/70">
               {editingIndex !== null ? "Editar ingrediente" : "Novo ingrediente"}
            </p>

            <button
               type="button"
               onClick={handleToggleForm}
               className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-yellow-400"
               title={showForm ? "Ocultar formulário" : "Mostrar formulário"}
            >
               <EyeIcon className="h-4 w-4" />
            </button>
         </div>

         {showForm ? (
            <>
               <div className="border border-white/10 bg-white/5 p-4">
                  <div className="space-y-3">
                     <input
                        type="text"
                        value={form.name}
                        onChange={(event) => handleFormChange("name", event.target.value)}
                        placeholder="Nome do ingrediente"
                        className="w-full bg-white/10 px-3 py-2 text-xs font-semibold text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
                     />

                     <input
                        type="text"
                        value={form.drop}
                        onChange={(event) => handleFormChange("drop", event.target.value)}
                        placeholder="Onde dropar"
                        className="w-full bg-white/10 px-3 py-2 text-xs font-semibold text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
                     />

                     <input
                        type="text"
                        value={form.shop}
                        onChange={(event) => handleFormChange("shop", event.target.value)}
                        placeholder="Loja"
                        className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
                     />

                     <input
                        type="text"
                        value={form.value}
                        onChange={(event) => handleFormChange("value", event.target.value)}
                        placeholder="Valor"
                        className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
                     />
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button
                     type="button"
                     onClick={handleSubmit}
                     className="flex items-center gap-2 bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
                  >
                     <PlusIcon className="h-4 w-4" />
                     {editingIndex !== null ? "Salvar ingrediente" : "Adicionar ingrediente"}
                  </button>

                  {editingIndex !== null ? (
                     <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 text-xs text-white/60 transition hover:text-white"
                     >
                        Cancelar edição
                     </button>
                  ) : null}
               </div>
            </>
         ) : null}

         <div className="space-y-5 pt-5">
            {filledIngredients.map((ingredient) => (
               <div key={`${ingredient.name}-${ingredient.originalIndex}`} className="relative border-y border-dashed border-white/25 py-4">
                  <div className="mb-4 flex items-center gap-7">
                     <div className="h-px flex-1 border-t border-dashed border-white/25" />
                     <p className="text-center text-[11px] uppercase text-white">
                        {ingredient.name || "Ingrediente sem nome"}
                     </p>
                     <div className="h-px flex-1 border-t border-dashed border-white/25" />
                  </div>

                  <div className="space-y-1 pr-12 text-[11px] leading-4 text-purple-100/70">
                     <p>Drop: {ingredient.drop || "-"}</p>
                     <p>Loja: {ingredient.shop || "-"}</p>
                     <p>Preço: {ingredient.value || "-"}</p>
                  </div>

                  <div className="absolute bottom-4 right-1 flex items-center gap-3">
                     <button
                        type="button"
                        onClick={() => handleEdit(ingredient.originalIndex)}
                        className="text-yellow-400 transition hover:text-yellow-300"
                        title="Editar ingrediente"
                     >
                        <PencilSquareIcon className="h-4 w-4" />
                     </button>

                     <button
                        type="button"
                        onClick={() => handleRemove(ingredient.originalIndex)}
                        className="text-red-300 transition hover:text-red-200"
                        title="Remover ingrediente"
                     >
                        <TrashIcon className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default IngredientsInfoModal;