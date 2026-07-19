import masteryRules from "../../../../../assets/json/mastery_rpg.json";

export const SPELL_CATEGORIES = [
   "ofensivo",
   "defesa",
   "utilitários",
   "utilitários em batalha",
   "controle",
];

export const getSpellName = (spell) =>
   spell.attributes?.incantation?.split("(")[0].trim() ||
   spell.attributes?.name ||
   spell.name ||
   "-";

export const getSpells = (firestoreSpells = {}) =>
   Object.values(firestoreSpells).filter((spell) => spell?.id);

export const normalize = (value) =>
   String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

export const getSpellCategory = (spell) => {
   const explicitCategory =
      spell?.attributes?.spell_category ||
      spell?.attributes?.card_category ||
      spell?.spell_category ||
      spell?.card_category;

   if (explicitCategory) return explicitCategory;

   const text = normalize(`${spell?.type || ""} ${spell?.attributes?.category || ""}`);

   if (text.includes("protec") || text.includes("defesa")) return "defesa";
   if (text.includes("controle") || text.includes("desarm")) return "controle";
   if (text.includes("ataque") || text.includes("ofens")) return "ofensivo";
   if (text.includes("batalha") || text.includes("suporte") || text.includes("buff")) return "utilitários em batalha";
   if (text.includes("util")) return "utilitários";

   return "utilitários";
};

export const getSpellCardImage = ({ spell, isKnown = false } = {}) => {
   const attributes = spell?.attributes || {};

   if (isKnown) {
      return (
         attributes.card_image_url ||
         spell?.card_image_url ||
         attributes.image ||
         spell?.image ||
         attributes.image_url ||
         spell?.image_url ||
         ""
      );
   }

   return (
      attributes.image ||
      spell?.image ||
      attributes.image_url ||
      spell?.image_url ||
      ""
   );
};

export const getSpellLearningYear = (spell) =>
   spell?.attributes?.school_year || spell?.attributes?.ano_letivo || spell?.school_year || 0;

export const getSpellClass = (spell) =>
   spell?.attributes?.learned_in || spell?.attributes?.aula || spell?.learned_in || "";

export const getSpellLevel = (spell) =>
   spell?.attributes?.nivel || spell?.nivel || "";

export const getSpellAttribute = (spell) =>
   spell?.attributes?.attribute || spell?.attribute || "";

export const getSpellEffectValue = (spell) =>
   spell?.attributes?.effect_value || spell?.attributes?.effect_dice || spell?.effect_value || "";

export const getSpellMasteryByXp = (spell, xpAtual = 0) => {
   const attributes = spell?.attributes || {};
   const xpMaestria = attributes.xp_maestria || spell?.xp_maestria || {};
   let currentMastery = "M0";

   Object.entries(xpMaestria).forEach(([maestria, xpNecessario]) => {
      if (Number(xpAtual) >= Number(xpNecessario)) {
         const currentNumber = Number(String(currentMastery).replace("M", ""));
         const nextNumber = Number(String(maestria).replace("M", ""));

         if (nextNumber >= currentNumber) currentMastery = maestria;
      }
   });

   return {
      maestria: currentMastery,
      dado: masteryRules.dados_por_maestria?.[currentMastery] || "-",
      xp_total: Number(attributes.xp_total || spell?.xp_total || 0),
   };
};

const normalizeMasteryEffect = (effect = {}) => ({
   from: effect.from ?? effect.min ?? effect.de ?? "",
   to: effect.to ?? effect.max ?? effect.ate ?? "",
   label: effect.label ?? effect.titulo ?? effect.title ?? "",
   value: effect.value ?? effect.valor ?? "",
   description: effect.description ?? effect.descricao ?? effect.detalhe ?? "",
});

