export const getSpellDisplayName = (spell) => {
   const incantation = spell?.attributes?.incantation;

   if (incantation) {
      return incantation.includes("(")
         ? incantation.substring(0, incantation.indexOf("(")).trim()
         : incantation;
   }

   return spell?.attributes?.name || spell?.attributes?.slug || "";
};

export const getSpellSearchText = (spell) => {
   const attributes = spell?.attributes || {};

   return [
      attributes.name,
      attributes.category,
      attributes.nivel,
      attributes.incantation,
      attributes.aula,
      attributes.effect,
      attributes.ano_letivo,
   ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
};
