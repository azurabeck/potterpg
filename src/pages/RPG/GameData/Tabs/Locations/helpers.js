export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getCharacterUserId = (selectedCharacter) =>
   selectedCharacter?.user_id || selectedCharacter?.userId || "";

export const getCharacterNameById = (characters = [], characterId = "") => {
   const character = characters.find((item) => item.id === characterId);
   return character?.name || characterId;
};

export const getAccessNames = (location, characters = []) => {
   const ids = location?.access_character_ids || [];
   if (!ids.length) return "Livre / não definido";

   return ids.map((id) => getCharacterNameById(characters, id)).join(", ");
};

export const normalizeLocationPayload = ({ location = {}, selectedCharacter, userId }) => ({
   name: location.name || location.nome || "",
   characteristics: location.characteristics || location.caracteristicas || "",
   importance: location.importance || location.importancia || "",
   access_character_ids:
      location.access_character_ids ||
      location.quem_tem_acesso ||
      location.accessCharacters ||
      [],
   image_url: location.image_url || location.image || "",
   type: location.type || location.tipo || "Público",
   user_id: userId || getCharacterUserId(selectedCharacter),
});

export const getFilteredAndSortedLocations = ({ locations, search, typeFilter, accessFilter, sort, characters }) => {
   const normalizedSearch = normalizeText(search);

   const filtered = locations.filter((location) => {
      const accessNames = getAccessNames(location, characters);
      const searchableText = normalizeText([
         location.name,
         location.type,
         location.characteristics,
         location.importance,
         accessNames,
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesType = !typeFilter || typeFilter === "Todos" || location.type === typeFilter;
      const matchesAccess = !accessFilter || accessFilter === "Todos" || location.access_character_ids?.includes(accessFilter);

      return matchesSearch && matchesType && matchesAccess;
   });

   return [...filtered].sort((a, b) => {
      if (sort === "type-asc") {
         return String(a.type || "").localeCompare(String(b.type || ""));
      }

      const direction = sort === "name-desc" ? -1 : 1;
      return String(a.name || "").localeCompare(String(b.name || "")) * direction;
   });
};
