import { defaultDamage, distanceLabelMap, emptyAttack, emptyDefense } from "./constants";

export const normalizeText = (text = "") =>
   String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

const legacyDamageKeyMap = {
   sucesso_parcial: "partial",
   partial_success: "partial",
   parcial: "partial",
   partial: "partial",

   sucesso_normal: "normal",
   normal_success: "normal",
   normal: "normal",

   sucesso_forte: "strong",
   strong_success: "strong",
   forte: "strong",
   strong: "strong",

   sucesso_critico: "critical",
   sucesso_crítico: "critical",
   critical_success: "critical",
   critico: "critical",
   crítico: "critical",
   critical: "critical",
};

export const normalizeDamage = (damage = {}) => {
   if (!damage) return null;

   const normalizedDamage = { ...defaultDamage };

   Object.entries(damage || {}).forEach(([key, value]) => {
      const normalizedKey = legacyDamageKeyMap[key] || key;
      if (["partial", "normal", "strong", "critical"].includes(normalizedKey)) {
         normalizedDamage[normalizedKey] = value;
      }
   });

   return normalizedDamage;
};

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

   return {
      ...emptyAttack,
      name: attack?.name || attack?.nome || fallbackName,
      attribute: attack?.attribute || attack?.atribute || fallbackAttribute,
      attribute_value: Number(attack?.attribute_value ?? attack?.atribute_value ?? 0),
      distance: normalizeDistance(attack?.distance || "medium"),
      effect: attack?.effect || attack?.efeito || "",
      damage: normalizeDamage(attack?.damage),
   };
};

export const normalizeDefense = (defense = {}) => ({
   ...emptyDefense,
   attribute: defense?.attribute || defense?.atribute || "Agilidade",
   attribute_value: Number(defense?.attribute_value ?? defense?.atribute_value ?? 0),
});

export const normalizeEnemy = (enemy = {}) => ({
   name: enemy.name || enemy.nome || "",
   type: enemy.type || enemy.tipo || "Criatura Mágica",
   hp: Number(enemy.hp || 0),
   difficulty: enemy.difficulty || enemy.dificuldade || "Médio",
   image_url: enemy.image_url || enemy.image || "",
   local: enemy.local || enemy.location || enemy.locais || "",
   caracteristicas: enemy.caracteristicas || enemy.characteristics || "",
   main_attack: normalizeAttack(enemy.main_attack, "Ataque", "Ataque Principal"),
   secondary_attack: normalizeAttack(enemy.secondary_attack, "Controle", "Ataque Secundário"),
   defense: normalizeDefense(enemy.defense),
});

export const getFilteredAndSortedEnemies = ({ enemies, search, typeFilter, difficultyFilter, sort }) => {
   const normalizedSearch = normalizeText(search);

   const filtered = enemies.filter((enemy) => {
      const searchableText = normalizeText([
         enemy.name,
         enemy.type,
         enemy.difficulty,
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

export const formatDamage = (damage = {}) => {
   const normalizedDamage = normalizeDamage(damage);
   if (!normalizedDamage) return "Sem dano direto";

   return [
      `Parcial: ${normalizedDamage.partial || "-"}`,
      `Normal: ${normalizedDamage.normal || "-"}`,
      `Forte: ${normalizedDamage.strong || "-"}`,
      `Crítico: ${normalizedDamage.critical || "-"}`,
   ].join(" | ");
};
