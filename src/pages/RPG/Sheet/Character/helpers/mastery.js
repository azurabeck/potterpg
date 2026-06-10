import masteryRules from "../../../../../assets/json/mastery_rpg.json";

const normalizeText = (text = "") => {
   return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
};

export const getMasteryByXp = (nivel, xpAtual = 0) => {
   const regra = masteryRules.maestria.find(
      (item) => normalizeText(item.aprendizado) === normalizeText(nivel)
   );

   if (!regra) {
      return {
         maestria: "-",
         dado: "-",
         xp_total: 0,
      };
   }

   let currentMastery = "-";

   Object.entries(regra.xp_maestria).forEach(([maestria, xpNecessario]) => {
      if (Number(xpAtual) >= xpNecessario) {
         currentMastery = maestria;
      }
   });

   return {
      maestria: currentMastery,
      dado: masteryRules.dados_por_maestria[currentMastery] || "-",
      xp_total: regra.xp_total,
   };
};