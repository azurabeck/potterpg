import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const coreRules = [
   "O duelo usa teste principal de D20 somado ao bônus da habilidade, quando existir.",
   "Habilidades com maestria usam: dado principal + dado de maestria / 2.",
   "O feitiço precisa fazer sentido para a ação e para o ano letivo do personagem.",
   "Feitiços de tiro, como Flipendo, Expelliarmus e Estupefaça, não exigem movimento complexo além de mirar e lançar.",
   "Feitiços que exigem ação corporal não podem ser usados quando o personagem está totalmente impedido.",
];

const statusRows = [
   ["Situação", "Regra"],
   ["Petrificus Totalus", "Paralisa o corpo por 2 rodadas."],
   ["Finite Incantatem contra Petrificus", "Não pode ser usado pelo próprio alvo petrificado, porque o usuário não consegue mover os braços."],
   ["Protego", "Pode ser usado como defesa quando há tempo de reação e o personagem consegue agir."],
   ["Desarme", "Pode impedir o próximo feitiço se o alvo perder a varinha ou a concentração."],
   ["Falha crítica", "Gera consequência narrativa proporcional ao risco do duelo."],
];

const turnRows = [
   ["Etapa", "O que acontece"],
   ["1. Declaração", "O jogador declara feitiço, intenção e alvo."],
   ["2. Rolagem", "Roda o dado principal e aplica maestria quando houver."],
   ["3. Defesa", "Quando cabível, o alvo pode tentar defesa, esquiva ou contra-feitiço."],
   ["4. Resultado", "O efeito acontece conforme sucesso, falha, contexto e consequência narrativa."],
];

const Duel = () => {
   return (
      <RulePage
         title="Duelo Bruxo"
         intro="Regras fixas para confrontos mágicos, usando dados, maestria, efeitos de status e limitações narrativas."
      >
         <RuleSection title="Base do duelo">
            <SimpleList items={coreRules} />
         </RuleSection>

         <RuleSection title="Rodada de duelo">
            <RuleTable rows={turnRows} compact />
         </RuleSection>

         <RuleSection title="Efeitos e limitações">
            <RuleTable rows={statusRows} compact />
         </RuleSection>
      </RulePage>
   );
};

export default Duel;
