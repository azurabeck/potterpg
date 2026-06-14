import { ruleTables } from "../Shared/rules_content";
import { RulePage, RuleSection, RuleTable, SimpleList } from "../Shared/RulePage";

const battleRules = [
   "Criaturas, construtos e obstáculos perigosos podem receber HP para serem vencidos por soma de rolagens.",
   "A soma de todas as rodadas de dado diminui o HP do adversário ou da situação.",
   "Quando fizer sentido narrativo, uma solução criativa pode encerrar a batalha sem zerar HP.",
   "Adversários e habilidades que não estão na ficha podem ter nível de HP ou dificuldade definido pelo narrador.",
   "Consequências devem ser decididas por dados quando houver risco real ou resultado incerto.",
];

const Battles = () => {
   const adversaryRows = ruleTables["Adversários"] || [];

   return (
      <RulePage
         title="Batalhas do Mundo"
         intro="Regras simples para encontros, criaturas, construtos mágicos e obstáculos com HP."
      >
         <RuleSection title="Regras gerais">
            <SimpleList items={battleRules} />
         </RuleSection>

         <RuleSection title="Adversários cadastrados">
            <RuleTable rows={adversaryRows} compact />
         </RuleSection>
      </RulePage>
   );
};

export default Battles;
