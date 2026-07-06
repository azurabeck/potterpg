import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable, SimpleList, TextBlock } from "../Shared/RulePage";

const newMasteryRules = [
   "A collection spells contém xp_maestria, xp_total e mastery_effects de cada feitiço.",
   "A ficha do personagem guarda o XP atual conquistado naquele feitiço.",
   "A maestria atual M1–M10 é calculada comparando o XP atual do personagem com xp_maestria do feitiço.",
   "Em combate, maestria não adiciona mais dado ao teste de acerto.",
   "A maestria seleciona o efeito correspondente em mastery_effects: dano, duração, distância, bônus ou outra consequência.",
   "Feitiços podem ter progressões diferentes. Não existe mais um dado universal de maestria para todos os feitiços.",
];

const Mastery = () => {
   const masteryRows = ruleTables["Regra Maestria"] || [];
   const attributeRules = ruleTables["Regras de Ganho de Atributos"]?.[0]?.[0];

   return (
      <RulePage title="Maestria" intro="XP individual do personagem e efeitos próprios definidos por cada feitiço.">
         <RuleSection title="Nova regra de maestria"><SimpleList items={newMasteryRules} /></RuleSection>
         <RuleSection title="Tabela de XP por dificuldade"><RuleTable rows={masteryRows.slice(0, 10)} compact /></RuleSection>
         <RuleSection title="Ganho de atributos"><TextBlock>{attributeRules}</TextBlock></RuleSection>
      </RulePage>
   );
};

export default Mastery;
