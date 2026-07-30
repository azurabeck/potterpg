import { ArrowDownIcon, ArrowUpIcon, ClipboardIcon, CodeBracketSquareIcon } from "@heroicons/react/24/outline";
import CustomSelect from "@/components/CustomSelect";
import { relationOptions, typeOptions } from "./constants";
import { getNpcStudentYear, getNpcYear, getYearOptions } from "./helpers";

const RelationsFilters = ({
   search,
   typeFilter,
   relationFilter,
   yearFilter,
   studentYearFilter,
   sort,
   setSearch,
   setTypeFilter,
   setRelationFilter,
   setYearFilter,
   setStudentYearFilter,
   setSort,
   relations = [],
   onOpenBulkJsonModal,
   onOpenCopyModal,
}) => {
   const yearOptions = getYearOptions(relations, getNpcYear);
   const studentYearOptions = getYearOptions(relations, getNpcStudentYear);

   return (
      <div className="mb-8 space-y-3 text-xs">
         <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <CustomSelect value={typeFilter} options={typeOptions} onChange={setTypeFilter} placeholder="Tipo" />
            <CustomSelect value={relationFilter} options={relationOptions} onChange={setRelationFilter} placeholder="Relação" />
            <CustomSelect value={yearFilter} options={yearOptions} onChange={setYearFilter} placeholder="Ano" />
            <CustomSelect value={studentYearFilter} options={studentYearOptions} onChange={setStudentYearFilter} placeholder="Ano campanha" />
         </div>

         <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3">
            <input
               type="text"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Procurar relação"
               className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-yellow-400"
            />

            <button
               type="button"
               onClick={() => setSort(sort === "name-asc" ? "name-desc" : "name-asc")}
               className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20"
               title={sort === "name-asc" ? "Ordenar Z-A" : "Ordenar A-Z"}
               aria-label={sort === "name-asc" ? "Ordenar Z-A" : "Ordenar A-Z"}
            >
               {sort === "name-asc" ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            </button>

            <button
               type="button"
               onClick={onOpenCopyModal}
               disabled={!relations.length}
               title="Copiar NPCs"
               className="inline-flex items-center justify-center border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-100 transition hover:bg-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
               <ClipboardIcon className="h-4 w-4" />
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
