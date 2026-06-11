import { PlusIcon } from "@heroicons/react/24/outline";
import { categoryOptions } from "./constants";
import CustomSelect from "../../../../../components/CustomSelect";

const Header = ({
   search,
   categoryFilter,
   inventory,
   moneyDraft,
   setSearch,
   setCategoryFilter,
   setMoneyDraft,
   onAddItem,
   onOpenRules,
   onSaveMoney,
   isSaving,
}) => {
   const handleMoneyChange = (key, value) => {
      if (!/^\d*$/.test(value)) return;
      setMoneyDraft((current) => ({ ...current, [key]: value }));
   };

   const hasMoneyChanged =
      Number(moneyDraft.nuquens || 0) !== Number(inventory.nuquens || 0) ||
      Number(moneyDraft.sicles || 0) !== Number(inventory.sicles || 0) ||
      Number(moneyDraft.goldens || 0) !== Number(inventory.goldens || 0);

   return (
      <aside className="space-y-8 text-xs">
         <div className="space-y-4">
            <h3 className="text-yellow-400">Filtrar Inventário</h3>

            <input
               type="text"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Input search"
               className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/50 focus:ring-1 focus:ring-yellow-400"
            />

            <CustomSelect
               value={categoryFilter}
               onChange={setCategoryFilter}
               placeholder="Select Categorias"
               options={categoryOptions}
            />

            <div className="flex gap-2">
               <button
                  type="button"
                  onClick={onAddItem}
                  className="flex items-center gap-2 bg-white/10 px-4 py-2 text-xs text-white/80 transition hover:bg-yellow-400 hover:text-[#2b0038]"
               >
                  <PlusIcon className="h-4 w-4" />
                  Adicionar Item
               </button>

               <button
                  type="button"
                  onClick={onOpenRules}
                  className="bg-white/10 px-4 py-2 text-xs text-white/80 transition hover:bg-white/20 hover:text-yellow-400"
               >
                  Ver Regras
               </button>
            </div>
         </div>

         <div className="flex items-center justify-between">
            <div className="flex gap-5">
               <label className="text-[#CA3F3F]">
                  <span>Nuques * </span>
                  <input
                     type="text"
                     value={moneyDraft.nuquens}
                     onChange={(event) => handleMoneyChange("nuquens", event.target.value)}
                     className="w-[24px] h-[24px] rounded-full bg-[#DE8383] text-center text-xs text-[#2b0038] outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>

               <label className="text-[#C7C3BE]">
                  <span>Sicles * </span>
                  <input
                     type="text"
                     value={moneyDraft.sicles}
                     onChange={(event) => handleMoneyChange("sicles", event.target.value)}
                     className="w-[24px] h-[24px] rounded-full bg-purple-100/80 text-center text-xs text-[#2b0038] outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>

               <label className="text-[#FFBF10]">
                  <span>Galeões * </span>
                  <input
                     type="text"
                     value={moneyDraft.goldens}
                     onChange={(event) => handleMoneyChange("goldens", event.target.value)}
                     className="w-[24px] h-[24px] rounded-full bg-yellow-400 text-center text-xs text-[#2b0038] outline-none focus:ring-1 focus:ring-yellow-400"
                  />
               </label>
            </div>

            <button
               type="button"
               disabled={!hasMoneyChanged || isSaving}
               onClick={onSaveMoney}
               className={`px-4 py-2 text-xs transition ${
                  hasMoneyChanged && !isSaving
                     ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300"
                     : "bg-white/10 text-white/30"
               }`}
            >
               Salvar moedas
            </button>
         </div>
      </aside>
   );
};

export default Header;
