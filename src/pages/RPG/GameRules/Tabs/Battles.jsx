import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const battleRules = [
   "Criaturas, construtos e obstáculos perigosos podem receber HP para serem vencidos por soma de rolagens.",
   "O valor do teste de ataque não é dano. O teste serve para saber se o ataque acerta, falha, é bloqueado ou tem efeito parcial.",
   "O dano é definido pelo grau de sucesso do ataque contra a defesa de Tomas.",
   "Tomas também possui Resistência/HP em batalhas. Quando chega a 0, ele não morre automaticamente, mas perde a batalha, cai, desmaia, é capturado ou fica incapaz de continuar.",
   "Adversários devem possuir HP, atributos de ataque, tipo de ataque, dado de dano e nível de dificuldade.",
   "Ataques de NPCs usam 1D20 + atributo do adversário contra esquiva, Protego, resistência ou outro teste coerente de Tomas.",
   "Quando fizer sentido narrativo, uma solução criativa pode encerrar a batalha sem zerar HP.",
   "Condições como petrificado, desarmado, preso, caído, queimado ou atordoado podem ser mais importantes que dano direto.",
   "Feitiços muito dominados por Tomas não precisam testar se funcionam em situações comuns; o teste só acontece quando existe resistência, oposição ou risco real.",
];

const tomasRules = [
   "Resistência inicial sugerida de Tomas no 1º ano: 100.",
   "A Resistência representa cansaço, impacto, dor, pressão e capacidade de continuar lutando.",
   "Resistência não representa morte. Ao chegar a 0, o narrador define uma consequência coerente com a cena.",
   "A Resistência aumenta por ano letivo, mas isso não significa que todos os atributos do personagem chegaram ao limite daquele ano.",
   "O limite de atributo por ano representa o máximo possível, não o valor garantido.",
];

const adversaryExamples = [
   ["Nível", "Exemplo", "HP", "Atributo 1", "Atributo 2", "Distância", "Dano base", "Dificuldade"],
   ["Muito Fácil", "Rato encantado", "20", "Ataque +1", "Agilidade +2", "Curta", "1D4", "Aluno iniciante vence com pouco risco"],
   ["Fácil", "Doxy isolada", "35", "Ataque +3", "Agilidade +5", "Curta / Média", "1D4 / 1D6", "Perigoso se ignorado"],
   ["Médio", "Armadura de treino", "75", "Ataque +5", "Resistência +6", "Curta", "1D6 / 1D8", "Exige estratégia ou bons feitiços"],
   ["Pouco Difícil", "Hipogrifo jovem hostil", "100", "Ataque +7", "Agilidade +8", "Curta / Média", "1D6 / 1D8", "Pode vencer Tomas se ele errar muito"],
   ["Difícil", "Acromântula jovem", "130", "Ataque +9", "Agilidade +7", "Curta / Média", "1D8 / 1D10", "Combate realmente perigoso"],
   ["Muito Difícil", "Troll pequeno", "180", "Força +12", "Resistência +10", "Curta", "1D10 / 1D12", "Não deve ser enfrentado sem plano"],
   ["Profissional", "Bruxo adulto treinado", "220", "Magia +14", "Controle +12", "Média / Longa", "2D8", "Acima do nível escolar"],
   ["Lendário", "Dragão adulto", "400+", "Força +18", "Resistência +18", "Curta / Média / Longa", "3D10", "Não é feito para ser vencido por combate direto"],
];

const hpByYear = [
   ["Ano Letivo", "HP Base", "Observação"],
   ["1º Ano", "100", "Aluno iniciante"],
   ["2º Ano", "125", "Maior domínio mágico"],
   ["3º Ano", "150", "Primeiros desafios realmente perigosos"],
   ["4º Ano", "175", "Confrontos contra bruxos experientes"],
   ["5º Ano", "200", "Nível O.W.L."],
   ["6º Ano", "225", "Magia avançada"],
   ["7º Ano", "250", "Formando de Hogwarts"],
   ["Adulto Treinado", "300+", "Auror, Comensal ou equivalente"],
];

const damageBySuccess = [
   ["Resultado do confronto", "Margem", "Dano", "Descrição"],
   ["Falha do atacante", "Ataque menor que defesa", "0", "Tomas evita, bloqueia ou resiste ao ataque"],
   ["Empate / raspão", "Ataque igual à defesa", "1D4", "O golpe passa de raspão ou gera pressão"],
   ["Sucesso parcial", "Ataque vence por 1 a 5", "1D4", "Impacto leve"],
   ["Sucesso normal", "Ataque vence por 6 a 11", "1D6", "Golpe limpo"],
   ["Sucesso forte", "Ataque vence por 12 a 17", "1D8", "Golpe perigoso"],
   ["Sucesso crítico", "Ataque vence por 18+", "1D10", "Golpe pesado ou condição adicional"],
];

const attributeLimitByYear = [
   ["Ano Letivo", "Limite máximo de atributo", "Observação"],
   ["1º Ano", "10", "Máximo possível no ano, não valor garantido"],
   ["2º Ano", "20", "Pode subir até esse limite se houver evolução suficiente"],
   ["3º Ano", "30", "Desafios passam a considerar maior maturidade mágica"],
   ["4º Ano", "40", "Atributos altos indicam aluno muito acima da média"],
   ["5º Ano", "50", "Nível de exames O.W.L."],
   ["6º Ano", "60", "Magia avançada"],
   ["7º Ano", "70", "Aluno próximo da formação"],
   ["Adulto Treinado", "80+", "Bruxos profissionais ou combatentes experientes"],
];

const Battles = () => {
   return (
      <RulePage
         title="Batalhas do Mundo"
         intro="Regras para encontros, criaturas, construtos mágicos, duelos e obstáculos com risco real."
      >
         <RuleSection title="Regras gerais">
            <SimpleList items={battleRules} />
         </RuleSection>

         <RuleSection title="Resistência de Tomas">
            <SimpleList items={tomasRules} />
         </RuleSection>

         <RuleSection title="HP por ano letivo">
            <RuleTable rows={hpByYear} compact />
         </RuleSection>

         <RuleSection title="Dano por grau de sucesso">
            <RuleTable rows={damageBySuccess} compact />
         </RuleSection>

         <RuleSection title="Limite de atributos por ano">
            <RuleTable rows={attributeLimitByYear} compact />
         </RuleSection>

         <RuleSection title="Tabela base de adversários">
            <RuleTable rows={adversaryExamples} compact />
         </RuleSection>
      </RulePage>
   );
};

export default Battles;