export const getSpellMasteryEffects = (spell) => {
   const value =
      spell?.attributes?.mastery_effects ||
      spell?.attributes?.efeito_maestria ||
      spell?.mastery_effects ||
      spell?.efeito_maestria;

   return Array.isArray(value) ? value.map(normalizeMasteryEffect) : [];
};

export const buildSpellRow = ({ spell, savedSpells }) => {
   const savedData = savedSpells?.[spell.id];

   return {
      id: spell.id,
      spell,
      savedData,
      isKnown: Boolean(savedData),
      name: getSpellName(spell),
      year: getSpellLearningYear(spell),
      required: spell.attributes?.required || spell.required || 0,
      xp: savedData?.xp ?? 0,
      level: getSpellLevel(spell),
      attribute: getSpellAttribute(spell),
      dice: getSpellEffectValue(spell),
      category: getSpellCategory(spell),
   };
};

export const filterSpells = ({ rows, search, year, level, attribute, category }) => {
   const text = normalize(search);

   return rows.filter((row) => {
      const searchable = normalize(`
         ${row.name}
         ${row.level}
         ${row.attribute}
         ${row.category}
         ${getSpellClass(row.spell)}
         ${row.spell?.attributes?.effect}
         ${row.spell?.attributes?.description}
      `);

      return (
         (!text || searchable.includes(text)) &&
         (!year || String(row.year) === String(year)) &&
         (!level || row.level === level) &&
         (!attribute || row.attribute === attribute) &&
         (!category || row.category === category)
      );
   });
};

export const sortSpells = ({ rows, sort }) => {
   const direction = sort.direction === "asc" ? 1 : -1;

   return [...rows].sort((a, b) => {
      const valueA = a[sort.key];
      const valueB = b[sort.key];

      if (typeof valueA === "number" && typeof valueB === "number") {
         return (valueA - valueB) * direction;
      }

      return String(valueA || "").localeCompare(String(valueB || "")) * direction;
   });
};

const safeJson = (value, fallback) => {
   if (!value) return fallback;
   if (typeof value !== "string") return value;

   try {
      return JSON.parse(value);
   } catch {
      return fallback;
   }
};

export const buildEditableSpellConfig = (spell) => {
   const attributes = spell?.attributes || {};

   return {
      id: spell?.id || "",
      type: spell?.type || attributes.category || "",
      attributes: {
         name: attributes.name || spell?.name || "",
         incantation: attributes.incantation || "",
         card_category: getSpellCategory(spell),
         ano_letivo: Number(attributes.ano_letivo || spell?.ano_letivo || 0),
         learned_in: attributes.learned_in || attributes.aula || "",
         nivel: attributes.nivel || spell?.nivel || "",
         attribute: attributes.attribute || spell?.attribute || "",
         required: Number(attributes.required || spell?.required || 0),
         maestria_required: Number(attributes.maestria_required || spell?.maestria_required || 0),
         xp_total: Number(attributes.xp_total || spell?.xp_total || 0),
         xp_maestria:
            attributes.xp_maestria ||
            spell?.xp_maestria ||
            {
               M1: 1,
               M2: 2,
               M3: 4,
               M4: 7,
               M5: 12,
               M6: 18,
               M7: 25,
               M8: 33,
               M9: 42,
               M10: 50,
            },
         range: attributes.range || "",
         casting_time: attributes.casting_time || "",
         concentration: attributes.concentration || "",
         description: attributes.description || "",
         effect: attributes.effect || "",
         limitation: attributes.limitation || "",
         penalty: attributes.penalty || "",
         effect_value: attributes.effect_value || attributes.effect_dice || "",
         mastery_effects: getSpellMasteryEffects(spell),
         special_rules: attributes.special_rules || spell?.special_rules || [],
         card_image_url: attributes.card_image_url || attributes.image_url || spell?.card_image_url || spell?.image_url || "",
         image_url: attributes.image_url || spell?.image_url || "",
         image: attributes.image || "",
         light: attributes.light || "",
         slug: attributes.slug || "",
         penalidade_crime_magico: attributes.penalidade_crime_magico || "",
      },
   };
};

