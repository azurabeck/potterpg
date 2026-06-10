import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import attributeRules from "../../../../assets/json/attributeRules.json"
import {
   CheckIcon,
   ChevronDownIcon,
   PlusIcon,
} from "@heroicons/react/24/solid";
import { auth, db } from "../../../../services/firebase";
import { getCharactersByUserId } from "../../../../services/rpg/character.service";

const tabs = [
   { key: "attributes", label: "Atributos" },
   { key: "spells", label: "Feitiços" },
   { key: "potions", label: "Poções" },
   { key: "mysteries", label: "Mistérios" },
   { key: "inventory", label: "Inventário" },
   { key: "sessions", label: "Sessões" },
   { key: "relations", label: "Relações" },
];

const regrasPorAba = {
   attributes: {
      title: "REGRAS UTILIZAÇÃO DE ATRIBUTO.",
      text: [
         "Os atributos são aplicados a todos os testes, porém para feitiços e habilidade eles só são somados quando o aluno esta no ano compatível com feitiço.",
         "Exemplo: feitiço disponível no ano 1, e jogador no ano 1.",
      ],
      subtitle: "REGRA DE GANHO DE ATRIBUTO",
      highlight: "Coragem",
      description:
         "Ganha quando Tomas enfrenta medo, perigo ou consequências reais mesmo tendo a opção de recuar.",
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

const atributoOrdem = [
   "Coragem",
   "Inteligência",
   "Agilidade",
   "Carisma",
   "Percepção",
   "Sorte",
   "Magia",
   "Resistência",
   "Ataque",
   "Proteção",
   "Precisão",
   "Controle",
   "Magia Antiga",
   "Liderança",
   "Aprendizado Mágico",
   "Persuasão",
   "Astucia",
   "Equilibrio",
];

const CharacterSheet = () => {
   const [activeTab, setActiveTab] = useState("attributes");
   const [characters, setCharacters] = useState([]);
   const [selectedCharacterId, setSelectedCharacterId] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [editingAttributeName, setEditingAttributeName] = useState("");
   const [attributeDraftValue, setAttributeDraftValue] = useState("");
   const [savingAttributeName, setSavingAttributeName] = useState("");

   const selectedCharacter = useMemo(() => {
      return characters.find(
         (character) => character.id === selectedCharacterId
      );
   }, [characters, selectedCharacterId]);

   const currentRules = regrasPorAba[activeTab] || regrasPorAba.attributes;

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (!user) {
            setCharacters([]);
            setSelectedCharacterId("");
            setLoading(false);
            return;
         }

         try {
            setLoading(true);
            setError("");

            const userCharacters = await getCharactersByUserId(user.uid);

            setCharacters(userCharacters);
            setSelectedCharacterId(userCharacters[0]?.id || "");
         } catch (requestError) {
            console.error("Erro ao carregar personagem:", requestError);
            setError("Não foi possível carregar sua ficha.");
         } finally {
            setLoading(false);
         }
      });

      return () => unsubscribe();
   }, []);

   const getAttributeEntries = () => {
      const atributos = selectedCharacter?.atributos || {};

      return atributoOrdem
         .filter((attributeName) => attributeName in atributos)
         .map((attributeName) => [attributeName, atributos[attributeName]]);
   };

   const handleTabChange = (tabKey) => {
      setActiveTab(tabKey);

      if (tabKey !== "attributes") {
         setEditingAttributeName("");
         setAttributeDraftValue("");
      }
   };

   const handleCharacterChange = (event) => {
      setSelectedCharacterId(event.target.value);
      setEditingAttributeName("");
      setAttributeDraftValue("");
   };

   const handleSelectAttribute = (attributeName, attributeValue) => {
      setEditingAttributeName(attributeName);
      setAttributeDraftValue(String(attributeValue ?? 0));
   };

   const handleAttributeValueChange = (event) => {
      const value = event.target.value;

      if (/^-?\d*$/.test(value)) {
         setAttributeDraftValue(value);
      }
   };

   const getAttributeChangedStatus = (attributeName, originalValue) => {
      if (editingAttributeName !== attributeName) return false;
      if (attributeDraftValue === "") return false;

      return Number(attributeDraftValue) !== Number(originalValue);
   };

   const handleSaveAttribute = async (attributeName, originalValue) => {
      const hasChanged = getAttributeChangedStatus(attributeName, originalValue);

      if (!selectedCharacter?.id || !hasChanged) return;

      const normalizedValue = Number(attributeDraftValue);

      if (Number.isNaN(normalizedValue)) return;

      try {
         setSavingAttributeName(attributeName);

         const characterRef = doc(db, "characters", selectedCharacter.id);

         await updateDoc(characterRef, {
            [`atributos.${attributeName}`]: normalizedValue,
            updated_at: serverTimestamp(),
         });

         setCharacters((currentCharacters) =>
            currentCharacters.map((character) => {
               if (character.id !== selectedCharacter.id) return character;

               return {
                  ...character,
                  atributos: {
                     ...(character.atributos || {}),
                     [attributeName]: normalizedValue,
                  },
               };
            })
         );

         setAttributeDraftValue(String(normalizedValue));
      } catch (requestError) {
         console.error("Erro ao salvar atributo:", requestError);
      } finally {
         setSavingAttributeName("");
      }
   };

   const renderEmptyContent = (message) => {
      return (
         <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-purple-200/70">
            {message}
         </div>
      );
   };

   const renderObjectList = (data, emptyMessage) => {
      const entries = Object.entries(data || {});

      if (!entries.length) return renderEmptyContent(emptyMessage);

      return (
         <div className="space-y-3">
            {entries.map(([name, value]) => (
               <div
                  key={name}
                  className="
                     grid
                     cursor-pointer
                     grid-cols-[1fr_84px]
                     items-center
                     gap-4
                     rounded-md
                     px-3
                     py-2
                     text-sm
                     transition-all
                     duration-200
                     hover:bg-white/10
                     hover:text-white
                  "
               >
                  <span className="text-[#736868]">{name}</span>
                  <span className="bg-[#9d564c] px-3 py-1 text-center text-xs text-white">
                     {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                  </span>
               </div>
            ))}
         </div>
      );
   };

   const renderAttributes = () => {
      const entries = getAttributeEntries();

      if (!entries.length) {
         return renderEmptyContent("Nenhum atributo cadastrado.");
      }

      return (
         <div className="space-y-3">
            {entries.map(([name, value]) => {
               const isEditing = editingAttributeName === name;
               const hasChanged = getAttributeChangedStatus(name, value);
               const isSaving = savingAttributeName === name;

               return (
                  <div
                     key={name}
                     onClick={() => handleSelectAttribute(name, value)}
                     className="
                        group
                        grid
                        cursor-pointer
                        grid-cols-[1fr_84px_36px]
                        items-center
                        gap-4
                        rounded-md
                        p-2
                        text-sm
                        text-[#736868]
                        transition-all
                        duration-200
                        hover:bg-white/60
                        hover:text-[#2b0038]
                     "
                  >
                     <span>{name}</span>

                     {isEditing ? (
                        <input
                           type="text"
                           value={attributeDraftValue}
                           onClick={(event) => event.stopPropagation()}
                           onChange={handleAttributeValueChange}
                           className="
                              w-full
                              bg-[#603467]
                              px-3
                              py-1
                              text-center
                              text-xs
                              text-white
                              outline-none
                              ring-1
                              ring-white/20
                              focus:ring-yellow-400
                           "
                        />
                     ) : (
                        <span className="bg-[#603467] px-3 py-1 text-center text-xs text-white">
                           {value}
                        </span>
                     )}

                     {isEditing ? (
                        <button
                           type="button"
                           disabled={!hasChanged || isSaving}
                           onClick={(event) => {
                              event.stopPropagation();
                              handleSaveAttribute(name, value);
                           }}
                           className={`
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded
                              transition
                              ${
                                 hasChanged && !isSaving
                                    ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300"
                                    : "bg-white/10 text-white/30"
                              }
                           `}
                           title="Salvar atributo"
                        >
                           <CheckIcon className="h-4 w-4" />
                        </button>
                     ) : (
                        <div className="h-7 w-7" />
                     )}
                  </div>
               );
            })}
         </div>
      );
   };

   const renderInventory = () => {
      const dinheiro = selectedCharacter?.dinheiro;
      const varinha = selectedCharacter?.varinha;

      return (
         <div className="space-y-5 pt-6 text-sm text-[#736868]">
            <div>
               <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
                  Dinheiro
               </p>
               <p>
                  {dinheiro?.galeoes ?? 0} Galeões • {dinheiro?.sicles ?? 0}{" "}
                  Sicles • {dinheiro?.nuques ?? 0} Nuques
               </p>
            </div>

            <div>
               <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
                  Varinha
               </p>
               <p>Madeira: {varinha?.madeira || "-"}</p>
               <p>Miolo: {varinha?.miolo || "-"}</p>
               <p>Atributo: {varinha?.atributo || "-"}</p>
            </div>

            <div>
               <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
                  Animal
               </p>
               <p>{selectedCharacter?.animal || "-"}</p>
            </div>
         </div>
      );
   };

   const renderTabContent = () => {
      if (activeTab === "attributes") return renderAttributes();

      if (activeTab === "spells") {
         return renderObjectList(
            selectedCharacter?.habilidades,
            "Nenhum feitiço ou habilidade cadastrado."
         );
      }

      if (activeTab === "potions") {
         return renderObjectList(
            selectedCharacter?.pocoes,
            "Nenhuma poção cadastrada."
         );
      }

      if (activeTab === "inventory") return renderInventory();

      if (activeTab === "mysteries") {
         return renderEmptyContent(
            "Mistérios serão vinculados nas próximas sessões."
         );
      }

      if (activeTab === "sessions") {
         return renderEmptyContent("Sessões da campanha ainda não cadastradas.");
      }

      if (activeTab === "relations") {
         return renderEmptyContent("Relações ainda não cadastradas.");
      }

      return null;
   };

   if (loading) {
      return (
         <section className="mx-auto min-h-[530px] max-w-6xl bg-[#30003f] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
               Perfil RPG
            </p>
            <h1 className="mt-3 text-sm uppercase tracking-[0.16em]">
               Carregando ficha...
            </h1>
         </section>
      );
   }

   if (error) {
      return (
         <section className="mx-auto min-h-[530px] max-w-6xl bg-[#30003f] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
               Perfil RPG
            </p>
            <h1 className="mt-3 text-sm uppercase tracking-[0.16em]">
               {error}
            </h1>
         </section>
      );
   }

   if (!selectedCharacter) {
      return (
         <section className="mx-auto min-h-[530px] max-w-6xl bg-[#30003f] p-8 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-6">
               <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
                     Perfil RPG
                  </p>
                  <h1 className="mt-3 text-sm uppercase tracking-[0.16em]">
                     Nenhum personagem encontrado
                  </h1>
               </div>

               <NavLink
                  to="/rpg/sheet/create"
                  className="text-3xl font-bold text-yellow-400 transition hover:text-yellow-300"
               >
                  +
               </NavLink>
            </div>
         </section>
      );
   }

   return (
      <section className="flex h-[calc(100vh-65px)] w-full flex-col bg-[#30003f] px-8 pb-7 pt-6 text-white shadow-2xl">
         <div className="flex items-start justify-between gap-6">
            <div>
               <p className="text-left text-sm uppercase tracking-[0.35em] text-yellow-400">
                  Perfil RPG
               </p>

               <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-sm uppercase tracking-[0.16em]">
                     Personagem: Campanha de {selectedCharacter.name}
                  </h1>

                  {characters.length > 1 ? (
                     <select
                        value={selectedCharacterId}
                        onChange={handleCharacterChange}
                        className="w-7 cursor-pointer bg-transparent text-transparent outline-none"
                        title="Trocar personagem"
                     >
                        {characters.map((character) => (
                           <option key={character.id} value={character.id}>
                              {character.name}
                           </option>
                        ))}
                     </select>
                  ) : (
                     <ChevronDownIcon className="h-4 w-4 text-purple-400" />
                  )}
               </div>
            </div>

            <NavLink
               to="/rpg/sheet/create"
               className="flex h-10 w-10 items-center justify-center text-yellow-400 transition hover:text-yellow-300"
               title="Criar personagem"
            >
               <PlusIcon className="h-6 w-6" />
            </NavLink>
         </div>

         <div className="mt-5 min-h-0 flex-1 border-t border-white/20 pt-4">
            <div className="grid h-full min-h-0 w-full grid-cols-12">
               <aside className="relative col-span-3 h-full min-h-0 overflow-hidden bg-[#21002b]">
                  <img
                     src={
                        selectedCharacter.image_url ||
                        "https://placehold.co/520x700"
                     }
                     alt={selectedCharacter.name}
                     className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#30003f] via-[#30003f]/35 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-center">
                     <h2 className="text-2xl font-semibold">
                        {selectedCharacter.name}
                     </h2>

                     <p className="mt-1 text-sm text-[#736868]">
                        {selectedCharacter.casa} • {selectedCharacter.ano}º Ano
                        • Sangue {selectedCharacter.tipo}
                     </p>
                  </div>
               </aside>

               <div className="col-span-9 grid h-full min-h-0 grid-rows-[52px_1fr]">
                  <nav className="flex items-center justify-end gap-10 px-8 text-sm">
                     {tabs.map((tab) => (
                        <button
                           key={tab.key}
                           type="button"
                           onClick={() => handleTabChange(tab.key)}
                           className={`transition ${
                              activeTab === tab.key
                                 ? "text-yellow-400"
                                 : "text-white hover:text-yellow-400"
                           }`}
                        >
                           {tab.label}
                        </button>
                     ))}
                  </nav>

                  <div className="min-h-0 overflow-y-auto px-12 py-12">
                     <div className="grid min-h-full grid-cols-12 gap-8">
                        <div className="col-span-6 pr-6 text-left">
                           {renderTabContent()}
                        </div>

                        <div className="col-span-1 border-l border-dashed border-white/25" />

                        <aside className="col-span-5 pr-2 text-left text-xs leading-4 text-[#736868]">
   {activeTab === "attributes" ? (
      <>
         <h3 className="mb-5 uppercase tracking-[0.08em]">
            {attributeRules.title}
         </h3>

         {attributeRules.description.map((paragraph) => (
            <p key={paragraph} className="mb-4">
               {paragraph}
            </p>
         ))}

         <h4 className="mb-4 mt-6 uppercase tracking-[0.08em]">
            {attributeRules.evolutionTitle}
         </h4>

         <div className="space-y-5">
            {attributeRules.attributes.map((attribute) => (
               <div key={attribute.name}>
                  <p className="mb-1 text-yellow-400">
                     {attribute.name}
                  </p>

                  <p className="mb-2">{attribute.description}</p>

                  <p className="mb-1">Exemplos:</p>

                  <ul className="list-disc space-y-1 pl-4">
                     {attribute.examples.map((example) => (
                        <li key={example}>{example}</li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>

         <h4 className="mb-4 mt-6 uppercase tracking-[0.08em]">
            {attributeRules.gainRule.title}
         </h4>

         <p className="mb-2">Um atributo só deve receber ponto quando:</p>

         <ul className="mb-4 list-disc space-y-1 pl-4">
            {attributeRules.gainRule.conditions.map((condition) => (
               <li key={condition}>{condition}</li>
            ))}
         </ul>

         <p className="mb-2">Normalmente:</p>

         <ul className="list-disc space-y-1 pl-4">
            {attributeRules.gainRule.normal.map((rule) => (
               <li key={rule}>{rule}</li>
            ))}
         </ul>
      </>
   ) : (
      <>
         <h3 className="mb-5 uppercase tracking-[0.08em]">
            {currentRules.title}
         </h3>

         {currentRules.text.map((paragraph) => (
            <p key={paragraph} className="mb-4">
               {paragraph}
            </p>
         ))}

         <h4 className="mb-4 mt-6 uppercase tracking-[0.08em]">
            {currentRules.subtitle}
         </h4>

         <p className="mb-1">{currentRules.highlight}</p>
         <p>{currentRules.description}</p>
      </>
   )}
</aside>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default CharacterSheet;