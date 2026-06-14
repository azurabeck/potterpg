import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable, TextBlock } from "../Shared/RulePage";

const Mastery = () => {
   const masteryRows = ruleTables["Regra Maestria"] || [];
   const attributeRules = ruleTables["Regras de Ganho de Atributos"]?.[0]?.[0];

   return (
      <RulePage
         title="Maestria"
         intro="Tabela de XP por dificuldade, dados adicionais por nível de maestria e regras de evolução de atributos."
      >
         <RuleSection title="Tabela de maestria">
            <RuleTable rows={masteryRows.slice(0, 10)} compact />
         </RuleSection>

         <RuleSection title="Dados por maestria">
            <RuleTable rows={masteryRows.slice(10)} compact />
         </RuleSection>

         <RuleSection title="Ganho de atributos">
            <TextBlock>{attributeRules}</TextBlock>
         </RuleSection>
      </RulePage>
   );
};

export default Mastery;
