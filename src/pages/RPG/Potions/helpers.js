export const POTIONS_COLLECTION = "potions";

export const normalizePotionForFirestore = (potion = {}) => ({
   id: potion.id || "",
   name: potion.name || "",
   ano: Number(potion.ano || 1),
   ingredientes_info: Array.isArray(potion.ingredientes_info)
      ? potion.ingredientes_info.map((ingredient) => ({
           value: String(ingredient?.value || ""),
           name: ingredient?.name || "",
           shop: ingredient?.shop || "",
           drop: ingredient?.drop || "",
           note: ingredient?.note || "",
        }))
      : [],
   cooking: potion.cooking || "",
   nivel: potion.nivel || "",
   xp_maestria: potion.xp_maestria || {},
   xp_total: Number(potion.xp_total || 0),
   aula: potion.aula || "Poções",
   card_image_url: potion.card_image_url || "",
   image_url: potion.image_url || "",
   effect: potion.effect || "",
   mastery_effect: Array.isArray(potion.mastery_effect)
      ? potion.mastery_effect.map((item) => ({
           mastery: item?.mastery || "",
           effect: item?.effect || "",
           recipe: item?.recipe || "",
        }))
      : [],
});

export const hydratePotionFromFirestore = (documentId, data = {}) => ({
   ...normalizePotionForFirestore(data),
   id: data.id || documentId,
   firestore_id: documentId,
});

export const getPotionSearchText = (potion = {}) =>
   [
      potion.name,
      potion.ano,
      potion.nivel,
      potion.aula,
      potion.effect,
      potion.cooking,
      ...(potion.ingredientes_info || []).flatMap((ingredient) => [
         ingredient.name,
         ingredient.shop,
         ingredient.drop,
         ingredient.note,
      ]),
   ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
