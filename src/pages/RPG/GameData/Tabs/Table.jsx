// Legacy helper kept for compatibility. Potion data now comes from the Firestore
// collection "potions" inside the Potions tab instead of a bundled JSON file.
export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getPotionsList = () => [];
export const getPotionDisplayName = (potion) => potion?.name || "-";
