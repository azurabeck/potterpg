import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable, TextBlock } from "../Shared/RulePage";

const IA = () => {
   const narrativeRows = ruleTables["Regra Narrativa"] || [];
   const pendingRows = ruleTables["Pendências do Narrador"] || [];
   const introRules = narrativeRows.slice(0, 31);
   const essentialRules = narrativeRows[31]?.[0];
   const mysteryProgression = narrativeRows[32]?.[0];
   const schoolStructure = narrativeRows.slice(33, 43);
   const diceRules = narrativeRows.slice(43, 49);
   const classRules = narrativeRows.slice(49);

   return (
      <RulePage
         title="Narração IA"
         intro="Regras fixas para conduzir a campanha com continuidade, espaço para decisão do jogador e respeito às informações já registradas."
      >
         <RuleSection title="Regras narrativas principais">
            <RuleTable rows={introRules} />
         </RuleSection>

         <RuleSection title="Regras essenciais">
            <TextBlock>{essentialRules}</TextBlock>
         </RuleSection>

         <RuleSection title="Progressão de mistérios">
            <TextBlock>{mysteryProgression}</TextBlock>
         </RuleSection>

         <RuleSection title="Estrutura do ano escolar">
            <RuleTable rows={schoolStructure} compact />
         </RuleSection>

         <RuleSection title="Dados e testes">
            <RuleTable rows={diceRules} compact />
         </RuleSection>

         <RuleSection title="Sistema de aulas">
            <RuleTable rows={classRules} compact />
         </RuleSection>

         <RuleSection title="Pendências do narrador">
            <RuleTable rows={pendingRows} />
         </RuleSection>
      </RulePage>
   );
};

export default IA;
