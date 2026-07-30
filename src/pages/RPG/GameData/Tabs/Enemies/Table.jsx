import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import SwordIcon from "../../../../../components/SwordIcon";
import EnemiesFilters from "./EnemiesFilters";

const Table = ({
   enemies,
   selectedEnemyId,
   onSelectEnemy,
   onEditEnemy,
   onDeleteEnemy,
   onMarkEnemyAsKnown,
   knownEnemyIds,
   markingKnownId,
   hasSelectedCharacter,
   search,
   typeFilter,
   difficultyFilter,
   sort,
   setSearch,
   setTypeFilter,
   setDifficultyFilter,
   setSort,
   allEnemies,
   onOpenFormModal,
   onOpenBulkJsonModal,
   onCleanObsoleteFields,
}) => {
   return (
      <div className="relative min-h-[310px] text-xs lg:border-e lg:border-dashed lg:border-white/25 lg:pr-10">
         <div className="sticky top-0 hidden self-start lg:block">
            <EnemiesFilters
               search={search}
               typeFilter={typeFilter}
               difficultyFilter={difficultyFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setDifficultyFilter={setDifficultyFilter}
               setSort={setSort}
               enemies={allEnemies}
               onOpenFormModal={onOpenFormModal}
               onOpenBulkJsonModal={onOpenBulkJsonModal}
               onCleanObsoleteFields={onCleanObsoleteFields}
            />
         </div>

         {enemies.length ? (
            <div className="space-y-4">
               {enemies.map((enemy) => {
                  const isSelected = selectedEnemyId === enemy.id;
                  const isKnown = knownEnemyIds?.has(enemy.id);
                  const isMarking = markingKnownId === enemy.id;

                  return (
                     <section key={enemy.id}>
                        <div className="grid grid-cols-[minmax(160px,1fr)_28px_28px_28px] items-center gap-2">
                           <button
                              type="button"
                              onClick={() => onSelectEnemy(enemy)}
                              className={`flex items-center text-left transition ${
                                 isSelected ? "text-yellow-400" : "text-[#9d564c] hover:text-yellow-400"
                              }`}
                           >
                              <span className="line-clamp-1">{enemy.name || "Adversário sem nome"}</span>
                              <span className="mx-3 flex-1 border-t border-dashed border-purple-100/20" />
                              <span className="text-[11px] text-purple-100/45">{enemy.recommended_year ? `${enemy.recommended_year}º ano · ` : ""}{enemy.hp || 0} HP</span>
                           </button>

                           <button
                              type="button"
                              onClick={() => onEditEnemy(enemy)}
                              className="text-yellow-400/70 transition hover:text-yellow-400"
                              title="Editar adversário"
                           >
                              <PencilSquareIcon className="h-4 w-4" />
                           </button>

                           <button
                              type="button"
                              onClick={() => onDeleteEnemy(enemy)}
                              className="text-red-300/70 transition hover:text-red-300"
                              title="Excluir adversário"
                           >
                              <TrashIcon className="h-4 w-4" />
                           </button>

                           <button
                              type="button"
                              onClick={() => onMarkEnemyAsKnown(enemy)}
                              disabled={!hasSelectedCharacter || isMarking}
                              className={`transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                 isKnown ? "text-red-400" : "text-purple-100/50 hover:text-red-400"
                              }`}
                              title={
                                 isKnown
                                    ? "Já está na lista de adversários do personagem"
                                    : "Marcar como conhecido/enfrentado pelo personagem selecionado"
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
               Nenhum adversário encontrado.
            </div>
         )}
      </div>
   );
};

export default Table;
