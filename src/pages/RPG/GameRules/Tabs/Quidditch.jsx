import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable } from "../Shared/RulePage";

const Quidditch = () => {
   const quidditchRows = ruleTables["Regras Quadribol"] || [];

   return (
      <RulePage
         title="Quadribol"
         intro="Regras fixas para partidas oficiais e treinamentos, com dificuldade definida por D6 e HP da partida."
      >
         <RuleSection title="Partidas e treinamentos">
            <RuleTable rows={quidditchRows} compact />
         </RuleSection>
      </RulePage>
   );
};

export default Quidditch;
