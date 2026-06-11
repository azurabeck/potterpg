export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getUserId = (selectedCharacter) =>
   selectedCharacter?.user_id || selectedCharacter?.userId || "";

export const normalizeClues = (clues = []) =>
   clues.map((clue, index) => ({
      order: Number(clue.order || index + 1),
      name: clue.name || "",
      question: clue.question || "",
      details: clue.details || "",
      resolution: clue.resolution || "",
      status: clue.status || "em aberto",
   }));

export const normalizeMystery = (docSnap) => {
   const data = docSnap.data();

   return {
      id: docSnap.id,
      user_id: data.user_id || data.userid || "",
      character_id: data.character_id || "",
      name: data.name || "Mistério sem nome",
      year: data.year || data.ano || "",
      last_appearance: data.last_appearance || data.ultima_aparicao || "",
      status: data.status || "em andamento",
      clues: normalizeClues(Array.isArray(data.clues) ? data.clues : data.pistas || []),
      created_at: data.created_at || null,
      updated_at: data.updated_at || null,
   };
};

export const buildMysteryPayload = ({ form, selectedCharacter }) => ({
   user_id: form.user_id || getUserId(selectedCharacter),
   character_id: selectedCharacter?.id || form.character_id || "",
   name: form.name || "Mistério sem nome",
   year: Number(form.year || 1),
   last_appearance: form.last_appearance || "",
   status: form.status || "em andamento",
   clues: normalizeClues(form.clues || []),
});

export const filterMysteries = ({ mysteries, search, statusFilter, yearFilter }) => {
   const normalizedSearch = normalizeText(search);

   return mysteries.filter((mystery) => {
      const searchableText = normalizeText([
         mystery.name,
         mystery.year,
         mystery.last_appearance,
         mystery.status,
         mystery.clues.map((clue) => `${clue.name} ${clue.question} ${clue.details} ${clue.resolution} ${clue.status}`).join(" "),
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesStatus = !statusFilter || mystery.status === statusFilter;
      const matchesYear = !yearFilter || String(mystery.year) === String(yearFilter);

      return matchesSearch && matchesStatus && matchesYear;
   });
};

export const sortMysteries = ({ mysteries, sort }) => {
   return [...mysteries].sort((a, b) => {
      if (sort === "name-desc") return String(b.name || "").localeCompare(String(a.name || ""));
      if (sort === "year-asc") return Number(a.year || 0) - Number(b.year || 0);
      if (sort === "year-desc") return Number(b.year || 0) - Number(a.year || 0);
      return String(a.name || "").localeCompare(String(b.name || ""));
   });
};

export const getFilteredAndSortedMysteries = ({ mysteries, search, sort, statusFilter, yearFilter }) =>
   sortMysteries({ mysteries: filterMysteries({ mysteries, search, statusFilter, yearFilter }), sort });

export const getYears = (mysteries) =>
   [...new Set(mysteries.map((mystery) => mystery.year))]
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
