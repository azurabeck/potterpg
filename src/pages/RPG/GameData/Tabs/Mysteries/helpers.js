import { categoryOptions } from "./constants";

export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();

export const getUserId = (selectedCharacter) =>
   selectedCharacter?.user_id || selectedCharacter?.userId || "";

export const getMysteryCategory = (category) => {
   const normalizedCategory = normalizeText(category);

   if (normalizedCategory.includes("proxima") || normalizedCategory.includes("sessao")) return "proxima sessão";
   if (normalizedCategory.includes("pendencia") || normalizedCategory.includes("narrador") || normalizedCategory.includes("narrativa")) return "pendencias narrador";
   return "mistérios";
};

export const getMysteryDisplayName = (mystery) => {
   if (mystery.category === "pendencias narrador") return mystery.awaited_event || mystery.name || "Pendência sem evento";
   return mystery.name || "Mistério sem nome";
};

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
   const category = getMysteryCategory(data.category || data.categoria || "mistérios");

   return {
      id: docSnap.id,
      user_id: data.user_id || data.userid || "",
      character_id: data.character_id || "",
      category,
      name: data.name || data.nome || data.title || "",
      year: data.year || data.ano || "",
      last_appearance: data.last_appearance || data.ultima_aparicao || "",
      status: data.status || "em andamento",
      clues: normalizeClues(Array.isArray(data.clues) ? data.clues : data.pistas || []),
      details: data.details || data.detalhes || data.description || "",
      next_session: Boolean(data.next_session ?? data.proxima_sessao ?? category === "proxima sessão"),
      awaited_event: data.awaited_event || data.evento_aguardado || data.name || "",
      current_situation: data.current_situation || data.situacao_atual || "",
      responder: data.responder || data.who_can_answer || data.quem_pode_responder || "",
      created_at: data.created_at || null,
      updated_at: data.updated_at || null,
   };
};

export const buildMysteryPayload = ({ form, selectedCharacter }) => {
   const category = getMysteryCategory(form.category);

   const basePayload = {
      user_id: form.user_id || getUserId(selectedCharacter),
      character_id: selectedCharacter?.id || form.character_id || "",
      category,
      year: Number(form.year || 1),
      status: form.status || "em andamento",
   };

   if (category === "proxima sessão") {
      return {
         ...basePayload,
         name: form.name || "Próxima sessão sem nome",
         details: form.details || "",
         next_session: Boolean(form.next_session),
         last_appearance: "",
         clues: [],
      };
   }

   if (category === "pendencias narrador") {
      return {
         ...basePayload,
         name: form.awaited_event || form.name || "Pendência sem evento",
         awaited_event: form.awaited_event || form.name || "",
         current_situation: form.current_situation || "",
         responder: form.responder || "",
         last_appearance: "",
         clues: [],
      };
   }

   return {
      ...basePayload,
      name: form.name || "Mistério sem nome",
      last_appearance: form.last_appearance || "",
      clues: normalizeClues(form.clues || []),
   };
};

export const filterMysteries = ({ mysteries, search, statusFilter, yearFilter, categoryFilter }) => {
   const normalizedSearch = normalizeText(search);

   return mysteries.filter((mystery) => {
      const searchableText = normalizeText([
         mystery.category,
         mystery.name,
         mystery.year,
         mystery.last_appearance,
         mystery.status,
         mystery.details,
         mystery.awaited_event,
         mystery.current_situation,
         mystery.responder,
         mystery.clues.map((clue) => `${clue.name} ${clue.question} ${clue.details} ${clue.resolution} ${clue.status}`).join(" "),
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesStatus = !statusFilter || mystery.status === statusFilter;
      const matchesYear = !yearFilter || String(mystery.year) === String(yearFilter);
      const matchesCategory = !categoryFilter || mystery.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesYear && matchesCategory;
   });
};

export const sortMysteries = ({ mysteries, sort }) => {
   return [...mysteries].sort((a, b) => {
      if (sort === "name-desc") return String(getMysteryDisplayName(b)).localeCompare(String(getMysteryDisplayName(a)));
      if (sort === "year-asc") return Number(a.year || 0) - Number(b.year || 0);
      if (sort === "year-desc") return Number(b.year || 0) - Number(a.year || 0);
      return String(getMysteryDisplayName(a)).localeCompare(String(getMysteryDisplayName(b)));
   });
};

export const getFilteredAndSortedMysteries = ({ mysteries, search, sort, statusFilter, yearFilter, categoryFilter }) =>
   sortMysteries({ mysteries: filterMysteries({ mysteries, search, statusFilter, yearFilter, categoryFilter }), sort });

export const groupMysteriesByCategory = (mysteries = []) =>
   categoryOptions.reduce((groups, category) => ({
      ...groups,
      [category]: mysteries.filter((mystery) => mystery.category === category),
   }), {});

export const getYears = (mysteries) =>
   [...new Set(mysteries.map((mystery) => mystery.year))]
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