export const buildSpellPayloadFromForm = (form) => ({
   id: form.id,
   type: form.type,
   attributes: {
      ...form.attributes,
      ano_letivo: Number(form.attributes.ano_letivo || 0),
      required: Number(form.attributes.required || 0),
      maestria_required: Number(form.attributes.maestria_required || 0),
      xp_total: Number(form.attributes.xp_total || 0),
      xp_maestria: safeJson(form.attributes.xp_maestria, form.attributes.xp_maestria),
      mastery_effects: safeJson(form.attributes.mastery_effects, []),
      special_rules: safeJson(form.attributes.special_rules, []),
   },
});

// Aceita tanto o JSON interno ({ id, type, attributes }) quanto um JSON direto
// com os campos da carta na raiz. Mantém o id do feitiço aberto quando ele não
// vier no JSON colado.
export const normalizeSpellJsonPayload = (jsonValue, currentSpell) => {
   const parsed = jsonValue && typeof jsonValue === "object" ? jsonValue : {};
   const current = buildEditableSpellConfig(currentSpell);
   const hasNestedAttributes = parsed.attributes && typeof parsed.attributes === "object" && !Array.isArray(parsed.attributes);
   const source = hasNestedAttributes ? parsed.attributes : parsed;

   const attributes = {
      ...current.attributes,
      ...(hasNestedAttributes ? parsed.attributes : {}),
      name: source.name ?? source.nome ?? current.attributes.name,
      incantation: source.incantation ?? source.conjuracao ?? current.attributes.incantation,
      card_category: source.card_category ?? source.categoria ?? current.attributes.card_category,
      ano_letivo: Number(source.ano_letivo ?? source.ano ?? current.attributes.ano_letivo ?? 0),
      learned_in: source.learned_in ?? source.aula ?? current.attributes.learned_in,
      nivel: source.nivel ?? current.attributes.nivel,
      attribute: source.attribute ?? source.atributo ?? current.attributes.attribute,
      required: Number(source.required ?? current.attributes.required ?? 0),
      maestria_required: Number(source.maestria_required ?? current.attributes.maestria_required ?? 0),
      xp_total: Number(source.xp_total ?? current.attributes.xp_total ?? 0),
      xp_maestria: source.xp_maestria ?? current.attributes.xp_maestria,
      range: source.range ?? source.alcance ?? current.attributes.range,
      casting_time: source.casting_time ?? source.tempo_conjuracao ?? current.attributes.casting_time,
      concentration: source.concentration ?? source.concentracao ?? current.attributes.concentration,
      description: source.description ?? source.detalhes ?? current.attributes.description,
      effect: source.effect ?? source.efeito ?? current.attributes.effect,
      limitation: source.limitation ?? source.outros_detalhes ?? current.attributes.limitation,
      penalty: source.penalty ?? source.penalidades ?? current.attributes.penalty,
      effect_value: source.effect_value ?? source.effect_dice ?? current.attributes.effect_value,
      mastery_effects: source.mastery_effects ?? source.efeito_maestria ?? current.attributes.mastery_effects,
      special_rules: source.special_rules ?? source.regras_especiais ?? current.attributes.special_rules,
      card_image_url: source.card_image_url ?? source.image_url ?? current.attributes.card_image_url,
      image_url: source.image_url ?? source.card_image_url ?? current.attributes.image_url,
      image: source.image ?? current.attributes.image,
      light: source.light ?? source.luz ?? current.attributes.light,
      slug: source.slug ?? current.attributes.slug,
      penalidade_crime_magico: source.penalidade_crime_magico ?? current.attributes.penalidade_crime_magico,
   };

   return buildSpellPayloadFromForm({
      id: parsed.id || current.id || currentSpell?.id || "",
      type: parsed.type || parsed.tipo || current.type || "",
      attributes,
   });
};
