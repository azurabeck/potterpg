import masteryRules from "../../../../../../assets/json/mastery_rpg.json";

export const attributeOptions = [
   "Coragem",
   "Inteligência",
   "Agilidade",
   "Carisma",
   "Percepção",
   "Sorte",
   "Magia",
   "Resistência",
   "Ataque",
   "Proteção",
   "Precisão",
   "Controle",
   "Magia Antiga",
   "Liderança",
   "Aprendizado Mágico",
   "Persuasão",
   "Astucia",
   "Equilibrio",
];

export const levelOptions = masteryRules.maestria.map(
   (item) => item.aprendizado
);

export const tableColumns =
   "grid-cols-[52px_minmax(180px,1.4fr)_110px_90px_150px_minmax(150px,1fr)_82px]";
