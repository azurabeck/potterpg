export const locationOptions = [
   { value: "Todos", label: "Todos os locais" },
   { value: "mission", label: "Missão" },
   { value: "shop", label: "Loja" },
   { value: "create", label: "Criação" },
];

export const typeOptions = [
   { value: "Todos", label: "Todos os tipos" },
   { value: "potion", label: "Poção" },
   { value: "wand", label: "Varinha" },
   { value: "magical_artifact", label: "Artefato mágico" },
   { value: "ingredient", label: "Ingrediente" },
   { value: "book", label: "Livro" },
   { value: "broom", label: "Vassoura" },
   { value: "invented", label: "Inventado" },
   { value: "other", label: "Outros" },
];

export const effectTypeOptions = [
   { value: "Todos", label: "Todos os efeitos" },
   { value: "healing", label: "Cura" },
   { value: "attribute", label: "Atributo" },
   { value: "jinx", label: "Azaração" },
   { value: "enchanted", label: "Encantado" },
   { value: "other", label: "Outro" },
];

export const rarityOptions = [
   { value: "common", label: "Comum" },
   { value: "uncommon", label: "Incomum" },
   { value: "rare", label: "Raro" },
   { value: "epic", label: "Épico" },
   { value: "legendary", label: "Lendário" },
];

export const sortOptions = [
   { value: "name-asc", label: "A-B" },
   { value: "name-desc", label: "B-A" },
   { value: "price-desc", label: "Maior preço" },
   { value: "price-asc", label: "Menor preço" },
];

export const emptyMagicObject = {
   name: "",
   type: "other",
   effect: "",
   effect_type: "other",
   price: 0,
   location: "mission",
   img_url: "",
   detalhes: "",
   dice1: "",
   dice2: "",
   dice3: "",
   duration: "",
   rarity: "common",
   requirements: {
      year: 1,
      skill: "",
      mastery: 0,
   },
   details: "",
};

export const locationLabelMap = Object.fromEntries(locationOptions.filter(({ value }) => value !== "Todos").map(({ value, label }) => [value, label]));
export const typeLabelMap = Object.fromEntries(typeOptions.filter(({ value }) => value !== "Todos").map(({ value, label }) => [value, label]));
export const effectTypeLabelMap = Object.fromEntries(effectTypeOptions.filter(({ value }) => value !== "Todos").map(({ value, label }) => [value, label]));
export const rarityLabelMap = Object.fromEntries(rarityOptions.map(({ value, label }) => [value, label]));
