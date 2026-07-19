import { effectTypeLabelMap, emptyMagicObject, locationLabelMap, rarityLabelMap, typeLabelMap } from "./constants";

export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getLocationLabel = (location) => locationLabelMap[location] || location || "-";
export const getTypeLabel = (type) => typeLabelMap[type] || type || "-";
export const getEffectTypeLabel = (effectType) => effectTypeLabelMap[effectType] || effectType || "-";
export const getRarityLabel = (rarity) => rarityLabelMap[rarity] || rarity || "-";

export const normalizeMagicObject = (object = {}) => {
   const safeObject = object || {};
   const requirements = safeObject.requirements || {};

   return {
      ...emptyMagicObject,
      name: safeObject.name || "",
      type: safeObject.type || "other",
      effect: safeObject.effect || "",
      effect_type: safeObject.effect_type || "other",
      price: Number(safeObject.price || 0),
      location: safeObject.location || "mission",
      img_url: safeObject.img_url || safeObject.image_url || "",
      detalhes: safeObject.detalhes || "",
      dice1: safeObject.dice1 || "",
      dice2: safeObject.dice2 || "",
      dice3: safeObject.dice3 || "",
      duration: safeObject.duration || "",
      rarity: safeObject.rarity || "common",
      requirements: {
         year: Number(requirements.year || 1),
         skill: requirements.skill || "",
         mastery: Number(requirements.mastery || 0),
      },
      details: safeObject.details || "",
   };
};

export const getFilteredAndSortedMagicObjects = ({ objects, search, locationFilter, typeFilter, effectTypeFilter, sort }) => {
   const normalizedSearch = normalizeText(search);

   const filtered = objects.filter((object) => {
      const searchableText = normalizeText([
         object.name,
         object.type,
         object.effect,
         object.effect_type,
         object.price,
         object.location,
         object.rarity,
         object.requirements?.year,
         object.requirements?.skill,
         object.requirements?.mastery,
         object.detalhes,
         object.dice1,
         object.dice2,
         object.dice3,
         object.duration,
         object.details,
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesLocation = !locationFilter || locationFilter === "Todos" || object.location === locationFilter;
      const matchesType = !typeFilter || typeFilter === "Todos" || object.type === typeFilter;
      const matchesEffectType = !effectTypeFilter || effectTypeFilter === "Todos" || object.effect_type === effectTypeFilter;

      return matchesSearch && matchesLocation && matchesType && matchesEffectType;
   });

   return [...filtered].sort((a, b) => {
      if (sort === "price-desc") return Number(b.price || 0) - Number(a.price || 0);
      if (sort === "price-asc") return Number(a.price || 0) - Number(b.price || 0);

      const direction = sort === "name-desc" ? -1 : 1;
      return String(a.name || "").localeCompare(String(b.name || "")) * direction;
   });
};
