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

export const tableColumns = "grid-cols-[60px_1.4fr_120px_55px_240px_80px_170px_140px]";;
