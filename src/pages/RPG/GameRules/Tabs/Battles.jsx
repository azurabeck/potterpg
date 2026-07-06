import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const battleRules = [
   "O sistema separa acerto e efeito: primeiro verifica se a ação funciona; depois aplica exatamente o efeito descrito na ficha do feitiço, criatura ou habilidade.",
   "Ataques usam 1D20 + atributo indicado na ficha contra a Defesa fixa do alvo.",
   "A maestria não adiciona dado ao teste de acerto. Ela seleciona a faixa de mastery_effects da ficha do feitiço.",
   "Dano, duração, distância, empurrão, controle, buffs, penalidades e efeitos contínuos vêm da ficha do próprio feitiço. Não existe dado de impacto mágico universal.",
   "Cada criatura pode manter uma ficha enxuta: HP, ataque principal, ataque secundário, Defesa e os dados/efeitos de suas habilidades. Não é necessário criar uma ficha completa de atributos.",
   "Condições, ambiente e soluções criativas podem alterar ou encerrar uma batalha sem zerar HP, desde que respeitem o cenário já estabelecido e as regras do efeito usado.",
   "O narrador não deve criar obstáculos, fraquezas ou recursos ambientais retroativamente apenas para favorecer uma ação.",
];

const attackFlow = [
   ["Etapa", "Regra"],
   ["1. Declaração", "Jogador declara ação, feitiço, alvo e intenção."],
   ["2. Validação", "Confere alcance, limitações, concentração e se a ação é possível no cenário."],
   ["3. Teste", "Rola 1D20 + atributo indicado na ficha do feitiço ou habilidade."],
   ["4. Defesa", "Compara o total com a Defesa fixa do alvo: 10 + valor de Defesa da ficha."],
   ["5. Acerto", "Se igualar ou superar a Defesa, o efeito acerta."],
   ["6. Efeito", "Aplica a faixa de maestria atual e as regras especiais da ficha."],
   ["7. Estado", "Resolve duração, dano contínuo, remoção ou outras regras descritas na carta."],
];

const defenseRules = [
   ["Regra", "Funcionamento"],
   ["Defesa fixa", "10 + valor indicado no campo Defesa da ficha do adversário."],
   ["Exemplo", "Red Cap com Defesa: Agilidade +7 possui Defesa fixa 17."],
   ["Ficha enxuta", "A criatura não precisa possuir todos os atributos do personagem; usa apenas os valores registrados em seus ataques, Defesa e habilidades."],
   ["Exceções", "Cobertura, cegueira, terreno, estados e habilidades especiais podem modificar temporariamente a Defesa quando a regra ou a situação justificar."],
];

const reactionRules = [
   "Cada personagem ou criatura possui no máximo 1 reação por rodada.",
   "A reação é consumida quando o personagem tenta responder fora de sua ação normal, mesmo que a tentativa falhe.",
   "Exemplos de reação: esquiva, Protego, cobertura imediata ou outra resposta explicitamente permitida por uma carta/habilidade.",
   "Contra-atacar não é uma reação gratuita. Só é permitido quando uma regra, habilidade ou situação específica conceder essa possibilidade.",
   "Se a reação já foi usada na rodada, o personagem não pode usar outra até o início da próxima rodada.",
];

const protegoRules = [
   "Protego é uma reação ativa e consome a única reação disponível na rodada.",
   "O defensor rola 1D20 + Proteção e compara o total com o ataque recebido.",
   "Se Protego vencer ou igualar o ataque, aplica-se o efeito da faixa de maestria atual do feitiço.",
   "Maestria 1–4: o ataque é bloqueado e desaparece.",
   "Maestria 5–9: o ataque é bloqueado; a reflexão depende do teste de Sorte definido na ficha.",
   "Maestria 10: ao vencer a defesa, o ataque é refletido conforme a ficha. O novo alvo ainda pode reagir se possuir reação disponível e a situação permitir.",
   "Se Protego perder o confronto, o escudo falha e o ataque resolve normalmente.",
];

const adversaryAttackRules = [
   "O adversário rola 1D20 + o bônus indicado em Ataque principal, Ataque secundário ou habilidade especial.",
   "A ficha do adversário deve informar o dado de dano ou o efeito da habilidade usada.",
   "Se o personagem usar uma reação válida, resolve-se a disputa conforme essa reação. Caso contrário, usa-se a defesa aplicável já estabelecida para a cena.",
   "Quando uma criatura acerta, o dano vem do dado do próprio ataque da criatura; nunca da diferença entre ataque e defesa.",
   "Se um feitiço retornar contra o conjurador, usa-se o dado/efeito do próprio feitiço.",
   "Quedas simples, tropeços, colisões leves e consequências incidentais sem dado próprio podem causar 1D4 de dano.",
   "Ameaças ambientais relevantes podem ter dado próprio definido antes da resolução, de acordo com o perigo apresentado.",
];

