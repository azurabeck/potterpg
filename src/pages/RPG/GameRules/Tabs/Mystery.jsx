import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable } from "../Shared/RulePage";

const Mystery = () => {
   const mysteryRows = ruleTables["Mistérios"] || [];

   return (
      <RulePage
         title="Mistérios"
         intro="Resumo dos mistérios ativos, encerrados e pessoas de interesse para manter a investigação consistente."
      >
         <RuleSection title="Registro de mistérios">
            <RuleTable rows={mysteryRows} compact />
         </RuleSection>
      </RulePage>
   );
};

export default Mystery;
