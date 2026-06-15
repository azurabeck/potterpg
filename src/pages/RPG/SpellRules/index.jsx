import { useMemo, useState } from "react";

import spellsJson from "@/assets/json/spells_rpg.json";

import SearchBar from "./SearchBar";
import SpellsTable from "./SpellsTable";
import YearCards from "./YearCards";
import { YEARS } from "./constants";
import { getSpellSearchText } from "./helpers";

const SpellRules = () => {
   const [search, setSearch] = useState("");
   const [selectedYear, setSelectedYear] = useState(1);

   const spellsByYear = useMemo(() => {
      return YEARS.map((year) => ({
         year,
         spells: spellsJson.filter(
            (spell) => spell.attributes.ano_letivo === year
         ),
         required: spellsJson.filter(
            (spell) => spell.attributes.required === year
         ),
      }));
   }, []);

   const filteredSpells = useMemo(() => {
      const searchValue = search.trim().toLowerCase();

      return spellsJson.filter((spell) => {
         const isFromSelectedYear =
            Number(spell.attributes.ano_letivo) === Number(selectedYear);

         if (!isFromSelectedYear) return false;

         if (!searchValue) return true;

         return getSpellSearchText(spell).includes(searchValue);
      });
   }, [search, selectedYear]);

   return (
      <div className="min-h-[calc(100vh-65px)] bg-[#2b0038] text-white">
         <SearchBar search={search} onSearchChange={setSearch} />

         <main className="p-4 md:p-8">
            <YearCards
               spellsByYear={spellsByYear}
               selectedYear={selectedYear}
               onSelectYear={setSelectedYear}
            />

            <SpellsTable
               spells={filteredSpells}
               selectedYear={selectedYear}
            />
         </main>
      </div>
   );
};

export default SpellRules;
