import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable, normalizeMetasRows } from "../Shared/RulePage";

const PassingYear = () => {
   const metasRows = normalizeMetasRows(ruleTables["Metas"] || []);
   const gradeRows = ruleTables["Grade Curricular Atual"] || [];

   return (
      <RulePage
         title="Ano Letivo"
         intro="Metas por ano, progressão de habilidades e grade curricular usada como referência para aulas e rotina de Hogwarts."
      >
         <RuleSection title="Metas do ano 1 e ano 2">
            <RuleTable rows={metasRows} compact />
         </RuleSection>

         <RuleSection title="Grade curricular atual">
            <RuleTable rows={gradeRows} compact />
         </RuleSection>
      </RulePage>
   );
};

export default PassingYear;
