import { useState } from "react";
import CustomSelect from "../../../../../components/CustomSelect";
import { attributeOptions, categoryOptions, emptyItem } from "./constants";

const ItemFormModal = ({ item, onSubmit }) => {
   const [form, setForm] = useState(() => (item ? { ...emptyItem, ...item } : emptyItem));

   const handleChange = (key, value) => {
      setForm((current) => ({ ...current, [key]: value }));
   };

   const handleSubmit = () => {
      if (!form.nome.trim()) return;
      onSubmit(form);
   };

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <CustomSelect
            value={form.categoria}
            options={categoryOptions}
            onChange={(value) => handleChange("categoria", value)}
            placeholder="Categoria"
         />

         <input
            type="text"
            value={form.nome}
            onChange={(event) => handleChange("nome", event.target.value)}
            placeholder="Nome do item"
            className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <input
            type="text"
            value={form.quantidade}
            onChange={(event) => {
               if (/^\d*$/.test(event.target.value)) handleChange("quantidade", event.target.value);
            }}
            placeholder="Quantidade"
            className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <CustomSelect
            value={form.atributo}
            options={["", ...attributeOptions].map((attribute) => ({
               value: attribute,
               label: attribute || "Sem atributo",
            }))}
            onChange={(value) => handleChange("atributo", value)}
            placeholder="Sem atributo"
         />

         <input
            type="text"
            value={form.valor_atributo}
            onChange={(event) => {
               if (/^-?\d*$/.test(event.target.value)) handleChange("valor_atributo", event.target.value);
            }}
            placeholder="Valor do atributo"
            className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <textarea
            value={form.onde_encontrou}
            onChange={(event) => handleChange("onde_encontrou", event.target.value)}
            placeholder="Onde encontrou"
            rows={3}
            className="w-full resize-none bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <textarea
            value={form.detalhes || ""}
            onChange={(event) => handleChange("detalhes", event.target.value)}
            placeholder="Detalhes"
            rows={4}
            className="w-full resize-none bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <button
            type="button"
            onClick={handleSubmit}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            {item ? "Salvar item" : "Adicionar item"}
         </button>
      </div>
   );
};

export default ItemFormModal;