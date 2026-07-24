import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../../services/firebase";

let potionsCatalogCache = [];

export const setPotionsList = (potions = []) => {
   potionsCatalogCache = Array.isArray(potions) ? potions : [];
   return potionsCatalogCache;
};

export const getPotionsList = () => potionsCatalogCache;

export const loadPotionsList = async ({ force = false } = {}) => {
   if (!force && potionsCatalogCache.length) return potionsCatalogCache;

   const snapshot = await getDocs(collection(db, "potions"));
   return setPotionsList(
      snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
   );
};

export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getPotionDisplayName = (potion) => potion?.name || "-";

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
         potion.name,
         potion.effect,
         potion.cooking,
         potion.nivel,
         potion.ano,
         ...(potion.ingredientes_info || []).flatMap((ingredient) => [
            ingredient.name,
            ingredient.shop,
            ingredient.drop,
            ingredient.note,
         ]),
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
         const ingredients = (potion.ingredientes_info || [])
            .map((ingredient) => ingredient.name)
            .filter(Boolean)
            .join(", ");

         return {
            potion,
            savedData,
            id: potionId,
            name: getPotionDisplayName(potion),
            year: potion.ano || 0,
            effect: potion.effect || "-",
            ingredients: ingredients || "-",
            ingredientLocation: savedData?.local_ingredientes || "",
            xp: savedData?.xp ?? 0,
            level: savedData?.nivel || potion.nivel || "",
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
         item.name,
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
