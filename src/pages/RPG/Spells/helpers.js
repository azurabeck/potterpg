export const SPELLS_COLLECTION = "spells";

export const SPELL_CATEGORY_OPTIONS = [
   "Utilitário",
   "Ataque",
   "Defesa",
   "Imobilização",
];

export const normalizeSpellCategory = (spell) => {
   const type = spell?.type || "";
   const attributes = spell?.attributes || {};
   const category = attributes.category || "";
   const value = `${type} ${category}`.toLowerCase();

   if (value.includes("ataque")) return "Ataque";
   if (value.includes("defesa") || value.includes("contrafeitiço")) return "Defesa";
   if (value.includes("imobilização") || value.includes("imobilizacao")) return "Imobilização";

   return "Utilitário";
};

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

export const normalizeSpellForFirestore = (spell) => {
   const attributes = spell?.attributes || {};
   const originalId = spell?.original_id || spell?.id || "";

   return {
      original_id: originalId,
      attributes: {
         category: normalizeSpellCategory(spell),
         effect: attributes.effect || "",
         image: attributes.image || null,
         incantation: attributes.incantation || null,
         light: attributes.light || null,
         name: attributes.name || getSpellDisplayName(spell),
         ano_letivo: Number(attributes.ano_letivo || 1),
         nivel: attributes.nivel || "",
         xp_maestria: attributes.xp_maestria || {},
         xp_total: Number(attributes.xp_total || 0),
         required: Number(attributes.required || 0),
         maestria_required: Number(attributes.maestria_required || 0),
         aula: attributes.aula || null,
         penalidade_crime_magico: Number(attributes.penalidade_crime_magico || 0),
         effect_dice: attributes.effect_dice || null,
      },
   };
};

export const hydrateSpellFromFirestore = (documentId, data) => {
   return {
      id: data?.original_id || documentId,
      firestore_id: documentId,
      original_id: data?.original_id || documentId,
      attributes: data?.attributes || {},
   };
};
