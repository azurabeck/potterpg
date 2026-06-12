import CustomSelect from "../../../../../components/CustomSelect";
import { relationOptions, sortOptions, typeOptions } from "./constants";

const Side = ({ selectedRelation, search, typeFilter, relationFilter, sort, setSearch, setTypeFilter, setRelationFilter, setSort }) => {
   return (
      <aside className="space-y-3 text-xs">
         <div className="min-h-[350px] bg-white/5">
            {selectedRelation?.image_url ? (
               <img
                  src={selectedRelation.image_url}
                  alt={selectedRelation.name || "NPC"}
                  className="h-[350px] w-full object-cover"
               />
            ) : (
               <div className="flex h-[190px] items-center justify-center border border-white/10 text-center text-purple-100/50">
                  Selecione um personagem
               </div>
            )}
         </div>

         <div className="grid grid-cols-3 gap-3">
            <CustomSelect value={typeFilter} options={typeOptions} onChange={setTypeFilter} placeholder="Tipo" />
            <CustomSelect value={relationFilter} options={relationOptions} onChange={setRelationFilter} placeholder="Relação" />
            <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="A-B" />
         </div>

         <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Procurar relação"
            className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-yellow-400"
         />
      </aside>
   );
};

export default Side;
