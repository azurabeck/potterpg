export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getCharacterUserId = (selectedCharacter) =>
   selectedCharacter?.user_id || selectedCharacter?.userId || "";

export const isNpc = (character) => character?.character_type === "npc";

export const getRelatedCharacters = ({ characters, selectedCharacter }) => {
   if (!selectedCharacter?.id) return [];

   return characters.filter((character) => {
      return isNpc(character) && character.id !== selectedCharacter.id && character.relacionado === selectedCharacter.id;
   });
};

export const getMainAttributes = (attributes = {}) => {
   return Object.entries(attributes)
      .filter(([, value]) => Number(value) > 0)
      .sort(([, valueA], [, valueB]) => Number(valueB) - Number(valueA))
      .slice(0, 2)
      .map(([name]) => name)
      .join(" / ");
};

export const getFilteredAndSortedRelations = ({ characters, search, typeFilter, relationFilter, sort }) => {
   const normalizedSearch = normalizeText(search);

   const filtered = characters.filter((character) => {
      const searchableText = normalizeText([
         character.name,
         character.tipo,
         character.casa,
         character.relacao,
         character.detalhes,
         character.caracteristicas,
         character.personalidade,
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesType = !typeFilter || typeFilter === "Todos" || character.tipo === typeFilter;
      const matchesRelation = !relationFilter || relationFilter === "Todos" || character.relacao === relationFilter;

      return matchesSearch && matchesType && matchesRelation;
   });

   return [...filtered].sort((a, b) => {
      const direction = sort === "name-desc" ? -1 : 1;
      return String(a.name || "").localeCompare(String(b.name || "")) * direction;
   });
};
