import potionsJson from "../../../../../assets/json/potions_rpg.json";

export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getPotionsList = () => {
   if (Array.isArray(potionsJson)) return potionsJson;
   if (Array.isArray(potionsJson.data)) return potionsJson.data;
   if (Array.isArray(potionsJson.potions)) return potionsJson.potions;

   return [];
};

export const getPotionDisplayName = (potion) =>
   potion.attributes?.name_pt || "-";

export const getNextSortDirection = (currentSort, key) => {
   if (currentSort.key !== key) return "asc";
   return currentSort.direction === "asc" ? "desc" : "asc";
};

export const filterAvailablePotions = ({ potions, knownPotionIds, potionSearch }) => {
   const search = normalizeText(potionSearch);

   return potions.filter((potion) => {
      if (knownPotionIds.includes(potion.id)) return false;
      if (!search) return true;

      const searchableText = normalizeText([
         potion.attributes?.name_pt,
         potion.attributes?.effect,
         potion.attributes?.ingredients,
         potion.attributes?.characteristics,
         potion.attributes?.nivel,
         potion.attributes?.ano_letivo,
      ].join(" "));

      return searchableText.includes(search);
   });
};

export const getCharacterPotions = ({ knownPotionIds, savedPotions, potions }) =>
   knownPotionIds
      .map((potionId) => {
         const potion = potions.find((item) => item.id === potionId);
         if (!potion) return null;

         const savedData = savedPotions[potionId];

         return {
            potion,
            savedData,
            id: potionId,
            name: getPotionDisplayName(potion),
            year: potion.attributes?.ano_letivo || 0,
            effect: potion.attributes?.effect || potion.attributes?.characteristics || "-",
            ingredients: potion.attributes?.ingredients || "-",
            ingredientLocation: savedData?.local_ingredientes || "",
            xp: savedData?.xp ?? 0,
            level: savedData?.nivel || potion.attributes?.nivel || "",
         };
      })
      .filter(Boolean);

export const getYears = (rows) =>
   [...new Set(rows.map((item) => item.year))]
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));

export const getFilteredAndSortedPotions = ({
   rows,
   tableSearch,
   yearFilter,
   levelFilter,
   locationFilter,
   sortConfig,
}) => {
   const search = normalizeText(tableSearch);
   const locationSearch = normalizeText(locationFilter);

   const filtered = rows.filter((item) => {
      const searchableText = normalizeText([
         item.name_pt,
         item.effect,
         item.ingredients,
         item.ingredientLocation,
         item.level,
      ].join(" "));

      return (
         (!search || searchableText.includes(search)) &&
         (!yearFilter || String(item.year) === String(yearFilter)) &&
         (!levelFilter || item.level === levelFilter) &&
         (!locationSearch || normalizeText(item.ingredientLocation).includes(locationSearch))
      );
   });

   const direction = sortConfig.direction === "asc" ? 1 : -1;

   return [...filtered].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (typeof valueA === "number" && typeof valueB === "number") {
         return (valueA - valueB) * direction;
      }

      return String(valueA || "").localeCompare(String(valueB || "")) * direction;
   });
};
