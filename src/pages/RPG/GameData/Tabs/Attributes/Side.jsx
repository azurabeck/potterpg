import CopyButton from "@/components/CopyButton";
import CustomSelect from "@/components/CustomSelect";

const typeOptions = [
   { label: "Todos", value: "all" },
   { label: "Atributos", value: "atributo" },
   { label: "Talentos", value: "talento" },
   { label: "Títulos", value: "titulo" },
];

const orderOptions = [
   { label: "Ordem padrão", value: "default" },
   { label: "Nome", value: "name" },
   { label: "Nível", value: "level" },
];

const Side = ({
   search,
   typeFilter,
   orderBy,
   setSearch,
   setTypeFilter,
   setOrderBy,
   onAddTalent,
   onAddTitle,
   onOpenRules,
   onCopyAllAttributes,
}) => {
   return (
      <aside className="space-y-8 text-xs">
         <div className="space-y-4">
            <h3 className="text-yellow-400">Filtrar Atributos</h3>

            <input
               type="text"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Buscar atributo, talento ou título"
               className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/50 focus:ring-1 focus:ring-yellow-400"
            />

            <CustomSelect value={typeFilter} onChange={setTypeFilter} placeholder="Tipo" options={typeOptions} />
            <CustomSelect value={orderBy} onChange={setOrderBy} placeholder="Ordenar por" options={orderOptions} />

            <div className="flex flex-wrap gap-2 border-t border-white/20 pt-[20px]">
               <button
                  type="button"
                  onClick={onAddTalent}
                  className="w-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
               >
                  Adicionar Talento
               </button>

               <button
                  type="button"
                  onClick={onAddTitle}
                  className="w-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
               >
                  Adicionar Título
               </button>

               <div className="flex w-full justify-between gap-2">
                  <button
                     type="button"
                     onClick={onOpenRules}
                     className="bg-white/10 grow-1 px-4 py-2 text-xs text-white/80 transition hover:bg-white/20 hover:text-yellow-400"
                  >
                     Ver Regras
                  </button>

                  <CopyButton
                     getText={onCopyAllAttributes}
                     title="Copiar atributos"
                     className="bg-white/10 px-4 py-2 hover:bg-white/20"
                  />
               </div>
            </div>
         </div>
      </aside>
   );
};

export default Side;
