import CustomSelect from "../../../../../components/CustomSelect";
import CopyButton from "@/components/CopyButton";
import { categoryLabels, categoryOptions, sortOptions, statusOptions } from "./constants";

const Side = ({
   search,
   sort,
   statusFilter,
   yearFilter,
   categoryFilter,
   years,
   setSearch,
   setSort,
   setStatusFilter,
   setYearFilter,
   setCategoryFilter,
   onAddMystery,
   onOpenRules,
   onCopyMysteries,
}) => {
   const yearOptions = [
      { value: "", label: "Todos os anos" },
      ...years.map((year) => ({ value: year, label: `Ano ${year}` })),
   ];

   const statusSelectOptions = [
      { value: "", label: "Todos os status" },
      ...statusOptions.map((status) => ({ value: status, label: status })),
   ];

   const categorySelectOptions = [
      { value: "", label: "Todas as categorias" },
      ...categoryOptions.map((category) => ({ value: category, label: categoryLabels[category] || category })),
   ];

   return (
      <aside className="space-y-6 text-xs">
         <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Procurar registro"
            className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/50 focus:ring-1 focus:ring-yellow-400"
         />

         <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="Ordenar registros" />
         <CustomSelect value={categoryFilter} options={categorySelectOptions} onChange={setCategoryFilter} placeholder="Categoria" />
         <CustomSelect value={statusFilter} options={statusSelectOptions} onChange={setStatusFilter} placeholder="Status" />
         <CustomSelect value={yearFilter} options={yearOptions} onChange={setYearFilter} placeholder="Ano" />

         <div className="border-t border-white/20 pt-6 space-y-2">
            <button
               type="button"
               onClick={onAddMystery}
               className="w-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
            >
               Adicionar Registro
            </button>

            <div className="flex gap-2">
               <button
                  type="button"
                  onClick={onOpenRules}
                  className="w-full bg-white/10 px-4 py-2 text-xs text-white/80 transition hover:bg-white/20 hover:text-yellow-400"
               >
                  Ver Regras
               </button>

               <CopyButton
                  getText={onCopyMysteries}
                  title="Copiar registros"
                  className="bg-white/10 px-4 py-2 hover:bg-white/20 hover:text-yellow-400"
               />
            </div>
         </div>
      </aside>
   );
};

export default Side;
