import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const battleRules = [
   "Criaturas, construtos e obstáculos perigosos podem receber HP.",
   "Adversários possuem 2 atributos principais: um atributo de ataque e um atributo de defesa.",
   "O atributo de ataque é usado quando o adversário tenta atingir Tomas.",
   "O atributo de defesa é usado quando o adversário tenta resistir, esquivar, bloquear ou evitar um ataque de Tomas.",
   "Ataques e defesas usam atributo + rolagem. O dano final usa a diferença entre ataque e defesa + dado de impacto.",
   "O dado de impacto de Tomas vem do feitiço usado. O dado de impacto da criatura vem da ficha do adversário.",
   "Condições como petrificado, preso, caído, queimado, envenenado, desarmado ou atordoado podem ser mais importantes que dano direto.",
   "Soluções criativas podem encerrar uma batalha sem zerar HP.",
   "Se uma cena ultrapassar consistentemente 20 rodadas, o HP ou a defesa do adversário provavelmente estão altos demais.",
];

const tomasAttackRules = [
   "Tomas rola ataque usando: atributo compatível + dado de maestria + dado do feitiço.",
   "O adversário rola defesa usando: atributo defensivo + 1D20.",
   "Se o ataque de Tomas vencer a defesa, o dano causado é: diferença + dado de impacto do feitiço.",
   "Se a defesa for igual ou maior que o ataque, o dano é 0.",
   "Feitiços mais poderosos possuem dados de impacto maiores.",
   "Feitiços de controle podem causar pouco ou nenhum dano, mas aplicar condições importantes.",
];

const tomasAttackExample = [
   ["Situação", "Valor"],
   ["Atributo de Tomas", "20"],
   ["Dado de maestria", "1D6 = 4"],
   ["Dado do feitiço", "1D20 = 12"],
   ["Ataque total", "36"],
   ["Defesa da Acromântula", "18 + 1D20 = 27"],
   ["Diferença", "9"],
   ["Impacto do feitiço", "1D10 = 6"],
   ["Dano causado", "15"],
];

const adversaryAttackRules = [
   "Criaturas e construtos rolam ataque usando: atributo de ataque + 1D20.",
   "Tomas responde com atributo defensivo + dado de maestria + dado defensivo escolhido.",
   "Se o adversário vencer a defesa, o dano causado é: diferença + dado de impacto da criatura.",
   "Se a defesa de Tomas for igual ou maior que o ataque, o dano é 0.",
   "Ataques secundários usam a mesma regra, mas podem causar efeitos narrativos em vez de dano direto.",
];

const adversaryAttackExample = [
   ["Situação", "Valor"],
   ["Ataque da Acromântula", "20 + 1D20 = 32"],
   ["Defesa de Tomas", "18 + 1D6 + 1D20 = 29"],
   ["Diferença", "3"],
   ["Impacto da criatura", "1D4 = 2"],
   ["Dano em Tomas", "5"],
];

const impactDamageRules = [
   ["Tipo", "Dano"],
   ["Falha ou empate", "0"],
   ["Ataque bem-sucedido", "Diferença + dado de impacto"],
   ["Feitiço leve", "Diferença + 1D4"],
   ["Feitiço comum", "Diferença + 1D6"],
   ["Feitiço forte", "Diferença + 1D8"],
   ["Feitiço explosivo", "Diferença + 1D10"],
   ["Feitiço avançado", "Diferença + 2D10"],
   ["Feitiço lendário", "Diferença + 3D10"],
   ["Criatura fraca", "Diferença + 1D4 / 1D6"],
   ["Criatura comum", "Diferença + 1D8 / 1D10"],
   ["Criatura forte", "Diferença + 2D10"],
   ["Criatura lendária", "Diferença + 3D10"],
   ["Criatura mítica", "Diferença + 4D10"],
];

const spellImpactExamples = [
   ["Feitiço", "Impacto", "Observação"],
   ["Expelliarmus", "1D4", "Mais útil para desarmar do que ferir."],
   ["Flipendo", "1D6", "Empurra, derruba e pode usar o ambiente."],
   ["Incendio", "1D6", "Pode causar queimadura por rodadas."],
   ["Reducto", "1D8", "Destrutivo contra objetos, teias e estruturas."],
   ["Bombarda", "1D10", "Explosão direta."],
   ["Confringo", "2D10", "Explosão avançada e perigosa."],
];

const conditionRules = [
   "Estados como imobilização, queimadura e veneno só são aplicados quando o ataque ou efeito vence a defesa do alvo.",
   "Estados podem ser mais importantes que dano direto, principalmente quando limitam movimento, ações ou defesa.",
   "No final da própria rodada, o alvo pode tentar se livrar de um estado usando feitiço apropriado, poção, ajuda de aliados ou solução criativa.",
   "O narrador decide se a solução remove automaticamente o estado ou se exige teste.",
];

const conditionDurationRules = [
   ["Estado", "Duração", "Dano / efeito", "Quando aplica"],
   ["Imobilização", "1D4: 1-2 = 1 rodada | 3-4 = 2 rodadas", "Limita movimento, ações ou defesa", "Enquanto durar o estado"],
   ["Queimadura", "1D4: 1-2 = 1 rodada | 3-4 = 2 rodadas", "1D4 de dano por rodada", "No início do turno da vítima"],
   ["Veneno", "1D4: 1-2 = 1 rodada | 3-4 = 2 rodadas", "1D4 de dano por rodada", "No final do turno da vítima"],
];

