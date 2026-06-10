import { useState } from "react";
import {
   MagnifyingGlassIcon,
   ArrowDownTrayIcon,
   TrashIcon,
   ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { getSpells } from "../../services/potterdb";
import { translateSpellsBatch } from "../../services/translator";
import { dividirEmLotes } from "../../utils/array.utils";
import { obterCache, salvarCache } from "../../utils/storage.utils";
import spellsJson from "../../assets/json/spells.json";

const CACHE_KEY = "translated-spells-v1";

const Spells = () => {
   // #region State
   const [spells, setSpells] = useState(spellsJson);
   const [search, setSearch] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [progresso, setProgresso] = useState(0);
   const [statusTraducao, setStatusTraducao] = useState("");
   const [totalSpells, setTotalSpells] = useState(spellsJson.length);
   const [totalSpellsApi, setTotalSpellsApi] = useState(null);
   const [verificandoAtualizacao, setVerificandoAtualizacao] = useState(false);
   const [totalTraduzidos, setTotalTraduzidos] = useState(() => {
      const spellsEmCache = obterCache(CACHE_KEY) || [];
      return spellsEmCache.length;
   });
   // #endregion

   // #region Computed
   const percentualTraduzido = totalSpells > 0
      ? Math.round((totalTraduzidos / totalSpells) * 100)
      : 0;

   const existemNovosFeiticos = totalSpellsApi !== null && totalSpellsApi !== spellsJson.length;

   const filteredSpells = spells.filter((spell) =>
      spell.attributes.name.toLowerCase().includes(search.toLowerCase())
   );
   // #endregion

   // #region Funções de tradução e atualização
   const traduzirFeiticosPendentes = async (spellsOriginais, spellsEmCache) => {
      const mapaCache = {};
      spellsEmCache.forEach((spell) => { mapaCache[spell.id] = spell; });

      const spellsPendentes = spellsOriginais.filter((spell) => !mapaCache[spell.id]);

      console.log(`Feitiços já traduzidos: ${spellsEmCache.length}`);
      console.log(`Feitiços pendentes: ${spellsPendentes.length}`);

      if (spellsPendentes.length === 0) {
         return spellsEmCache;
      }

      const lotes = dividirEmLotes(spellsPendentes, 20);
      const resultadoFinal = [...spellsEmCache];

      setIsLoading(true);

      for (let indiceLote = 0; indiceLote < lotes.length; indiceLote++) {
         try {
            const percentual = Math.round(((indiceLote + 1) / lotes.length) * 100);

            setProgresso(percentual);
            setStatusTraducao(`Traduzindo lote ${indiceLote + 1} de ${lotes.length}`);

            const translated = await translateSpellsBatch(lotes[indiceLote]);
            const parsedBatch = JSON.parse(translated);

            resultadoFinal.push(...parsedBatch);

            setTotalTraduzidos(resultadoFinal.length);
            salvarCache(CACHE_KEY, resultadoFinal);

            await new Promise((resolve) => setTimeout(resolve, 1000));
         } catch (error) {
            console.error(error);
            setStatusTraducao("Limite da IA atingido. Continue mais tarde.");
            break;
         }
      }

      setIsLoading(false);
      return resultadoFinal;
   };

   const verificarAtualizacoes = async () => {
      try {
         setVerificandoAtualizacao(true);

         const spellsApi = await getSpells();

         setTotalSpellsApi(spellsApi.length);
         setTotalSpells(spellsApi.length);

         if (!existemNovosFeiticos) {
            alert("Sem Atualizações Pendentes")
         }
      } catch (error) {
         console.error(error);
      } finally {
         setVerificandoAtualizacao(false);
      }
   };

   const atualizarListaETraduzir = async () => {
      try {
         const spellsEmCache = obterCache(CACHE_KEY) || [];
         const spellsOriginais = await getSpells();

         setTotalSpells(spellsOriginais.length);
         setTotalSpellsApi(spellsOriginais.length);

         const resultado = await traduzirFeiticosPendentes(spellsOriginais, spellsEmCache);

         setTotalTraduzidos(resultado.length);
      } catch (error) {
         console.error(error);
      }
   };

   const limparCache = () => {
      localStorage.removeItem(CACHE_KEY);
      setSpells(spellsJson);
      setTotalTraduzidos(0);
      setProgresso(0);
      setStatusTraducao("");

      alert("Cache Eliminado")
   };
   // #endregion

   // #region Funções de Download
   const baixarCache = () => {
      const spellsEmCache = obterCache(CACHE_KEY) || [];
      const arquivoJson = JSON.stringify(spellsEmCache, null, 2);
      const blob = new Blob([arquivoJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "translated-spells.json";
      link.click();

      URL.revokeObjectURL(url);
   };
   // #endregion

   return (
      <div className="min-h-screen bg-[#2b0038] text-white">
         <section className="sticky top-[65px] z-50 flex bg-[#3b0050]">
            <input
               type="text"
               placeholder="Buscar Feitiços..."
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               className="flex-1 bg-transparent px-8 py-5 text-sm text-white outline-none placeholder:text-purple-300"
            />

            <button className="w-32 border-l border-[#21002b] text-3xl">
               <MagnifyingGlassIcon className="mx-auto h-6 w-6 text-purple-300" />
            </button>
         </section>

         <main className="p-8">
            <div className="mb-8 flex items-center justify-between">
               <p className="text-sm text-purple-300">
                  {filteredSpells.length} feitiços carregados do JSON estático
               </p>

               <div className="flex gap-3">
                  <button
                     onClick={verificarAtualizacoes}
                     disabled={verificandoAtualizacao}
                     title="Verificar atualizações"
                     className="rounded bg-purple-900 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                     Verificar
                  </button>

                  <button
                     onClick={atualizarListaETraduzir}
                     disabled={isLoading}
                     title="Atualizar lista e traduzir"
                     className="rounded bg-purple-600 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                     <ArrowPathIcon className="h-5 w-5" />
                  </button>

                  <button
                     onClick={limparCache}
                     disabled={isLoading}
                     title="Limpar cache"
                     className="rounded bg-red-900 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                     <TrashIcon className="h-5 w-5" />
                  </button>

                  <button
                     onClick={baixarCache}
                     disabled={totalTraduzidos === 0}
                     title="Baixar traduções"
                     className="rounded bg-purple-700 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                     <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
               </div>
            </div>

            {totalTraduzidos > 0 && percentualTraduzido !== 100 && (
               <div className="mb-8 rounded-xl border border-purple-900 bg-[#21002b] p-4">
                  <p className="text-sm">
                     <strong>Tradução:</strong>{" "}
                     {totalTraduzidos} de {totalSpells} feitiços ({percentualTraduzido}%)
                  </p>

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-purple-950">
                     <div
                        className="h-full bg-purple-400 transition-all duration-300"
                        style={{ width: `${percentualTraduzido}%` }}
                     />
                  </div>
               </div>
            )}

            {existemNovosFeiticos && (
               <div className="mb-8 rounded bg-yellow-900/40 p-4 text-sm text-yellow-300">
                  Sua base local possui {spellsJson.length} feitiços, mas a PotterDB possui {totalSpellsApi}.
                  Atualize as traduções e baixe um novo JSON.
               </div>
            )}

            {isLoading && (
               <div className="mb-8 rounded-xl border border-purple-900 bg-[#21002b] p-4">
                  <p className="text-sm font-semibold">{statusTraducao}</p>

                  <div className="mt-3 h-6 w-full overflow-hidden rounded-full bg-purple-950">
                     <div
                        className="h-full bg-purple-400 transition-all duration-300"
                        style={{ width: `${progresso}%` }}
                     />
                  </div>

                  <p className="mt-2 text-sm">{progresso}%</p>
               </div>
            )}

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
               {filteredSpells.map((spell) => (
                  <div key={spell.id} className="overflow-hidden rounded bg-[#190020]">
                     {spell.attributes.image && (
                        <img
                           src={spell.attributes.image}
                           alt={spell.attributes.name}
                           className="h-32 w-full object-cover"
                        />
                     )}

                     <div className="p-4">
                        <h3 className="mb-2 text-sm font-semibold">
                           {spell.attributes.name}
                        </h3>

                        <p className="text-xs text-purple-200">
                           {spell.attributes.effect || "-"}
                        </p>

                        <div className="mt-3 space-y-1 text-xs text-purple-300">
                           <p>
                              <strong>Categoria:</strong>{" "}
                              {spell.attributes.category || "-"}
                           </p>

                           <p>
                              <strong>Movimento:</strong>{" "}
                              {spell.attributes.hand || "-"}
                           </p>

                           <p>
                              <strong>Luz:</strong>{" "}
                              {spell.attributes.light || "-"}
                           </p>

                           <p>
                              <strong>Encantamento:</strong>{" "}
                              {spell.attributes.incantation || "-"}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </main>
      </div>
   );
};

export default Spells;