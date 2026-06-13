import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import RelationsFilters from "./RelationsFilters";

const Table = ({
   relations,
   selectedRelationId,
   onSelectRelation,
   onEditRelation,
   onDeleteRelation,
   search,
   typeFilter,
   relationFilter,
   sort,
   setSearch,
   setTypeFilter,
   setRelationFilter,
   setSort,
   allRelations,
   onOpenBulkJsonModal,
}) => {
   return (
      <div className="relative min-h-[310px] pr-10 text-xs border-e border-dashed border-white/25">
         <div className="sticky top-0 self-start">
            <RelationsFilters
               search={search}
               typeFilter={typeFilter}
               relationFilter={relationFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setRelationFilter={setRelationFilter}
               setSort={setSort}
               relations={allRelations}
               onOpenBulkJsonModal={onOpenBulkJsonModal}
            />
         </div>

         {relations.length ? (
            <div className="space-y-4">
               {relations.map((relation) => {
                  const isSelected = selectedRelationId === relation.id;

                  return (
                     <section key={relation.id}>
                        <div className="grid grid-cols-[minmax(160px,1fr)_28px_28px] items-center gap-2">
                           <button
                              type="button"
                              onClick={() => onSelectRelation(relation)}
                              className={`flex items-center text-left transition ${
                                 isSelected ? "text-yellow-400" : "text-[#9d564c] hover:text-yellow-400"
                              }`}
                           >
                              <span className="line-clamp-1">{relation.name || "NPC sem nome"}</span>
                              <span className="mx-3 flex-1 border-t border-dashed border-purple-100/20" />
                           </button>

                           <button
                              type="button"
                              onClick={() => onEditRelation(relation)}
                              className="text-yellow-400/70 transition hover:text-yellow-400"
                              title="Editar NPC"
                           >
                              <PencilSquareIcon className="h-4 w-4" />
                           </button>

                           <button
                              type="button"
                              onClick={() => onDeleteRelation(relation)}
                              className="text-red-300/70 transition hover:text-red-300"
                              title="Excluir NPC"
                           >
                              <TrashIcon className="h-4 w-4" />
                           </button>
                        </div>
                     </section>
                  );
               })}
            </div>
         ) : (
            <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-purple-200/70">
               Nenhuma relação encontrada.
            </div>
         )}
      </div>
   );
};

export default Table;