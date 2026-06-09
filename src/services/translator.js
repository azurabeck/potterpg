import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
   apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const translateSpellsBatch = async (spells) => {
   const prompt = `
Traduza os feitiços abaixo para português do Brasil.

Regras:

- NÃO altere id.
- NÃO altere slug.
- NÃO altere image.
- NÃO altere wiki.
- NÃO altere name.
- NÃO altere incantation.

- Traduza:
  - category
  - effect
  - hand
  - light

- Se o valor for null, mantenha null.
- Preserve a ordem original das propriedades.
- Mantenha exatamente a mesma estrutura JSON.
- Retorne SOMENTE um ARRAY JSON válido.
- Não envolva o resultado em objetos.
- Não utilize markdown.
- Não adicione comentários.
- Não remova propriedades nulas.
- Não invente informações.

Dados:

${JSON.stringify(spells)}
`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
   });

   return response.text;
};

export const translatePotionsBatch = async (potions) => {
   const prompt = `
Traduza as poções abaixo para português do Brasil.

Regras:

- NÃO altere id.
- NÃO altere slug.
- NÃO altere image.
- NÃO altere wiki.
- NÃO altere name.

- Traduza:
  - characteristics
  - difficulty
  - effect
  - ingredients
  - inventors
  - manufacturers
  - side_effects
  - time

- Se o valor for null, mantenha null.
- Preserve a ordem original das propriedades.
- Mantenha exatamente a mesma estrutura JSON.
- Retorne SOMENTE um ARRAY JSON válido.
- Não envolva o resultado em objetos.
- Não utilize markdown.
- Não adicione comentários.
- Não remova propriedades nulas.
- Não invente informações.

Dados:

${JSON.stringify(potions)}
`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
   });

   return response.text;
};

export const translateCharactersBatch = async (characters) => {
   const prompt = `
Traduza os personagens abaixo para português do Brasil.

Regras:

- NÃO altere id.
- NÃO altere slug.
- NÃO altere image.
- NÃO altere wiki.
- NÃO altere name.

- Traduza:
  - alias_names
  - animagus
  - blood_status
  - boggart
  - born
  - died
  - eye_color
  - family_member
  - gender
  - hair_color
  - height
  - house
  - jobs
  - nationality
  - patronus
  - romances
  - skin_color
  - species
  - titles
  - wand
  - weight

- Se o valor for null, mantenha null.
- Se o valor for array, traduza os textos dentro do array mantendo o array.
- Preserve a ordem original das propriedades.
- Mantenha exatamente a mesma estrutura JSON.
- Retorne SOMENTE um ARRAY JSON válido.
- Não envolva o resultado em objetos.
- Não utilize markdown.
- Não adicione comentários.
- Não remova propriedades nulas.
- Não invente informações.

Dados:

${JSON.stringify(characters)}
`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
   });

   return response.text;
};

export const translateBooksBatch = async (books) => {
   const prompt = `
Traduza os livros abaixo para português do Brasil.

Regras:

- NÃO altere id.
- NÃO altere slug.
- NÃO altere author.
- NÃO altere cover.
- NÃO altere pages.
- NÃO altere release_date.
- NÃO altere wiki.

- Traduza:
  - type
  - summary
  - title
  - dedication

- Se o valor for null, mantenha null.
- Preserve a ordem original das propriedades.
- Mantenha exatamente a mesma estrutura JSON.
- Retorne SOMENTE um ARRAY JSON válido.
- Não envolva o resultado em objetos.
- Não utilize markdown.
- Não adicione comentários.
- Não remova propriedades nulas.
- Não invente informações.

Dados:

${JSON.stringify(books)}
`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
   });

   return response.text;
};


export const translateMoviesBatch = async (movies) => {
   const prompt = `
Traduza os filmes abaixo para português do Brasil.

Regras:

- NÃO altere id.
- NÃO altere slug.
- NÃO altere poster.
- NÃO altere trailer.
- NÃO altere release_date.
- NÃO altere running_time.
- NÃO altere budget.
- NÃO altere box_office.
- NÃO altere rating.
- NÃO altere wiki.

- Traduza:
  - title
  - summary
  - directors
  - producers
  - screenwriters
  - cinematographers
  - editors
  - music_composers
  - distributors

- Se o valor for null, mantenha null.
- Se o valor for array, traduza os textos dentro do array mantendo o array.
- Preserve a ordem original das propriedades.
- Mantenha exatamente a mesma estrutura JSON.
- Retorne SOMENTE um ARRAY JSON válido.
- Não envolva o resultado em objetos.
- Não utilize markdown.
- Não adicione comentários.
- Não remova propriedades nulas.
- Não invente informações.

Dados:

${JSON.stringify(movies)}
`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
   });

   return response.text;
};
