import masteryRules from "../../../../../assets/json/mastery_rpg.json";
import { getSpells } from "../Spells/helpers";
import { getPotionsList } from "../Potions/helpers";
import { goalTypes } from "./defaultGoals";

export const normalizeGoal = (document) => ({ id: document.id, ...document.data() });

export const getGoalTypeLabel = (type) => {
   return goalTypes.find((item) => item.value === type)?.label || "Meta";
};

const getNumber = (value) => {
   const numberValue = Number(value ?? 0);
   return Number.isNaN(numberValue) ? 0 : numberValue;
};

const normalizeText = (value) =>
   String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

const getDisplayName = (item) => {
   const rawName =
      item?.attributes?.name_pt ||
      item?.attributes?.incantation ||
      item?.attributes?.name ||
      item?.nome ||
      item?.name ||
      item?.titulo ||
      item?.title ||
      "";

   return String(rawName).split("(")[0].trim();
};

const findSavedByKeyOrTitle = ({ savedItems = {}, sourceKey, title, catalogItems = [] }) => {
   if (sourceKey && savedItems[sourceKey]) return savedItems[sourceKey];

   const normalizedTitle = normalizeText(title);
   if (!normalizedTitle) return null;

   const matchedCatalogItem = catalogItems.find((item) => {
      const names = [
         item.id,
         item.attributes?.slug,
         item.attributes?.name_pt,
         item.attributes?.incantation,
         item.attributes?.name,
         getDisplayName(item),
      ];

      return names.some((name) => {
         const normalizedName = normalizeText(String(name || "").split("(")[0]);
         return normalizedName === normalizedTitle || normalizedName.includes(normalizedTitle) || normalizedTitle.includes(normalizedName);
      });
   });

   if (matchedCatalogItem?.id && savedItems[matchedCatalogItem.id]) {
      return savedItems[matchedCatalogItem.id];
   }

   return Object.entries(savedItems).find(([key, item]) => {
      const normalizedKey = normalizeText(key);
      const normalizedName = normalizeText(getDisplayName(item));

      return (
         normalizedKey === normalizedTitle ||
         normalizedKey.includes(normalizedTitle) ||
         normalizedTitle.includes(normalizedKey) ||
         normalizedName === normalizedTitle ||
         normalizedName.includes(normalizedTitle) ||
         normalizedTitle.includes(normalizedName)
      );
   })?.[1] || null;
};

const normalizeLevel = (level) => normalizeText(level).replace(/\s+/g, " ");

const getMasteryByXpValue = (level, xp) => {
   const xpValue = getNumber(xp);
   const normalizedLevel = normalizeLevel(level);

   const rule = masteryRules.maestria.find((item) => {
      return normalizeLevel(item.aprendizado) === normalizedLevel;
   });

   if (!rule) return 0;

   return Object.entries(rule.xp_maestria || {}).reduce((mastery, [key, requiredXp]) => {
      if (xpValue >= Number(requiredXp)) return Number(key.replace("M", ""));
      return mastery;
   }, 0);
};

const getSavedMastery = (savedItem) => {
   if (!savedItem) return 0;

   if (savedItem.maestria !== undefined) return getNumber(savedItem.maestria);
   if (savedItem.mastery !== undefined) return getNumber(savedItem.mastery);

   return getMasteryByXpValue(savedItem.nivel || savedItem.level, savedItem.xp);
};

export const getGoalProgress = ({ goal, selectedCharacter, mysteries = [] }) => {
   const target = getNumber(goal.target);

   if (goal.type === "spell") {
      const spell = findSavedByKeyOrTitle({
         savedItems: selectedCharacter?.habilidades || {},
         sourceKey: goal.source_key,
         title: goal.title,
         catalogItems: getSpells(),
      });

      return { current: getSavedMastery(spell), target };
   }

   if (goal.type === "potion") {
      const potion = findSavedByKeyOrTitle({
         savedItems: selectedCharacter?.pocoes || {},
         sourceKey: goal.source_key,
         title: goal.title,
         catalogItems: getPotionsList(),
      });

      return { current: getSavedMastery(potion), target };
   }

   if (goal.type === "attribute") {
      return { current: getNumber(selectedCharacter?.atributos?.[goal.source_key || goal.title]), target };
   }

   if (goal.type === "mystery") {
      const mystery = mysteries.find((item) => item.id === goal.source_key || item.nome === goal.title || item.name === goal.title);
      const current = mystery?.status === "Concluído" || mystery?.status === "Concluido" || mystery?.completed ? target : 0;
      return { current, target };
   }

   return { current: getNumber(goal.current), target };
};

export const isGoalCompleted = (progress) => {
   if (!progress.target) return false;
   return progress.current >= progress.target;
};

export const getYearProgress = (goals) => {
   if (!goals.length) return 0;
   const completed = goals.filter((goal) => goal.completed).length;
   return Math.round((completed / goals.length) * 100);
};
