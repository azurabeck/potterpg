export const enemyTypeOptions = [
   "Todos",
   "Criatura Mágica",
   "Construto Mágico",
   "Bruxo",
   "Obstáculo",
   "Outro",
];

export const difficultyOptions = [
   "Todos",
   "Muito Fácil",
   "Fácil",
   "Médio",
   "Pouco Difícil",
   "Difícil",
   "Muito Difícil",
   "Profissional",
   "Lendário",
];

export const distanceOptions = [
   { label: "Curta", value: "short" },
   { label: "Média", value: "medium" },
   { label: "Longa", value: "long" },
   { label: "Curta / Média", value: "short_medium" },
   { label: "Média / Longa", value: "medium_long" },
];

export const distanceLabelMap = {
   short: "Curta",
   medium: "Média",
   long: "Longa",
   short_medium: "Curta / Média",
   medium_long: "Média / Longa",
   curta: "Curta",
   média: "Média",
   media: "Média",
   longa: "Longa",
   "curta / média": "Curta / Média",
   "curta / media": "Curta / Média",
   "média / longa": "Média / Longa",
   "media / longa": "Média / Longa",
};

export const attributeOptions = [
   "Agilidade",
   "Aprendizado Mágico",
   "Astucia",
   "Ataque",
   "Carisma",
   "Controle",
   "Coragem",
   "Equilibrio",
   "Inteligência",
   "Liderança",
   "Magia",
   "Magia Antiga",
   "Percepção",
   "Persuasão",
   "Precisão",
   "Proteção",
   "Resistência",
   "Sorte",
   "Força",
];

export const sortOptions = [
   { label: "A-Z", value: "name-asc" },
   { label: "Z-A", value: "name-desc" },
   { label: "HP maior", value: "hp-desc" },
   { label: "HP menor", value: "hp-asc" },
];

export const defaultDamage = {
   partial: "1D4",
   normal: "1D6",
   strong: "1D8",
   critical: "1D10",
};

export const emptyAttack = {
   name: "",
   attribute: "Ataque",
   attribute_value: 0,
   distance: "medium",
   effect: "",
   damage: defaultDamage,
};

export const emptyDefense = {
   attribute: "Agilidade",
   attribute_value: 0,
};
