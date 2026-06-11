import AttributesTab from "../Tabs/Attributes";
import SpellsTab from "../Tabs/Spells";
import PotionsTab from "../Tabs/Potions";
import MysteriesTab from "../Tabs/Mysteries";
import InventoryTab from "../Tabs/Inventory";
import SessionsTab from "../Tabs/Sessions";
import RelationsTab from "../Tabs/Relations";

export const tabs = [
   { key: "attributes", label: "Atributos", component: AttributesTab },
   { key: "spells", label: "Feitiços", component: SpellsTab, hideRules: true },
   { key: "potions", label: "Poções", component: PotionsTab, hideRules: true  },
   { key: "mysteries", label: "Mistérios", component: MysteriesTab, hideRules: true  },
   { key: "inventory", label: "Inventário", component: InventoryTab, hideRules: true },
   { key: "sessions", label: "Sessões", component: SessionsTab, hideRules: true },
   { key: "relations", label: "Relações", component: RelationsTab },
];

export const regrasPorAba = {
   attributes: {
      title: "REGRAS DE ATRIBUTOS.",
      text: [
         "Atributos representam as bases do personagem e podem evoluir conforme treino, escolhas e acontecimentos da campanha.",
      ],
      subtitle: "FICHA",
      highlight: "Atributos",
      description:
         "Use esta aba para ajustar valores centrais como coragem, inteligência, magia, proteção e outros atributos globais.",
   },
   spells: {
      title: "REGRAS DE FEITIÇOS.",
      text: [
         "O XP de feitiço pode considerar dado, maestria e dificuldade da magia utilizada.",
         "Feitiços acima do ano do personagem devem receber penalidade ou limitação narrativa.",
      ],
      subtitle: "PROGRESSO",
      highlight: "Maestria",
      description:
         "A maestria representa o quanto o personagem domina o feitiço durante a campanha.",
   },
   potions: {
      title: "REGRAS DE POÇÕES.",
      text: [
         "Poções seguem regra própria de aprendizado e podem exigir ingredientes, aula ou prática guiada.",
      ],
      subtitle: "PROGRESSO",
      highlight: "Preparo",
      description:
         "O avanço depende da execução correta da receita, atenção aos detalhes e resultado final.",
   },
   mysteries: {
      title: "REGRAS DE MISTÉRIOS.",
      text: [
         "Mistérios guardam pistas ativas, suspeitas, locais importantes e descobertas da campanha.",
      ],
      subtitle: "CONTINUIDADE",
      highlight: "Pistas",
      description:
         "Cada sessão pode adicionar, resolver ou alterar um mistério da campanha.",
   },
   inventory: {
      title: "REGRAS DE INVENTÁRIO.",
      text: [
         "Itens carregados pelo personagem podem afetar testes, cenas e opções narrativas.",
      ],
      subtitle: "USO DE ITEM",
      highlight: "Equipamento",
      description:
         "Objetos importantes devem ser registrados para manter continuidade entre sessões.",
   },
   sessions: {
      title: "REGRAS DE SESSÕES.",
      text: ["Cada sessão representa um episódio da campanha do personagem."],
      subtitle: "REGISTRO",
      highlight: "Resumo",
      description:
         "Aqui entrarão os resumos, NPCs, XP ganho, pistas e mudanças de ficha.",
   },
   relations: {
      title: "REGRAS DE RELAÇÕES.",
      text: [
         "Relações registram vínculos, amizade, rivalidade, confiança e impressões entre personagens.",
      ],
      subtitle: "VÍNCULO",
      highlight: "Relação",
      description:
         "A relação muda conforme as escolhas, diálogos e acontecimentos da campanha.",
   },
};