const conditionRemovalExamples = [
   ["Estado", "Possíveis soluções"],
   ["Teia / prisão física", "Reducto, Diffindo, força bruta ou ajuda externa"],
   ["Petrificação / paralisia", "Finite Incantatem ou contrafeitiço apropriado"],
   ["Queimadura", "Aguamenti, rolar no chão, água, terra ou magia de contenção"],
   ["Veneno", "Antídoto, poção curativa, magia de purificação ou tratamento rápido"],
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

const adversaryScaleRules = [
   "Ataque e defesa devem acompanhar o nível real do personagem.",
   "Criaturas comuns do ano devem ficar abaixo ou próximas do teto do jogador.",
   "Criaturas difíceis e chefes podem igualar ou ultrapassar levemente o teto do ano.",
   "O principal ajuste de balanceamento ocorre em 4 campos: HP, ataque, defesa e dado de impacto.",
   "Chefes lendários devem durar aproximadamente entre 8 e 15 rodadas.",
   "Criaturas de treino ou brinquedos mágicos podem ser desequilibradas de propósito, pois não existem para vencer.",
];

const adversaryExamples = [
   ["Nível", "Exemplo", "HP", "Ataque", "Defesa", "Impacto", "Observação"],
   ["Muito Fácil", "Rato encantado", "10 a 30", "+1 a +8", "+1 a +8", "1D4", "Risco baixo"],
   ["Fácil", "Doxy isolada", "35 a 60", "+10 a +18", "+10 a +16", "1D4 / 1D6", "Pequena ameaça"],
   ["Médio", "Acromântula Filhote", "60 a 90", "+18 a +30", "+18 a +28", "1D6 / 1D8", "Desafio escolar inicial"],
   ["Difícil escolar", "Kelpie ou Kappa", "95 a 140", "+34 a +40", "+34 a +38", "1D10", "Exige estratégia"],
   ["Chefe escolar", "Acromântula Matriarca", "150 a 190", "+46 a +52", "+46 a +50", "1D10 / 2D10", "Chefe de arco"],
   ["Muito Difícil", "Troll adulto", "190 a 250", "+56 a +62", "+54 a +58", "2D10", "Força bruta"],
   ["Profissional", "Centauro hostil", "220 a 300", "+68 a +75", "+66 a +72", "2D10", "Auror, duelista ou criatura equivalente"],
   ["Lendário", "Dragão adulto", "220 a 310", "+80 a +90", "+80 a +88", "3D10", "Meta de 8 a 15 rodadas"],
   ["Mítico", "Nundu ou Basilisco ancestral", "300 a 450", "+95 a +110", "+95 a +105", "4D10", "Sobrevivência e solução criativa"],
];

const creationGuide = [
   ["Ano recomendado", "Ataque sugerido", "Defesa sugerida", "HP sugerido", "Impacto sugerido"],
   ["1º Ano", "8 a 14", "8 a 12", "10 a 50", "1D4 / 1D6"],
   ["2º Ano", "18 a 22", "16 a 20", "70 a 100", "1D6 / 1D8"],
   ["3º Ano", "26 a 30", "24 a 28", "75 a 120", "1D8 / 1D10"],
   ["4º Ano", "36 a 40", "34 a 38", "100 a 140", "1D10"],
   ["5º Ano", "46 a 52", "44 a 50", "150 a 190", "1D10 / 2D10"],
   ["6º Ano", "56 a 62", "54 a 58", "190 a 250", "2D10"],
   ["7º Ano", "68 a 75", "66 a 72", "220 a 300", "2D10 / 3D10"],
   ["8º Ano / Adulto", "80 a 90", "80 a 88", "220 a 310", "3D10"],
   ["Mítico", "95 a 110", "95 a 105", "300 a 450", "4D10"],
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

         <RuleSection title="4. Dano e dado de impacto">
            <RuleTable rows={impactDamageRules} compact />
         </RuleSection>

         <RuleSection title="5. Impacto dos feitiços">
            <RuleTable rows={spellImpactExamples} compact />
         </RuleSection>

         <RuleSection title="6. Estados e efeitos contínuos">
            <SimpleList items={conditionRules} />
            <RuleTable rows={conditionDurationRules} compact />
            <RuleTable rows={conditionRemovalExamples} compact />
         </RuleSection>

         <RuleSection title="7. Resistência de Tomas">
            <SimpleList items={tomasRules} />
         </RuleSection>

         <RuleSection title="8. HP por ano letivo">
            <RuleTable rows={hpByYear} compact />
         </RuleSection>

         <RuleSection title="9. Limite de atributos por ano">
            <RuleTable rows={attributeLimitByYear} compact />
         </RuleSection>

         <RuleSection title="10. Base de adversários">
            <SimpleList items={adversaryScaleRules} />
            <RuleTable rows={adversaryExamples} compact />
         </RuleSection>

         <RuleSection title="11. Guia rápido para criar adversários">
            <RuleTable rows={creationGuide} compact />
         </RuleSection>
      </RulePage>
   );
};

export default Battles;
