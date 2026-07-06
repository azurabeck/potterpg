import { RulePage, RuleSection, RuleTable, SimpleList, normalizeMetasRows } from "../Shared/RulePage";
import { ruleTables } from "../Shared/rules_content";

const PassingYear = () => {
   const metasRows = normalizeMetasRows(ruleTables["Metas"] || []);
   const gradeRows = ruleTables["Grade Curricular Atual"] || [];

   const progressionRules = [
   "O personagem passa de ano ao concluir 100% das metas do ano letivo.",
   "Os exames finais não reprovam o personagem.",
   "Os exames representam o desempenho acadêmico e definem a evolução para o próximo ano.",
   "Cada exame considera tanto o resultado dos dados quanto a qualidade da solução narrativa.",
   "Criatividade, raciocínio e uso inteligente da magia podem melhorar a avaliação final.",
];

const evaluationRules = [
   "Excelente: média entre 15 e 20 com boas decisões narrativas.",
   "Bom: média entre 9 e 14 com boas decisões narrativas.",
   "Regular: média entre 4 e 8.",
   "Insuficiente: média entre 0 e 3.",
];

const progressionTable = [
   ["Desempenho Geral", "Pontos para distribuir", "Resultado"],
   ["Excelente", "10", "Passa com louvor."],
   ["Bom", "7", "Passa com bom desempenho."],
   ["Regular", "5", "Passa normalmente."],
   ["Insuficiente", "0", "Passa, mas sem evolução adicional."],
];

const notesRules = [
   "Os pontos recebidos são distribuídos livremente entre os atributos do personagem.",
   "Os pontos são distribuídos apenas no início do próximo ano letivo.",
   "Os limites máximos de atributos respeitam o teto do novo ano: 1º=5, 2º=7, 3º=9, 4º=11, 5º=12, 6º=13, 7º=14 e adulto=15.",
   "O novo teto não concede pontos automaticamente; ele apenas permite que a evolução conquistada seja distribuída até esse limite.",
   "A passagem de ano também amplia o repertório de feitiços disponíveis para aprendizado.",
   "Os exames recompensam dedicação, mas não impedem a progressão da campanha.",
];

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

         <RuleSection title="1. Aprovação">
            <SimpleList items={progressionRules} />
         </RuleSection>

         <RuleSection title="2. Avaliação dos exames">
            <SimpleList items={evaluationRules} />
         </RuleSection>

         <RuleSection title="3. Pontos de evolução">
            <RuleTable rows={progressionTable} compact />
         </RuleSection>

         <RuleSection title="4. Observações">
            <SimpleList items={notesRules} />
         </RuleSection>
      </RulePage>
   );
};

export default PassingYear;
