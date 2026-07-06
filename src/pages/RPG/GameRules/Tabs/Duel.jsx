import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const coreRules = [
   "O duelo separa acerto e efeito. A rolagem determina se o feitiço atinge; a ficha do feitiço determina o que acontece.",
   "Por padrão, ataques mágicos usam 1D20 + atributo indicado na collection spells.",
   "A maestria atual é calculada pelo XP do personagem e pela tabela xp_maestria do próprio feitiço.",
   "A maestria não soma dado ao acerto: ela seleciona a faixa correspondente em mastery_effects.",
   "Nível, atributo, alcance, concentração, penalidades e regras especiais pertencem ao feitiço, não ao personagem.",
   "O personagem guarda sua progressão individual no feitiço, especialmente o XP atual.",
   "Cada participante possui no máximo 1 reação por rodada.",
];

const turnRows = [
   ["Etapa", "O que acontece"],
   ["1. Declaração", "O jogador declara feitiço, intenção e alvo."],
   ["2. Validação", "Confere alcance, concentração, limitações e possibilidade de conjuração."],
   ["3. Rolagem", "Rola 1D20 + atributo indicado na ficha do feitiço."],
   ["4. Defesa", "Compara com a Defesa fixa do alvo ou resolve uma reação ativa válida."],
   ["5. Efeito", "Em caso de acerto, aplica mastery_effects da maestria atual."],
   ["6. Regras especiais", "Resolve special_rules, duração, dano contínuo, remoção e penalidades."],
];

const statusRows = [
   ["Situação", "Regra"],
   ["Petrificus Totalus", "Duração vem da faixa de maestria atual da ficha; não existe duração universal fixa."],
   ["Finite Incantatem", "Segue sua própria ficha e só pode ser usado se o personagem tiver condição física e mágica de conjurar."],
   ["Protego", "Reação ativa: 1D20 + Proteção contra o ataque recebido; consome a reação da rodada e a reflexão depende da maestria."],
   ["Expelliarmus", "Distância da varinha e ações para recuperar dependem da maestria; M10 pode habilitar disputa especial de Sorte."],
   ["Falha", "O feitiço não aplica seu efeito. Consequências extras só ocorrem se a ficha, contexto ou risco declarado justificarem."],
   ["Contra-ataque", "Não é reação gratuita. Exige regra, habilidade ou situação específica que o permita."],
];

const Duel = () => (
   <RulePage title="Duelo Bruxo" intro="Regras de confronto mágico integradas às novas fichas de feitiço e ao núcleo 1D20.">
      <RuleSection title="Base do duelo"><SimpleList items={coreRules} /></RuleSection>
      <RuleSection title="Rodada de duelo"><RuleTable rows={turnRows} compact /></RuleSection>
      <RuleSection title="Efeitos e limitações"><RuleTable rows={statusRows} compact /></RuleSection>
   </RulePage>
);

export default Duel;
