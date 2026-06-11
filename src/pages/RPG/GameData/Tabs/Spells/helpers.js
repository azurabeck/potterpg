import spellsJson from "../../../../../assets/json/spells_rpg.json";

export const getSpellName = (spell) =>
   spell.attributes?.incantation?.split("(")[0].trim() ||
   spell.attributes?.name ||
   "-";

export const getSpells = () =>
   Array.isArray(spellsJson)
      ? spellsJson
      : spellsJson.data || spellsJson.spells || [];

export const normalize = (value) =>
   String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const filterSpells = ({ rows, search, year, level, attribute }) => {
   const text = normalize(search);

   return rows.filter((row) => {
      const searchable = normalize(`${row.name} ${row.level} ${row.attribute}`);

      return (
         (!text || searchable.includes(text)) &&
         (!year || String(row.year) === String(year)) &&
         (!level || row.level === level) &&
         (!attribute || row.attribute === attribute)
      );
   });
};

export const sortSpells = ({ rows, sort }) => {
   const direction = sort.direction === "asc" ? 1 : -1;

   return [...rows].sort((a, b) => {
      const valueA = a[sort.key];
      const valueB = b[sort.key];

      if (typeof valueA === "number" && typeof valueB === "number") {
         return (valueA - valueB) * direction;
      }

      return String(valueA || "").localeCompare(String(valueB || "")) * direction;
   });
};