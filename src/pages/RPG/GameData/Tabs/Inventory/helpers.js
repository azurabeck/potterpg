import { emptyInventory } from "./constants";

export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getCharacterInventory = (selectedCharacter) => ({
   ...emptyInventory,
   ...(selectedCharacter?.inventario || {}),
   user_id: selectedCharacter?.inventario?.user_id || selectedCharacter?.user_id || selectedCharacter?.userId || "",
   itens: Array.isArray(selectedCharacter?.inventario?.itens) ? selectedCharacter.inventario.itens : [],
});

export const createInventoryItem = (form) => ({
   id: form.id || crypto.randomUUID(),
   categoria: form.categoria || "Outros",
   nome: form.nome || "",
   quantidade: Number(form.quantidade) || 1,
   atributo: form.atributo || "",
   valor_atributo: form.valor_atributo === "" ? "" : Number(form.valor_atributo),
   onde_encontrou: form.onde_encontrou || "",
});

export const filterItems = ({ items, search, category }) => {
   const normalizedSearch = normalizeText(search);

   return items.filter((item) => {
      const searchableText = normalizeText([
         item.categoria,
         item.nome,
         item.quantidade,
         item.atributo,
         item.valor_atributo,
         item.onde_encontrou,
      ].join(" "));

      return (!normalizedSearch || searchableText.includes(normalizedSearch)) && (!category || item.categoria === category);
   });
};

export const groupItemsByCategory = (items) => {
   return items.reduce((groups, item) => {
      const category = item.categoria || "Outros";

      return {
         ...groups,
         [category]: [...(groups[category] || []), item],
      };
   }, {});
};

export const upsertItem = (items, item) => {
   const itemExists = items.some((currentItem) => currentItem.id === item.id);

   if (!itemExists) return [...items, item];

   return items.map((currentItem) => currentItem.id === item.id ? item : currentItem);
};

export const removeItem = (items, itemId) => items.filter((item) => item.id !== itemId);
