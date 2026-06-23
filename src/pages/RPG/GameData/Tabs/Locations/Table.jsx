import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import LocationsFilters from "./LocationsFilters";

const Table = ({
   locations,
   selectedLocationId,
   onSelectLocation,
   onEditLocation,
   onDeleteLocation,
   search,
   typeFilter,
   accessFilter,
   sort,
   setSearch,
   setTypeFilter,
   setAccessFilter,
   setSort,
   allLocations,
   characters,
   onOpenCreateModal,
   onOpenBulkJsonModal,
}) => {
   return (
      <div className="relative min-h-[310px] text-xs lg:border-e lg:border-dashed lg:border-white/25 lg:pr-10">
         <div className="sticky top-0 hidden self-start lg:block">
            <LocationsFilters
               search={search}
               typeFilter={typeFilter}
               accessFilter={accessFilter}
               sort={sort}
               setSearch={setSearch}
               setTypeFilter={setTypeFilter}
               setAccessFilter={setAccessFilter}
               setSort={setSort}
               locations={allLocations}
               characters={characters}
               onOpenCreateModal={onOpenCreateModal}
               onOpenBulkJsonModal={onOpenBulkJsonModal}
            />
         </div>

         {locations.length ? (
            <div className="space-y-4">
               {locations.map((location) => {
                  const isSelected = selectedLocationId === location.id;

                  return (
                     <section key={location.id}>
                        <div className="grid grid-cols-[minmax(160px,1fr)_28px_28px] items-center gap-2">
                           <button
                              type="button"
                              onClick={() => onSelectLocation(location)}
                              className={`flex items-center text-left transition ${
                                 isSelected ? "text-yellow-400" : "text-[#9d564c] hover:text-yellow-400"
                              }`}
                           >
                              <span className="line-clamp-1">{location.name || "Local sem nome"}</span>
                              <span className="mx-3 flex-1 border-t border-dashed border-purple-100/20" />
                              <span className="text-[11px] text-[#736868]">{location.type || "-"}</span>
                           </button>

                           <button
                              type="button"
                              onClick={() => onEditLocation(location)}
                              className="text-yellow-400/70 transition hover:text-yellow-400"
                              title="Editar local"
                           >
                              <PencilSquareIcon className="h-4 w-4" />
                           </button>

                           <button
                              type="button"
                              onClick={() => onDeleteLocation(location)}
                              className="text-red-300/70 transition hover:text-red-300"
                              title="Excluir local"
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
               Nenhum local encontrado.
            </div>
         )}
      </div>
   );
};

export default Table;
