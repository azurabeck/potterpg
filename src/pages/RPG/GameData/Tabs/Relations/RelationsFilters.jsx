import { CodeBracketSquareIcon } from "@heroicons/react/24/outline";
import CustomSelect from "../../../../../components/CustomSelect";
import { relationOptions, sortOptions, typeOptions } from "./constants";

const RelationsFilters = ({
   search,
   typeFilter,
   relationFilter,
   sort,
   setSearch,
   setTypeFilter,
   setRelationFilter,
   setSort,
   relations = [],
   onOpenBulkJsonModal,
}) => {
   const copyAllNpcs = async () => {
      if (!relations.length) return;

      const text = relations
         .map((npc) =>
            [
               `Nome: ${npc.name || ""}`,
               `Tipo: ${npc.tipo || ""}`,
               `Casa: ${npc.house || npc.casa || ""}`,
               `Ano: ${npc.ano ?? ""}`,
               `Relação: ${npc.relacao || ""}`,
               `Confiança: ${npc.confianca ?? ""}`,
               `Amizade: ${npc.amizade ?? ""}`,
               `Características físicas: ${npc.caracteristicas || ""}`,
               `Personalidade: ${npc.personalidade || ""}`,
               `Detalhes: ${npc.detalhes || ""}`,
            ].join("\n")
         )
         .join("\n\n---\n\n");

      await navigator.clipboard.writeText(text);
   };

   return (
      <div className="mb-8 space-y-3 text-xs">
         <div className="grid grid-cols-3 gap-3">
            <CustomSelect value={typeFilter} options={typeOptions} onChange={setTypeFilter} placeholder="Tipo" />
            <CustomSelect value={relationFilter} options={relationOptions} onChange={setRelationFilter} placeholder="Relação" />
            <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="A-B" />
         </div>

         <div className="grid grid-cols-[1fr_auto_auto] gap-3">
            <input
               type="text"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Procurar relação"
               className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-yellow-400"
            />

            <button
               type="button"
               onClick={copyAllNpcs}
               disabled={!relations.length}
               className="border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-xs text-yellow-100 transition hover:bg-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
               Copiar NPCs
            </button>

            <button
               type="button"
               onClick={onOpenBulkJsonModal}
               className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20"
               title="Cadastrar NPCs por JSON"
            >
               <CodeBracketSquareIcon className="h-4 w-4" />
            </button>
         </div>
      </div>
   );
};

export default RelationsFilters;