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
      const relatedIds = Array.isArray(character.relacionado)
         ? character.relacionado
         : character.relacionado
           ? [character.relacionado]
           : [];

      return isNpc(character) && character.id !== selectedCharacter.id && relatedIds.includes(selectedCharacter.id);
   });
};

export const getNpcYear = (character) => character?.year ?? character?.ano ?? "";

export const getNpcStudentYear = (character) => character?.student_year ?? character?.studentYear ?? "";

export const getYearOptions = (characters, getYearValue) => {
   const years = characters
      .map((character) => getYearValue(character))
      .filter((year) => year !== undefined && year !== null && year !== "")
      .map((year) => Number(year))
      .filter((year) => !Number.isNaN(year));

   return ["Todos", ...Array.from(new Set(years)).sort((a, b) => a - b).map(String)];
};


export const formatNpcForCopy = (npc) =>
   [
      `Nome: ${npc.name || ""}`,
      `Tipo: ${npc.tipo || ""}`,
      `Casa: ${npc.house || npc.casa || ""}`,
      `Ano do personagem: ${getNpcYear(npc) || ""}`,
      `Ano da campanha: ${getNpcStudentYear(npc) || ""}`,
      `Relação: ${npc.relacao || ""}`,
      `Confiança: ${npc.confianca ?? ""}`,
      `Amizade: ${npc.amizade ?? ""}`,
      `Características físicas: ${npc.caracteristicas || ""}`,
      `Personalidade: ${npc.personalidade || ""}`,
      `Detalhes: ${npc.detalhes || ""}`,
   ].join("\n");

export const getNpcsCopyText = (npcs = []) => npcs.map(formatNpcForCopy).join("\n\n---\n\n");

export const getMainAttributes = (attributes = {}) => {
   return Object.entries(attributes)
      .filter(([, value]) => Number(value) > 0)
      .sort(([, valueA], [, valueB]) => Number(valueB) - Number(valueA))
      .slice(0, 2)
      .map(([name]) => name)
      .join(" / ");
};

export const getFilteredAndSortedRelations = ({
   characters,
   search,
   typeFilter,
   relationFilter,
   yearFilter,
   studentYearFilter,
   sort,
}) => {
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
         getNpcYear(character),
         getNpcStudentYear(character),
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesType = !typeFilter || typeFilter === "Todos" || character.tipo === typeFilter;
      const matchesRelation = !relationFilter || relationFilter === "Todos" || character.relacao === relationFilter;
      const matchesYear = !yearFilter || yearFilter === "Todos" || String(getNpcYear(character)) === String(yearFilter);
      const matchesStudentYear = !studentYearFilter || studentYearFilter === "Todos" || String(getNpcStudentYear(character)) === String(studentYearFilter);

      return matchesSearch && matchesType && matchesRelation && matchesYear && matchesStudentYear;
   });

   return [...filtered].sort((a, b) => {
      const direction = sort === "name-desc" ? -1 : 1;
      return String(a.name || "").localeCompare(String(b.name || "")) * direction;
   });
};
