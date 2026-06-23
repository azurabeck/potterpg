import { CodeBracketSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import CopyButton from "@/components/CopyButton";
import CustomSelect from "@/components/CustomSelect";
import { locationTypeOptions, sortOptions } from "./constants";
import { getAccessNames } from "./helpers";

const LocationsFilters = ({
   search,
   typeFilter,
   accessFilter,
   sort,
   setSearch,
   setTypeFilter,
   setAccessFilter,
   setSort,
   locations = [],
   characters = [],
   onOpenCreateModal,
   onOpenBulkJsonModal,
}) => {
   const accessOptions = [
      { value: "Todos", label: "Acesso" },
      ...characters.map((character) => ({
         value: character.id,
         label: character.name || "Personagem sem nome",
      })),
   ];

   const getAllLocationsText = () => {
      if (!locations.length) return "";

      return locations
         .map((location) =>
            [
               `Nome: ${location.name || ""}`,
               `Tipo: ${location.type || ""}`,
               `Quem tem acesso: ${getAccessNames(location, characters)}`,
               `Características: ${location.characteristics || ""}`,
               `Importância: ${location.importance || ""}`,
               `Imagem: ${location.image_url || ""}`,
            ].join("\n")
         )
         .join("\n\n---\n\n");
   };

   return (
      <div className="mb-8 space-y-3 text-xs">
         <div className="grid grid-cols-3 gap-3">
            <CustomSelect value={typeFilter} options={locationTypeOptions} onChange={setTypeFilter} placeholder="Tipo" />
            <CustomSelect value={accessFilter} options={accessOptions} onChange={setAccessFilter} placeholder="Acesso" />
            <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="A-B" />
         </div>

         <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3">
            <input
               type="text"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Procurar local"
               className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-yellow-400"
            />

            <CopyButton
               getText={getAllLocationsText}
               disabled={!locations.length}
               title="Copiar locais"
               className="border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-100 hover:bg-yellow-400/20 hover:text-yellow-100"
            />

            <button
               type="button"
               onClick={onOpenCreateModal}
               className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20"
               title="Cadastrar local"
            >
               <PlusIcon className="h-4 w-4" />
            </button>

            <button
               type="button"
               onClick={onOpenBulkJsonModal}
               className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20"
               title="Cadastrar locais por JSON"
            >
               <CodeBracketSquareIcon className="h-4 w-4" />
            </button>
         </div>
      </div>
   );
};

export default LocationsFilters;
