export const sortOptions = [
   { value: "number-asc", label: "Número A-Z" },
   { value: "number-desc", label: "Número Z-A" },
];

export const emptySession = {
   event: "",
   local: "",
   characters: [],
};

export const sessionModel = {
   id: "",
   order: 1,
   user_id: "AUTH_USER_ID",
   character_id: "CHARACTER_ID",
   campaign_name: "Campanha 1 — Nome da campanha",
   sessions: [
      {
         order: 1,
         date: "",
         event: "O que aconteceu na sessão.",
         local: "Onde aconteceu.",
         characters: ["Personagem 1", "Personagem 2"],
      },
   ],
};