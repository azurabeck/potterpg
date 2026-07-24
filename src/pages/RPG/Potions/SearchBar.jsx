import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ search, onSearchChange }) => (
   <section className="sticky top-[65px] z-50 flex w-full bg-[#3b0050] shadow-md">
      <input
         type="text"
         placeholder="Buscar poções..."
         value={search}
         onChange={(event) => onSearchChange(event.target.value)}
         className="flex-1 bg-transparent px-8 py-5 text-sm text-white outline-none placeholder:text-purple-300"
      />

      <div className="flex w-24 items-center justify-center border-l border-[#21002b]">
         <MagnifyingGlassIcon className="h-7 w-7 text-purple-300" />
      </div>
   </section>
);

export default SearchBar;
