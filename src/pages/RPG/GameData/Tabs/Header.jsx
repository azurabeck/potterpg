import masteryRules from "../../../../../assets/json/mastery_rpg.json";

export const levelOptions = masteryRules.maestria.map(
   (item) => item.aprendizado
);

export const tableColumns =
   "grid-cols-[52px_minmax(160px,1.1fr)_minmax(180px,1.2fr)_minmax(180px,1.2fr)_minmax(150px,1fr)_110px_90px_110px_82px]";
