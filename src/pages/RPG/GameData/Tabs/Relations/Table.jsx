import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import SwordIcon from "../../../../../components/SwordIcon";
import RelationsFilters from "./RelationsFilters";

const Table = ({
   relations,
   selectedRelationId,
   onSelectRelation,
   onEditRelation,
   onDeleteRelation,
   onMarkNpcAsKnown,
   knownAdversaryNpcIds,
   markingKnownId,
   hasSelectedCharacter,
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
   allRelations,
   onOpenBulkJsonModal,
   onOpenCopyModal,
}) => {
   return (
      <div className="relative min-h-[310px] text-xs lg:border-e lg:border-dashed lg:border-white/25 lg:pr-10">
         <div className="sticky top-0 hidden self-start lg:block">
            <RelationsFilters
               search={search}
               typeFilter={typeFilter}
               relationFilter={relationFilter}
               yearFilter={yearFilter}
               studentYearFilter={studentYearFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setRelationFilter={setRelationFilter}
               setYearFilter={setYearFilter}
               setStudentYearFilter={setStudentYearFilter}
               setSort={setSort}
               relations={allRelations}
               onOpenBulkJsonModal={onOpenBulkJsonModal}
               onOpenCopyModal={onOpenCopyModal}
            />
         </div>

         {relations.length ? (
            <div className="space-y-4">
               {relations.map((relation) => {
                  const isSelected = selectedRelationId === relation.id;
                  const isKnownAdversary = knownAdversaryNpcIds?.has(relation.id);
                  const isMarking = markingKnownId === relation.id;

                  return (
                     <section key={relation.id}>
                        <div className="grid grid-cols-[minmax(160px,1fr)_28px_28px_28px] items-center gap-2">
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

                           <button
                              type="button"
                              onClick={() => onMarkNpcAsKnown(relation)}
                              disabled={!hasSelectedCharacter || isMarking}
                              className={`transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                 isKnownAdversary ? "text-red-400" : "text-purple-100/50 hover:text-red-400"
                              }`}
                              title={
                                 isKnownAdversary
                                    ? "Já está na lista de adversários do personagem"
                                    : "Marcar como adversário conhecido/enfrentado pelo personagem selecionado"
                              }
                           >
                              <SwordIcon className="h-4 w-4" />
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