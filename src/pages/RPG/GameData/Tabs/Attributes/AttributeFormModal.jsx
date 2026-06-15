import { useState } from "react";

const AttributeFormModal = ({ item, type = "talento", onSubmit }) => {
   const [form, setForm] = useState(() => ({
      id: item?.id || "",
      tipo: item?.tipo || type,
      nome: item?.nome || "",
      nivel: String(item?.nivel ?? 0),
      maximo: String(item?.maximo ?? 10),
      descricao: item?.descricao || "",
      vantagem: item?.vantagem || "",
      conhecidoPor: item?.conhecidoPor || "",
      titulo: item?.titulo || "",
   }));

   const handleChange = (key, value) => {
      setForm((current) => ({
         ...current,
         [key]: value,
      }));
   };

   const handleNumberChange = (key, value) => {
      if (!/^\d*$/.test(value)) return;
      handleChange(key, value);
   };

   const handleSubmit = (event) => {
      event.preventDefault();

      if (!form.nome.trim()) return;

      onSubmit(form);
   };

   const isTitle = form.tipo === "titulo";

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1">
               <span className="text-xs text-yellow-400">
                  {isTitle ? "Reputação/Título" : "Talento"}
               </span>

               <input
                  type="text"
                  value={form.nome}
                  onChange={(event) => handleChange("nome", event.target.value)}
                  className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400"
               />
            </label>

            <div className="grid grid-cols-2 gap-3">
               <label className="space-y-1">
                  <span className="text-xs text-yellow-400">Nível</span>

                  <input
                     type="text"
                     value={form.nivel}
                     onChange={(event) => handleNumberChange("nivel", event.target.value)}
                     className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>

               <label className="space-y-1">
                  <span className="text-xs text-yellow-400">Máximo</span>

                  <input
                     type="text"
                     value={form.maximo}
                     onChange={(event) => handleNumberChange("maximo", event.target.value)}
                     className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>
            </div>
         </div>

         {isTitle ? (
            <>
               <label className="space-y-1">
                  <span className="text-xs text-yellow-400">Conhecido por</span>

                  <textarea
                     value={form.conhecidoPor}
                     onChange={(event) => handleChange("conhecidoPor", event.target.value)}
                     rows={4}
                     className="w-full resize-none bg-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>

               <label className="space-y-1">
                  <span className="text-xs text-yellow-400">Título</span>

                  <input
                     type="text"
                     value={form.titulo}
                     onChange={(event) => handleChange("titulo", event.target.value)}
                     className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>
            </>
         ) : (
            <>
               <label className="space-y-1">
                  <span className="text-xs text-yellow-400">Descrição</span>

                  <textarea
                     value={form.descricao}
                     onChange={(event) => handleChange("descricao", event.target.value)}
                     rows={4}
                     className="w-full resize-none bg-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>

               <label className="space-y-1">
                  <span className="text-xs text-yellow-400">Vantagem</span>

                  <textarea
                     value={form.vantagem}
                     onChange={(event) => handleChange("vantagem", event.target.value)}
                     rows={3}
                     className="w-full resize-none bg-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>
            </>
         )}

         <div className="flex justify-end">
            <button
               type="submit"
               className="bg-yellow-400 px-5 py-2 text-xs text-[#2b0038] transition hover:bg-yellow-300"
            >
               Salvar
            </button>
         </div>
      </form>
   );
};

export default AttributeFormModal;