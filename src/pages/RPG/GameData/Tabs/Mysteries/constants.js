export const statusOptions = ["em andamento", "resolvido", "cancelado"];

export const clueStatusOptions = ["em aberto", "resolvido", "cancelado"];

export const sortOptions = [
   { value: "name-asc", label: "Nome A-Z" },
   { value: "name-desc", label: "Nome Z-A" },
   { value: "year-asc", label: "Ano A-Z" },
   { value: "year-desc", label: "Ano Z-A" },
];

export const emptyClue = {
   order: 1,
   name: "",
   question: "",
   details: "",
   resolution: "",
   status: "em aberto",
};

export const emptyMystery = {
   name: "",
   year: "1",
   last_appearance: "",
   status: "em andamento",
   clues: [],
};
