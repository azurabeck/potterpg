import masteryRules from "../../../../../assets/json/mastery_rpg.json";
import { getSpells } from "../Spells/helpers";
import { getPotionsList } from "../Potions/helpers";
import { goalTypes } from "./defaultGoals";

export const normalizeGoalDocument = (document) => ({ id: document.id, ...document.data() });

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

const findCatalogItem = (catalogItems = [], idOrName = "") => {
   const normalizedValue = normalizeText(String(idOrName).split("(")[0]);

   return catalogItems.find((item) => {
      const names = [
         item.id,
         item.attributes?.slug,
         item.attributes?.name_pt,
         item.attributes?.incantation,
         item.attributes?.name,
         getDisplayName(item),
      ];

      return names.some((name) => normalizeText(name) === normalizedValue);
   });
};

const findSavedByKeyOrTitle = ({ savedItems = {}, sourceKey, title, catalogItems = [] }) => {
   if (sourceKey && savedItems[sourceKey]) return savedItems[sourceKey];

   const normalizedTitle = normalizeText(title);
   if (!normalizedTitle) return null;

   const matchedCatalogItem = findCatalogItem(catalogItems, sourceKey || title);

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

const formatAttributeName = (key) => {
   return String(key || "")
      .replace(/_/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
};

const getAttributeValue = (attributes = {}, attributeName = "") => {
   const normalizedName = normalizeText(attributeName);

   const matchedKey = Object.keys(attributes).find((key) => normalizeText(key) === normalizedName);
   return getNumber(attributes[matchedKey || attributeName]);
};

const isAttributeForCharacterHouse = ({ attributeGoal, selectedCharacter }) => {
   if (!attributeGoal?.casa) return true;
   return normalizeText(attributeGoal.casa) === normalizeText(selectedCharacter?.casa);
};

export const flattenGoalDocuments = ({ goalDocuments = [], selectedCharacter }) => {
   const spellCatalog = getSpells();
   const potionCatalog = getPotionsList();

   return goalDocuments.flatMap((goalDocument) => {
      const year = getNumber(goalDocument.year || goalDocument.ano);
      const documentId = goalDocument.id || `year-${year}`;

      const spellGoals = (goalDocument.spells || goalDocument.feiticos || []).map((spell, index) => {
         const sourceKey = spell.id || spell.source_key || spell.sourceKey || spell.key || spell.name || spell.title;
         const catalogItem = findCatalogItem(spellCatalog, sourceKey);
         const title = spell.title || spell.name || getDisplayName(catalogItem) || sourceKey;

         return {
            id: `${documentId}-spell-${sourceKey || index}`,
            year,
            type: "spell",
            title,
            description: spell.description || spell.descricao || "Meta padrão de feitiço.",
            target: getNumber(spell.mastery ?? spell.maestria ?? spell.target),
            source_key: sourceKey,
         };
      });

      const potionGoals = (goalDocument.potions || goalDocument.pocoes || []).map((potion, index) => {
         const sourceKey = potion.id || potion.source_key || potion.sourceKey || potion.key || potion.name || potion.title;
         const catalogItem = findCatalogItem(potionCatalog, sourceKey);
         const title = potion.title || potion.name || getDisplayName(catalogItem) || sourceKey;

         return {
            id: `${documentId}-potion-${sourceKey || index}`,
            year,
            type: "potion",
            title,
            description: potion.description || potion.descricao || "Meta padrão de poção.",
            target: getNumber(potion.mastery ?? potion.maestria ?? potion.target),
            source_key: sourceKey,
         };
      });

      const attributeGoals = (goalDocument.attributes || goalDocument.atributos || [])
         .filter((attributeGoal) => isAttributeForCharacterHouse({ attributeGoal, selectedCharacter }))
         .flatMap((attributeGoal, index) => {
            return Object.entries(attributeGoal)
               .filter(([key]) => !["id", "casa", "house", "description", "descricao"].includes(key))
               .map(([key, value]) => {
                  const title = formatAttributeName(key);

                  return {
                     id: `${documentId}-attribute-${attributeGoal.casa || "global"}-${key}-${index}`,
                     year,
                     type: "attribute",
                     title,
                     description: attributeGoal.description || attributeGoal.descricao || (attributeGoal.casa ? `Meta de atributo para ${attributeGoal.casa}.` : "Meta padrão de atributo."),
                     target: getNumber(value),
                     source_key: title,
                  };
               });
         });

      return [...spellGoals, ...potionGoals, ...attributeGoals];
   });
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
      return { current: getAttributeValue(selectedCharacter?.atributos || {}, goal.source_key || goal.title), target };
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
