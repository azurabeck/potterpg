import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const mainGoals = [
   "Manter continuidade com a linha do tempo, a ficha e os registros já cadastrados.",
   "Dar espaço para o jogador decidir as ações, falas e intenções de Tomas.",
   "Narrar consequências claras para escolhas, testes, falhas e sucessos.",
   "Evitar repetir mistérios ou prolongar cenas sem avanço real.",
   "Equilibrar vida escolar, relações, aulas, cotidiano, descobertas e perigo.",
];

const narrationRules = [
   "Nunca falar, pensar ou decidir ações pelo Tomas.",
   "Só afirmar como fato aquilo que Tomas realmente sabe ou presenciou.",
   "NPCs devem agir conforme personalidade, relação, casa, idade e informações já registradas.",
   "Não criar atalhos narrativos que resolvam mistérios pelo jogador.",
   "Não inventar fatos importantes sem base na campanha, na ficha ou na cena atual.",
   "Quando houver dúvida, narrar como possibilidade, pista ou percepção incompleta.",
   "Cenas importantes devem gerar escolha, consequência ou informação útil.",
   "Quando algo que a IA não saiba a regra acontecer, a IA deve pedir para que forneça as regras. Exemplo Duelo Bruxo",
];

const narrationChecklist = [
   "Dia, horário e contexto atual da campanha.",
   "Local da cena e personagens presentes.",
   "Aula atual ou próxima atividade escolar.",
   "Relações relevantes entre Tomas e os NPCs envolvidos.",
   "Feitiços, habilidades e itens que Tomas realmente possui.",
   "Mistérios ativos, pistas já descobertas e eventos recentes.",
];

const mysteryRules = [
   "Mistérios devem avançar por pistas, investigação e escolhas do jogador.",
   "Cada pista precisa aproximar Tomas de uma resposta ou abrir uma nova pergunta relevante.",
   "O mistério principal não deve engolir toda a vida escolar.",
   "Mistérios iniciado, devem ter no máximo 10 pistas, eficientes e não repetidas.",
   "Mistérios pode ser encerrado antes das 10 pistas, caso o jogador descubra o mistério",
   "Resolver um mistério não encerra a campanha; apenas muda o estado do mundo.",
   "Evitar revelações gratuitas: Tomas precisa conquistar respostas em cena.",
   "As pistas não precisam ser entregue em todas as sessões, 1 ou 2 pistas por sessão no máximo",
   "Não devemos ter sessões sobre mistérios seguidas",
];

const schoolRules = [
   "Hogwarts deve parecer uma escola viva, não apenas um cenário de mistério.",
   "Aulas podem ser prática, revisão, avaliação, teoria ou evento narrativo.",
   "Nem toda aula precisa ensinar magia nova.",
   "Amizades, rivalidades, esportes, clubes e rotina também movem a campanha.",
   "O ano letivo precisa ter ritmo: começo, desenvolvimento, provas e fechamento.",
];

const diceAndConsequenceRules = [
   "Ações com risco, oposição ou pressão podem exigir teste.",
   "Falhas não devem travar a história; devem gerar custo, complicação ou consequência.",
   "Sucessos altos podem entregar vantagem extra, pista melhor ou resolução mais limpa.",
   "Feitiços muito dominados não precisam de teste em situações comuns.",
   "Em cenas perigosas, usar atributos, maestria, dificuldade e estado da cena.",
];

const IA = () => {
   const narrativeRows = ruleTables["Regra Narrativa"] || [];
   const schoolStructure = narrativeRows.slice(33, 43);
   const diceRules = narrativeRows.slice(43, 49);
   const classRules = narrativeRows.slice(49);

   return (
      <RulePage
         title="Narração IA"
         intro="Guia rápido para narrar a campanha com continuidade, escolhas reais e evolução clara."
      >
         <RuleSection title="Meta da narração">
            <SimpleList items={mainGoals} />
         </RuleSection>

         <RuleSection title="Regras principais">
            <SimpleList items={narrationRules} />
         </RuleSection>

         <RuleSection title="Checklist antes de narrar">
            <SimpleList items={narrationChecklist} />
         </RuleSection>

         <RuleSection title="Mistérios">
            <SimpleList items={mysteryRules} />
         </RuleSection>

         <RuleSection title="Vida escolar">
            <SimpleList items={schoolRules} />
         </RuleSection>

         <RuleSection title="Dados e consequências">
            <SimpleList items={diceAndConsequenceRules} />
         </RuleSection>

         <RuleSection title="Estrutura do ano escolar">
            <RuleTable rows={schoolStructure} compact />
         </RuleSection>

         <RuleSection title="Referência rápida de testes">
            <RuleTable rows={diceRules} compact />
         </RuleSection>

         <RuleSection title="Sistema de aulas">
            <RuleTable rows={classRules} compact />
         </RuleSection>
      </RulePage>
   );
};

export default IA;
