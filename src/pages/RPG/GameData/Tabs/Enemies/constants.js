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
   "Difícil escolar",
   "Chefe escolar",
   "Muito Difícil",
   "Profissional",
   "Elite",
   "Lendário",
   "Mítico",
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

export const yearOptions = [
   { label: "1º ano", value: 1 },
   { label: "2º ano", value: 2 },
   { label: "3º ano", value: 3 },
   { label: "4º ano", value: 4 },
   { label: "5º ano", value: 5 },
   { label: "6º ano", value: 6 },
   { label: "7º ano", value: 7 },
   { label: "8º ano / adulto", value: 8 },
];

export const diceOptions = [
   "1D4",
   "1D6",
   "1D8",
   "1D10",
   "1D12",
   "1D20",
   "2D6",
   "2D8",
   "2D10",
   "2D12",
   "2D20",
   "3D8",
   "3D10",
   "4D10",
];

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

export const emptyAttack = {
   name: "",
   attribute: "Ataque",
   attribute_value: 0,
   distance: "medium",
   effect: "",
};

export const emptyDefense = {
   attribute: "Agilidade",
   attribute_value: 0,
};

export const defaultBattleDice = {
   recommended_year: 1,
   impact_die: "1D4",
};


export const balanceByYear = {
   1: {
      label: "1º ano",
      attribute_min: 8,
      attribute_max: 10,
      hp_min: 20,
      hp_max: 50,
      hp_default: 35,
      difficulty: "Fácil",
               impact_die: "1D6",
      note: "Adversários de treino podem ter menos HP. Criaturas reais do 1º ano devem ficar perto de 8 a 10 em ataque/defesa.",
   },
   2: {
      label: "2º ano",
      attribute_min: 10,
      attribute_max: 20,
      hp_min: 80,
      hp_max: 100,
      hp_default: 90,
      difficulty: "Médio",
         impact_die: "1D6",
      note: "Criaturas de 2º ano devem ameaçar, mas ainda permitir vitória por uso bom de feitiços e terreno.",
   },
   3: {
      label: "3º ano",
      attribute_min: 20,
      attribute_max: 30,
      hp_min: 90,
      hp_max: 120,
      hp_default: 105,
      difficulty: "Médio",
      impact_die: "1D10",
      note: "Bom para criaturas que já exigem estratégia, mas ainda não são chefes.",
   },
   4: {
      label: "4º ano",
      attribute_min: 30,
      attribute_max: 40,
      hp_min: 110,
      hp_max: 150,
      hp_default: 130,
      difficulty: "Difícil escolar",
      impact_die: "1D10",
      note: "Faixa ideal para criaturas perigosas que podem vencer se o jogador errar a abordagem.",
   },
   5: {
      label: "5º ano",
      attribute_min: 40,
      attribute_max: 50,
      hp_min: 150,
      hp_max: 190,
      hp_default: 170,
      difficulty: "Chefe escolar",
      impact_die: "2D10",
      note: "Use para chefes escolares ou criaturas que podem segurar uma cena inteira.",
   },
   6: {
      label: "6º ano",
      attribute_min: 50,
      attribute_max: 60,
      hp_min: 180,
      hp_max: 230,
      hp_default: 205,
      difficulty: "Muito Difícil",
      impact_die: "2D10",
      note: "Adversários deste ano já podem vencer combates diretos sem plano do jogador.",
   },
   7: {
      label: "7º ano",
      attribute_min: 60,
      attribute_max: 70,
      hp_min: 220,
      hp_max: 280,
      hp_default: 250,
      difficulty: "Profissional",
      impact_die: "2D10",
      note: "Faixa de duelistas adultos, criaturas inteligentes e ameaças quase profissionais.",
   },
   8: {
      label: "8º ano / adulto",
      attribute_min: 75,
      attribute_max: 90,
      hp_min: 220,
      hp_max: 320,
      hp_default: 260,
      difficulty: "Lendário",
      impact_die: "3D10",
      note: "Use para dragões e ameaças lendárias. Mítico pode passar de 90 e chegar a 300–450 HP.",
   },
};

export const getBalanceByYear = (year) => balanceByYear[Number(year)] || balanceByYear[1];
