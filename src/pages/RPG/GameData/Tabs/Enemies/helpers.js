import { defaultBattleDice, distanceLabelMap, emptyAttack, emptyDefense } from "./constants";

export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

const normalizeDistance = (distance = "medium") => {
   const normalized = normalizeText(distance).replace(" ", "_");

   if (normalized === "curta") return "short";
   if (normalized === "media" || normalized === "média") return "medium";
   if (normalized === "longa") return "long";
   if (normalized === "curta_/_media" || normalized === "curta_/_média") return "short_medium";
   if (normalized === "media_/_longa" || normalized === "média_/_longa") return "medium_long";

   return distance || "medium";
};

export const getDistanceLabel = (distance) => distanceLabelMap[distance] || distance || "-";

export const normalizeAttack = (attack = {}, fallbackAttribute = "Ataque", fallbackName = "") => {
   if (attack === null) return null;
   const safeAttack = attack || {};

   return {
      ...emptyAttack,
      name: safeAttack.name || safeAttack.nome || fallbackName,
      attribute: safeAttack.attribute || safeAttack.atribute || fallbackAttribute,
      attribute_value: Number(safeAttack.attribute_value ?? safeAttack.atribute_value ?? 0),
      distance: normalizeDistance(safeAttack.distance || "medium"),
      effect: safeAttack.effect || safeAttack.efeito || "",
   };
};

export const normalizeDefense = (defense = {}) => {
   const safeDefense = defense || {};

   return {
      ...emptyDefense,
      attribute: safeDefense.attribute || safeDefense.atribute || "Agilidade",
      attribute_value: Number(safeDefense.attribute_value ?? safeDefense.atribute_value ?? 0),
   };
};

export const normalizeEnemy = (enemy = {}) => {
   const safeEnemy = enemy || {};

   return {
   name: safeEnemy.name || safeEnemy.nome || "",
   type: safeEnemy.type || safeEnemy.tipo || "Criatura Mágica",
   hp: Number(safeEnemy.hp || 0),
   difficulty: safeEnemy.difficulty || safeEnemy.dificuldade || "Médio",
   recommended_year: Number(safeEnemy.recommended_year ?? safeEnemy.year ?? safeEnemy.ano_recomendado ?? defaultBattleDice.recommended_year),
   impact_die: safeEnemy.impact_die || safeEnemy.dado_impacto || defaultBattleDice.impact_die,
   image_url: safeEnemy.image_url || safeEnemy.image || "",
   local: safeEnemy.local || safeEnemy.location || safeEnemy.locais || "",
   caracteristicas: safeEnemy.caracteristicas || safeEnemy.characteristics || "",
   main_attack: normalizeAttack(safeEnemy.main_attack, "Ataque", "Ataque Principal"),
   secondary_attack: normalizeAttack(safeEnemy.secondary_attack, "Controle", "Ataque Secundário"),
   defense: normalizeDefense(safeEnemy.defense),
   };
};

export const getFilteredAndSortedEnemies = ({ enemies, search, typeFilter, difficultyFilter, sort }) => {
   const normalizedSearch = normalizeText(search);

   const filtered = enemies.filter((enemy) => {
      const searchableText = normalizeText([
         enemy.name,
         enemy.type,
         enemy.difficulty,
         enemy.recommended_year,
         enemy.impact_die,
         enemy.local,
         enemy.caracteristicas,
         enemy.main_attack?.name,
         enemy.main_attack?.effect,
         enemy.secondary_attack?.name,
         enemy.secondary_attack?.effect,
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesType = !typeFilter || typeFilter === "Todos" || enemy.type === typeFilter;
      const matchesDifficulty = !difficultyFilter || difficultyFilter === "Todos" || enemy.difficulty === difficultyFilter;

      return matchesSearch && matchesType && matchesDifficulty;
   });

   return [...filtered].sort((a, b) => {
      if (sort === "hp-desc") return Number(b.hp || 0) - Number(a.hp || 0);
      if (sort === "hp-asc") return Number(a.hp || 0) - Number(b.hp || 0);

      const direction = sort === "name-desc" ? -1 : 1;
      return String(a.name || "").localeCompare(String(b.name || "")) * direction;
   });
};
