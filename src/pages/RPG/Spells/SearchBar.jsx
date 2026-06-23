import { CloudArrowUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ search, onSearchChange, onSaveSpells, isSavingSpells }) => {
   return (
      <section className="sticky top-[65px] z-50 flex w-full bg-[#3b0050] shadow-md">
         <input
            type="text"
            placeholder="Buscar Feitiços...."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="flex-1 bg-transparent px-8 py-5 text-sm text-white outline-none placeholder:text-purple-300"
         />

         <button
            type="button"
            onClick={onSaveSpells}
            disabled={isSavingSpells}
            className="flex w-44 items-center justify-center gap-2 border-l border-[#21002b] px-4 text-xs font-semibold uppercase text-purple-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
         >
            <CloudArrowUpIcon className="h-5 w-5" />
            {isSavingSpells ? "Salvando..." : "Salvar spells"}
         </button>

         <button type="button" className="w-24 border-l border-[#21002b]">
            <MagnifyingGlassIcon className="mx-auto h-7 w-7 text-purple-300" />
         </button>
      </section>
   );
};

export default SearchBar;
