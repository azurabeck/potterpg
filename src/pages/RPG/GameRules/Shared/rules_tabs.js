import IA from "../Tabs/IA";
import Mastery from "../Tabs/Mastery";
import Duel from "../Tabs/Duel";
import Quidditch from "../Tabs/Quidditch";
import PassingYear from "../Tabs/PassingYear";
import Mystery from "../Tabs/Mystery";
import Battles from "../Tabs/Battles";

export const rulesTabs = [
   { key: "narracao-ia", label: "Narração IA", component: IA },
   { key: "maestria", label: "Maestria", component: Mastery },
   { key: "duelo-bruxo", label: "Duelo Bruxo", component: Duel },
   { key: "quadribol", label: "Quadribol", component: Quidditch },
   { key: "ano-letivo", label: "Ano Letivo", component: PassingYear },
   { key: "misterios", label: "Mistérios", component: Mystery },
   { key: "batalhas-do-mundo", label: "Batalhas do Mundo", component: Battles },
];
