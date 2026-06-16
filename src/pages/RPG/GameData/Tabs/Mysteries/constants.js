export const categoryOptions = ["mistérios", "pendencias narrador", "proxima sessão"];

export const categoryLabels = {
   "mistérios": "Mistérios",
   "pendencias narrador": "Pendências do Narrador",
   "proxima sessão": "Próxima Sessão",
};

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
   category: "mistérios",
   name: "",
   year: "1",
   last_appearance: "",
   status: "em andamento",
   clues: [],
   details: "",
   next_session: false,
   awaited_event: "",
   current_situation: "",
   responder: "",
};
