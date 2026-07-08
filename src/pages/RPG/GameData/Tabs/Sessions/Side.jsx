import CustomSelect from "@/components/CustomSelect";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { sortOptions } from "./constants";

const Side = ({
   search,
   sort,
   campaignYearFilter,
   campaignYearOptions,
   jsonValue,
   error,
   isSaving,
   setSearch,
   setSort,
   setCampaignYearFilter,
   setJsonValue,
   onRegisterSession,
   onOpenModel,
   onOpenCopyModal,
}) => {
   return (
      <aside className="space-y-6 text-xs">
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <input
               type="text"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Procurar Sessão"
               className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/50 focus:ring-1 focus:ring-yellow-400"
            />

            <CustomSelect
               value={campaignYearFilter}
               options={campaignYearOptions}
               onChange={setCampaignYearFilter}
               placeholder="Ano da campanha"
            />
         </div>

         <CustomSelect
            value={sort}
            options={sortOptions}
            onChange={setSort}
            placeholder="Ordenar campanhas"
         />

         <div className="border-t border-white/20 pt-6">
            <textarea
               value={jsonValue}
               onChange={(event) => setJsonValue(event.target.value)}
               placeholder="Adicionar Json"
               rows={7}
               className="w-full resize-none bg-white/10 px-3 py-3 font-mono text-xs text-white outline-none placeholder:text-white/50 focus:ring-1 focus:ring-yellow-400"
            />

            {error ? <p className="mt-2 text-red-300">{error}</p> : null}

            <div className="mt-2 flex gap-2">
               <button
                  type="button"
                  disabled={isSaving}
                  onClick={onRegisterSession}
                  className="flex-1 bg-white/10 px-4 py-2 text-xs text-white/80 transition hover:bg-yellow-400 hover:text-[#2b0038] disabled:cursor-not-allowed disabled:opacity-40"
               >
                  Registrar Sessão
               </button>

               <button
                  type="button"
                  onClick={onOpenModel}
                  className="bg-white/10 px-4 py-2 text-xs text-white/80 transition hover:bg-white/20 hover:text-yellow-400"
               >
                  Ver Modelo
               </button>

               <button
                  type="button"
                  onClick={onOpenCopyModal}
                  title="Copiar campanhas"
                  className="inline-flex items-center justify-center bg-white/10 px-4 py-2 text-white/80 transition hover:bg-white/20 hover:text-yellow-400"
               >
                  <ClipboardIcon className="h-4 w-4" />
               </button>
            </div>
         </div>
      </aside>
   );
};

export default Side;
