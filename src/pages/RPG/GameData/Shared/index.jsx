import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../services/firebase";
import { getCharactersByUserId } from "../../../../services/rpg/character.service";

import { regrasPorAba, tabs } from "./tabs_json";
import Header from "./Header";
import Content from "./Content";

const CharacterSheet = () => {
   const [activeTab, setActiveTab] = useState("attributes");
   const [characters, setCharacters] = useState([]);
   const [selectedCharacterId, setSelectedCharacterId] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const selectedCharacter = useMemo(() => {
      return characters.find((character) => character.id === selectedCharacterId);
   }, [characters, selectedCharacterId]);

   const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];
   const CurrentTabComponent = currentTab.component;
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

   const handleCharacterChange = (event) => {
      setSelectedCharacterId(event.target.value);
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
            <h1 className="mt-3 text-sm uppercase tracking-[0.16em]">{error}</h1>
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
         <Header
            characters={characters}
            selectedCharacter={selectedCharacter}
            selectedCharacterId={selectedCharacterId}
            tabs={tabs}
            activeTab={activeTab}
            onCharacterChange={handleCharacterChange}
            onTabChange={setActiveTab}
         />

         <Content
            character={selectedCharacter}
            activeTab={activeTab}
            currentRules={currentRules}
            hideRules={currentTab.hideRules}
         >
            <CurrentTabComponent
               selectedCharacter={selectedCharacter}
               setCharacters={setCharacters}
            />
         </Content>
      </section>
   );
};

export default CharacterSheet;
