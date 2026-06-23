import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const battleRules = [
   "Criaturas, construtos e obstáculos perigosos podem receber HP.",
   "Adversários possuem 2 atributos principais: um atributo de ataque e um atributo de defesa.",
   "O atributo de ataque é usado quando o adversário tenta atingir Tomas.",
   "O atributo de defesa é usado quando o adversário tenta resistir, esquivar, bloquear ou evitar um ataque de Tomas.",
   "Quando Tomas ataca, o dano causado é calculado pela diferença entre o ataque total de Tomas e a defesa total do adversário.",
   "Quando o adversário ataca, o dano contra Tomas depende do grau de sucesso do ataque.",
   "Condições como petrificado, preso, caído, queimado, desarmado ou atordoado podem ser mais importantes que dano direto.",
   "Soluções criativas podem encerrar uma batalha sem zerar HP.",
];

const tomasAttackRules = [
   "Tomas rola o ataque usando: dado do feitiço + dado de maestria + atributo compatível.",
   "O adversário rola defesa usando: 1D20 + atributo defensivo.",
   "Dano causado por Tomas = ataque total de Tomas - defesa total do adversário.",
   "Se a defesa do adversário for igual ou maior que o ataque de Tomas, o dano é 0.",
   "O narrador pode aplicar dano extra ou condição se Tomas usar o ambiente de forma criativa.",
];

const tomasAttackExample = [
   ["Situação", "Valor"],
   ["Ataque total de Tomas", "30"],
   ["Defesa total da Acromântula", "10"],
   ["Cálculo", "30 - 10"],
   ["Dano causado", "20"],
];

const adversaryAttackRules = [
   "O adversário rola ataque usando: 1D20 + atributo de ataque.",
   "Tomas responde com esquiva, Protego, resistência ou outro teste coerente.",
   "Compare o ataque total do adversário com a defesa total de Tomas.",
   "Se o adversário vencer, a diferença define o grau de sucesso.",
   "O grau de sucesso define qual dado de dano será rolado contra Tomas.",
   "Se houver empate, Tomas não sofre dano. A próxima ação fica com quem tiver maior Agilidade.",
];

const adversaryAttackExample = [
   ["Situação", "Valor"],
   ["Ataque total da Acromântula", "34"],
   ["Defesa total de Tomas", "30"],
   ["Diferença", "4"],
   ["Resultado", "Sucesso parcial"],
   ["Dano rolado contra Tomas", "1D4"],
];

const adversaryDamageBySuccess = [
   ["Resultado", "Diferença", "Dano contra Tomas", "Efeito"],
   ["Falha", "Ataque menor que defesa", "0", "Tomas evita, bloqueia ou resiste."],
   ["Empate / raspão", "Ataque igual à defesa", "0", "Sem dano. Próxima ação vai para quem tiver maior Agilidade."],
   ["Sucesso parcial", "1 a 5", "1D4", "Impacto leve."],
   ["Sucesso normal", "6 a 11", "1D6", "Golpe limpo."],
   ["Sucesso forte", "12 a 17", "1D8", "Golpe perigoso."],
   ["Sucesso crítico", "18+", "1D10", "Golpe pesado ou condição adicional."],
];

const tomasRules = [
   "Resistência inicial de Tomas no 1º ano: 100.",
   "A Resistência representa cansaço, impacto, dor, pressão e capacidade de continuar lutando.",
   "Resistência não representa morte.",
   "Quando Tomas chega a 0 de Resistência, ele perde a cena: desmaia, cai, é capturado, precisa ser salvo ou falha na missão.",
   "Morrer não é a consequência padrão. A derrota deve gerar custo narrativo real.",
];

const hpByYear = [
   ["Ano Letivo", "HP Base", "Observação"],
   ["1º Ano", "100", "Aluno iniciante"],
   ["2º Ano", "125", "Maior domínio mágico"],
   ["3º Ano", "150", "Primeiros desafios perigosos"],
   ["4º Ano", "175", "Confrontos contra bruxos experientes"],
   ["5º Ano", "200", "Nível O.W.L."],
   ["6º Ano", "225", "Magia avançada"],
   ["7º Ano", "250", "Formando de Hogwarts"],
   ["Adulto Treinado", "300+", "Auror, Comensal ou equivalente"],
];

const attributeLimitByYear = [
   ["Ano Letivo", "Limite máximo", "Observação"],
   ["1º Ano", "10", "Máximo possível no ano, não valor garantido"],
   ["2º Ano", "20", "Pode subir até esse limite se houver evolução suficiente"],
   ["3º Ano", "30", "Desafios consideram maior maturidade mágica"],
   ["4º Ano", "40", "Aluno muito acima da média"],
   ["5º Ano", "50", "Nível O.W.L."],
   ["6º Ano", "60", "Magia avançada"],
   ["7º Ano", "70", "Aluno próximo da formação"],
   ["Adulto Treinado", "80+", "Bruxos profissionais ou combatentes experientes"],
];

const adversaryExamples = [
   ["Nível", "Exemplo", "HP", "Ataque", "Defesa", "Dano", "Observação"],
   ["Muito Fácil", "Rato encantado", "20", "+1", "+2", "1D4", "Pouco risco"],
   ["Fácil", "Doxy isolada", "35", "+3", "+5", "1D4 / 1D6", "Perigoso se ignorado"],
   ["Médio", "Armadura de treino", "75", "+5", "+6", "1D6 / 1D8", "Exige estratégia"],
   ["Difícil", "Acromântula", "80", "+6", "+7", "1D6 / 1D8", "Combate perigoso"],
   ["Difícil", "Acromântula Matriarca", "130", "+8", "+10", "1D8 / 1D10", "Chefe de criatura"],
   ["Muito Difícil", "Troll pequeno", "180", "+12", "+10", "1D10 / 1D12", "Não enfrentar sem plano"],
   ["Profissional", "Bruxo adulto treinado", "220", "+14", "+12", "2D8", "Acima do nível escolar"],
   ["Lendário", "Dragão adulto", "400+", "+18", "+18", "3D10", "Não vencer em combate direto"],
];

const Battles = () => {
   return (
      <RulePage
         title="Batalhas do Mundo"
         intro="Regras para criaturas, construtos, duelos e obstáculos com risco real."
      >
         <RuleSection title="1. Regras gerais">
            <SimpleList items={battleRules} />
         </RuleSection>

         <RuleSection title="2. Quando Tomas ataca">
            <SimpleList items={tomasAttackRules} />
            <RuleTable rows={tomasAttackExample} compact />
         </RuleSection>

         <RuleSection title="3. Quando o adversário ataca">
            <SimpleList items={adversaryAttackRules} />
            <RuleTable rows={adversaryAttackExample} compact />
         </RuleSection>

         <RuleSection title="4. Dano causado em Tomas">
            <RuleTable rows={adversaryDamageBySuccess} compact />
         </RuleSection>

         <RuleSection title="5. Resistência de Tomas">
            <SimpleList items={tomasRules} />
         </RuleSection>

         <RuleSection title="6. HP por ano letivo">
            <RuleTable rows={hpByYear} compact />
         </RuleSection>

         <RuleSection title="7. Limite de atributos por ano">
            <RuleTable rows={attributeLimitByYear} compact />
         </RuleSection>

         <RuleSection title="8. Base de adversários">
            <RuleTable rows={adversaryExamples} compact />
         </RuleSection>
      </RulePage>
   );
};

export default Battles;