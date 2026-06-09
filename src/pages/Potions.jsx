import { useState } from "react";
import {
   MagnifyingGlassIcon,
   ArrowDownTrayIcon,
   TrashIcon,
   ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { getPotions } from "../services/potterdb";
import { translatePotionsBatch } from "../services/translator";
import { dividirEmLotes } from "../utils/array.utils";
import { obterCache, salvarCache } from "../utils/storage.utils";
import potionsJson from "../assets/json/potions.json";

const CACHE_KEY = "translated-potions-v1";

const Potions = () => {
   // #region State
   const [potions, setPotions] = useState(potionsJson);
   const [search, setSearch] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [progresso, setProgresso] = useState(0);
   const [statusTraducao, setStatusTraducao] = useState("");
   const [totalPotions, setTotalPotions] = useState(potionsJson.length);
   const [totalPotionsApi, setTotalPotionsApi] = useState(null);
   const [verificandoAtualizacao, setVerificandoAtualizacao] = useState(false);
   const [totalTraduzidos, setTotalTraduzidos] = useState(() => {
      const potionsEmCache = obterCache(CACHE_KEY) || [];
      return potionsEmCache.length;
   });
   // #endregion

   // #region Computed
   const percentualTraduzido = totalPotions > 0
      ? Math.round((totalTraduzidos / totalPotions) * 100)
      : 0;

   const existemNovasPotions = totalPotionsApi !== null && totalPotionsApi !== potionsJson.length;

   const filteredPotions = potions.filter((items) =>
      items.attributes.name.toLowerCase().includes(search.toLowerCase())
   );
   // #endregion

   // #region Funções de tradução e atualização
   const traduzirPoçõesPendentes = async (potionsOriginais, potionsEmCache) => {
      const mapaCache = {};
      potionsEmCache.forEach((items) => { mapaCache[items.id] = items; });

      const potionsPendentes = potionsOriginais.filter((items) => !mapaCache[items.id]);

      console.log(`Poções já traduzidos: ${potionsEmCache.length}`);
      console.log(`Poções pendentes: ${potionsPendentes.length}`);

      if (potionsPendentes.length === 0) {
         return potionsEmCache;
      }

      const lotes = dividirEmLotes(potionsPendentes, 20);
      const resultadoFinal = [...potionsEmCache];

      setIsLoading(true);

      for (let indiceLote = 0; indiceLote < lotes.length; indiceLote++) {
         try {
            const percentual = Math.round(((indiceLote + 1) / lotes.length) * 100);

            setProgresso(percentual);
            setStatusTraducao(`Traduzindo lote ${indiceLote + 1} de ${lotes.length}`);

            const translated = await translatePotionsBatch(lotes[indiceLote]);
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

         const potionsApi = await getPotions();
         const existeDiferenca = potionsApi.length !== potionsJson.length;

         setTotalPotionsApi(potionsApi.length);
         setTotalPotions(potionsApi.length);

         if (!existeDiferenca) {
            alert("Sem atualizações pendentes");
         }
      } catch (error) {
         console.error(error);
      } finally {
         setVerificandoAtualizacao(false);
      }
   };

   const atualizarListaETraduzir = async () => {
      try {
         const potionsEmCache = obterCache(CACHE_KEY) || [];
         const potionsOriginais = await getPotions();

         setTotalPotions(potionsOriginais.length);
         setTotalPotionsApi(potionsOriginais.length);

         const resultado = await traduzirPoçõesPendentes(potionsOriginais, potionsEmCache);

         setTotalTraduzidos(resultado.length);
      } catch (error) {
         console.error(error);
      }
   };

   const limparCache = () => {
      localStorage.removeItem(CACHE_KEY);
      setPotions(potionsJson);
      setTotalTraduzidos(0);
      setProgresso(0);
      setStatusTraducao("");

      alert("Cache Eliminado")
   };
   // #endregion

   // #region Funções de Download
   const baixarCache = () => {
      const potionsEmCache = obterCache(CACHE_KEY) || [];
      const arquivoJson = JSON.stringify(potionsEmCache, null, 2);
      const blob = new Blob([arquivoJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "translated-potions.json";
      link.click();

      URL.revokeObjectURL(url);
   };
   // #endregion

   return (
      <div className="min-h-screen bg-[#2b0038] text-white">
         <section className="flex bg-[#3b0050]">
            <input
               type="text"
               placeholder="Buscar Poções..."
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
                  {filteredPotions.length} poções carregadas do JSON estático
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
                     {totalTraduzidos} de {totalPotions} poções ({percentualTraduzido}%)
                  </p>

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-purple-950">
                     <div
                        className="h-full bg-purple-400 transition-all duration-300"
                        style={{ width: `${percentualTraduzido}%` }}
                     />
                  </div>
               </div>
            )}

            {existemNovasPotions && (
               <div className="mb-8 rounded bg-yellow-900/40 p-4 text-sm text-yellow-300">
                  Sua base local possui {potionsJson.length} poções, mas a PotterDB possui {totalPotionsApi}.
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
               {filteredPotions.map((item) => (
                     <div
                        key={item.id}
                        className="overflow-hidden rounded bg-[#190020]"
                     >
                        {item.attributes.image && (
                           <div className="flex h-40 w-full items-center justify-center bg-[#120018] p-3">
                           <img
                                 src={item.attributes.image}
                                 alt={item.attributes.name}
                                 className="max-h-full max-w-full object-contain"
                           />
                           </div>
                        )}

                        <div className="p-4">
                           <h3 className="mb-2 text-sm font-semibold">
                           {item.attributes.name}
                           </h3>

                           <p className="text-xs text-purple-200">
                           {item.attributes.effect || "-"}
                           </p>

                           <div className="mt-3 space-y-1 text-xs text-purple-300">
                           <p>
                                 <strong>Dificuldade:</strong>{" "}
                                 {item.attributes.difficulty || "-"}
                           </p>

                           <p>
                                 <strong>Características:</strong>{" "}
                                 {item.attributes.characteristics || "-"}
                           </p>

                           <p>
                                 <strong>Ingredientes:</strong>{" "}
                                 {item.attributes.ingredients || "-"}
                           </p>

                           <p>
                                 <strong>Efeitos colaterais:</strong>{" "}
                                 {item.attributes.side_effects || "-"}
                           </p>

                           <p>
                                 <strong>Tempo:</strong>{" "}
                                 {item.attributes.time || "-"}
                           </p>

                           <p>
                                 <strong>Inventores:</strong>{" "}
                                 {item.attributes.inventors || "-"}
                           </p>

                           <p>
                                 <strong>Fabricantes:</strong>{" "}
                                 {item.attributes.manufacturers || "-"}
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

export default Potions;