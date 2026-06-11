import CustomSelect from "../../../../../components/CustomSelect";
import { sortOptions, statusOptions } from "./constants";

const Side = ({
   search,
   sort,
   statusFilter,
   yearFilter,
   years,
   setSearch,
   setSort,
   setStatusFilter,
   setYearFilter,
   onAddMystery,
   onOpenRules,
}) => {
   const yearOptions = [
      { value: "", label: "Todos os anos" },
      ...years.map((year) => ({ value: year, label: `Ano ${year}` })),
   ];

   const statusSelectOptions = [
      { value: "", label: "Todos os status" },
      ...statusOptions.map((status) => ({ value: status, label: status })),
   ];

   return (
      <aside className="space-y-6 text-xs">
         <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Procurar mistério"
            className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/50 focus:ring-1 focus:ring-yellow-400"
         />

         <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="Ordenar mistérios" />
         <CustomSelect value={statusFilter} options={statusSelectOptions} onChange={setStatusFilter} placeholder="Status" />
         <CustomSelect value={yearFilter} options={yearOptions} onChange={setYearFilter} placeholder="Ano" />

         <div className="border-t border-white/20 pt-6 space-y-2">
            <button
               type="button"
               onClick={onAddMystery}
               className="w-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
            >
               Adicionar Mistério
            </button>

            <button
               type="button"
               onClick={onOpenRules}
               className="w-full bg-white/10 px-4 py-2 text-xs text-white/80 transition hover:bg-white/20 hover:text-yellow-400"
            >
               Ver Regras
            </button>
         </div>
      </aside>
   );
};

export default Side;
