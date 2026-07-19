import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import MagicObjectsFilters from "./MagicObjectsFilters";
import { getLocationLabel, getTypeLabel } from "./helpers";

const Table = ({ objects, selectedObjectId, onSelectObject, onEditObject, onDeleteObject, search, locationFilter, typeFilter, effectTypeFilter, sort, setSearch, setLocationFilter, setTypeFilter, setEffectTypeFilter, setSort, allObjects, onOpenFormModal, onOpenJsonModal }) => (
   <div className="relative min-h-[310px] text-xs lg:border-e lg:border-dashed lg:border-white/25 lg:pr-10">
      <div className="sticky top-0 hidden self-start lg:block">
         <MagicObjectsFilters search={search} locationFilter={locationFilter} typeFilter={typeFilter} effectTypeFilter={effectTypeFilter} sort={sort} setSearch={setSearch} setLocationFilter={setLocationFilter} setTypeFilter={setTypeFilter} setEffectTypeFilter={setEffectTypeFilter} setSort={setSort} objects={allObjects} onOpenFormModal={onOpenFormModal} onOpenJsonModal={onOpenJsonModal} />
      </div>

      {objects.length ? (
         <div className="space-y-4">
            {objects.map((object) => {
               const isSelected = selectedObjectId === object.id;
               return (
                  <section key={object.id}>
                     <div className="grid grid-cols-[minmax(160px,1fr)_28px_28px] items-center gap-2">
                        <button type="button" onClick={() => onSelectObject(object)} className={`flex items-center text-left transition ${isSelected ? "text-yellow-400" : "text-[#9d564c] hover:text-yellow-400"}`}>
                           <span className="line-clamp-1">{object.name || "Objeto sem nome"}</span>
                           <span className="mx-3 flex-1 border-t border-dashed border-purple-100/20" />
                           <span className="text-[11px] text-purple-100/45">{getTypeLabel(object.type)} · {getLocationLabel(object.location)} · {object.price || 0}</span>
                        </button>

                        <button type="button" onClick={() => onEditObject(object)} className="text-yellow-400/70 transition hover:text-yellow-400" title="Editar objeto mágico">
                           <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => onDeleteObject(object)} className="text-red-300/70 transition hover:text-red-300" title="Excluir objeto mágico">
                           <TrashIcon className="h-4 w-4" />
                        </button>
                     </div>
                  </section>
               );
            })}
         </div>
      ) : <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-purple-200/70">Nenhum objeto mágico encontrado.</div>}
   </div>
);

export default Table;