const creativityRules = [
   "Criatividade não concede sucesso automático, mas também não deve ser punida com rolagens extras sem necessidade.",
   "Se uma ideia usa naturalmente um feitiço que já acertou e a ação seguinte faz parte do controle normal desse efeito, não se exige um novo teste apenas para cada microação.",
   "Um teste adicional só é pedido quando existe uma dificuldade independente real: alinhar um ângulo difícil, atingir um ponto específico, manipular algo sob pressão ou superar um novo obstáculo.",
   "Falhar no teste criativo não cancela automaticamente a ação principal. Quando possível, a ação pode voltar ao efeito normal do feitiço.",
   "Bônus de dano ambiental só existe quando o cenário já oferece um risco coerente. O narrador deve usar o elemento descrito, não inventar um recurso conveniente depois da declaração.",
];

const hpScale = [
   ["Escala de ameaça", "HP sugerido", "Leitura"],
   ["Minúscula / frágil", "2 a 8", "Pode cair com um único efeito bem aplicado."],
   ["Pequena", "8 a 20", "Ameaça baixa ou criatura jovem."],
   ["Comum", "20 a 45", "Combate curto contra um oponente equivalente."],
   ["Perigosa", "45 a 90", "Exige estratégia e uso correto das cartas."],
   ["Muito perigosa", "90 a 160", "Ameaça de grupo ou mini-chefe."],
   ["Chefe", "160 a 300", "Combate prolongado com ações especiais."],
   ["Lendária", "300+", "Sobrevivência, objetivo de cena e solução criativa podem ser mais importantes que dano."],
];

const characterHp = [
   ["Personagem", "HP sugerido", "Observação"],
   ["Aluno comum do 1º ano", "14 a 20", "Pouca experiência real de combate."],
   ["Aluno comum do 2º ano", "18 a 24", "Maior repertório e resistência."],
   ["Tomas — início do 2º ano", "30", "Protagonista experiente; Resistência baixa continua relevante."],
   ["Aluno muito resistente", "25 a 32", "Exceção escolar."],
   ["Adulto comum", "25 a 40", "Sem treinamento especializado."],
   ["Bruxo treinado / Auror", "55 a 90", "Combate profissional."],
   ["Bruxo excepcional", "90 a 150", "Ameaça de alto nível."],
];

const attributeLimitByYear = [
   ["Etapa", "Máximo por atributo", "Observação"],
   ["1º Ano", "5", "Limite escolar inicial."],
   ["2º Ano", "7", "Novo teto após a passagem de ano."],
   ["3º Ano", "9", "Evolução ainda perceptível e rápida."],
   ["4º Ano", "11", "Primeiro acesso a valores acima de 10."],
   ["5º Ano", "12", "Progressão desacelera."],
   ["6º Ano", "13", "Nível avançado escolar."],
   ["7º Ano", "14", "Próximo da formação."],
   ["Adulto", "15", "Teto normal de progressão para bruxos adultos."],
];

const progressionBalanceRules = [
   "O limite por ano é um teto, não um valor recebido automaticamente.",
   "A passagem de ano permite distribuir evolução conquistada até o novo teto e também amplia o repertório de feitiços disponíveis.",
   "Criaturas não precisam respeitar o teto adulto de 15. Ameaças monstruosas, lendárias ou míticas podem possuir bônus de ataque e Defesa superiores.",
   "A ficha de uma criatura não aumenta porque Tomas envelheceu. O mesmo inimigo naturalmente se torna mais fácil conforme Tomas evolui.",
   "A progressão de ameaças acontece principalmente pela escolha de adversários mais perigosos, com Defesa, HP, dano e habilidades maiores.",
   "Defesa define frequência de acerto; HP define quanto tempo a ameaça permanece em cena. Não aumentar ambos sem motivo.",
   "Chefes devem possuir ações especiais, terreno ou objetivos; apenas aumentar HP produz combate arrastado.",
];

const Battles = () => (
   <RulePage title="Batalhas do Mundo" intro="Sistema 2.1: acerto por 1D20, Defesa fixa enxuta, uma reação por rodada, efeitos definidos pelas cartas e progressão limitada por ano.">
      <RuleSection title="1. Núcleo do combate"><SimpleList items={battleRules} /></RuleSection>
      <RuleSection title="2. Quando Tomas ataca"><RuleTable rows={attackFlow} compact /></RuleSection>
      <RuleSection title="3. Defesa dos adversários"><RuleTable rows={defenseRules} compact /></RuleSection>
      <RuleSection title="4. Reações"><SimpleList items={reactionRules} /></RuleSection>
      <RuleSection title="5. Protego"><SimpleList items={protegoRules} /></RuleSection>
      <RuleSection title="6. Quando o adversário ataca"><SimpleList items={adversaryAttackRules} /></RuleSection>
      <RuleSection title="7. Criatividade e ambiente"><SimpleList items={creativityRules} /></RuleSection>
      <RuleSection title="8. Escala de HP das ameaças"><RuleTable rows={hpScale} compact /></RuleSection>
      <RuleSection title="9. HP de personagens"><RuleTable rows={characterHp} compact /></RuleSection>
      <RuleSection title="10. Limite de atributos por ano"><RuleTable rows={attributeLimitByYear} compact /></RuleSection>
      <RuleSection title="11. Progressão e balanceamento"><SimpleList items={progressionBalanceRules} /></RuleSection>
   </RulePage>
);

export default Battles;
