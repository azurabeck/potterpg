import { useState } from "react";
import {
   MagnifyingGlassIcon,
   ArrowDownTrayIcon,
   TrashIcon,
   ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { getMovies } from "../../services/potterdb";
import { translateMoviesBatch } from "../../services/translator";
import { dividirEmLotes } from "../../utils/array.utils";
import { obterCache, salvarCache } from "../../utils/storage.utils";
import moviesJson from "../../assets/json/movies.json";

const CACHE_KEY = "translated-movies-v1";

const Movies = () => {
   // #region State
   const [movies, setMovies] = useState(moviesJson);
   const [search, setSearch] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [progresso, setProgresso] = useState(0);
   const [statusTraducao, setStatusTraducao] = useState("");
   const [totalMovies, setTotalMovies] = useState(moviesJson.length);
   const [totalMoviesApi, setTotalMoviesApi] = useState(null);
   const [verificandoAtualizacao, setVerificandoAtualizacao] = useState(false);
   const [totalTraduzidos, setTotalTraduzidos] = useState(() => {
      const moviesEmCache = obterCache(CACHE_KEY) || [];
      return moviesEmCache.length;
   });
   // #endregion

   // #region Computed
   const percentualTraduzido = totalMovies > 0
      ? Math.round((totalTraduzidos / totalMovies) * 100)
      : 0;

   const existemNovosMovies = totalMoviesApi !== null && totalMoviesApi !== moviesJson.length;

   const filteredMovies = movies?.filter((item) =>
      item.attributes.title?.toLowerCase().includes(search?.toLowerCase())
   );
   // #endregion

   // #region Funções de tradução e atualização
   const traduzirFilmesPendentes = async (moviesOriginais, moviesEmCache) => {
      const mapaCache = {};
      moviesEmCache.forEach((item) => { mapaCache[item.id] = item; });

      const moviesPendentes = moviesOriginais.filter((item) => !mapaCache[item.id]);

      console.log(`Filmes já traduzidos: ${moviesEmCache.length}`);
      console.log(`Filmes pendentes: ${moviesPendentes.length}`);

      if (moviesPendentes.length === 0) {
         return moviesEmCache;
      }

      const lotes = dividirEmLotes(moviesPendentes, 20);
      const resultadoFinal = [...moviesEmCache];

      setIsLoading(true);

      for (let indiceLote = 0; indiceLote < lotes.length; indiceLote++) {
         try {
            const percentual = Math.round(((indiceLote + 1) / lotes.length) * 100);

            setProgresso(percentual);
            setStatusTraducao(`Traduzindo lote ${indiceLote + 1} de ${lotes.length}`);

            const translated = await translateMoviesBatch(lotes[indiceLote]);
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

         const moviesApi = await getMovies();
         const existeDiferenca = moviesApi.length !== moviesJson.length;

         setTotalMoviesApi(moviesApi.length);
         setTotalMovies(moviesApi.length);

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
         const moviesEmCache = obterCache(CACHE_KEY) || [];
         const moviesOriginais = await getMovies();

         setTotalMovies(moviesOriginais.length);
         setTotalMoviesApi(moviesOriginais.length);

         const resultado = await traduzirFilmesPendentes(moviesOriginais, moviesEmCache);

         setTotalTraduzidos(resultado.length);
      } catch (error) {
         console.error(error);
      }
   };

   const limparCache = () => {
      localStorage.removeItem(CACHE_KEY);
      setMovies(moviesJson);
      setTotalTraduzidos(0);
      setProgresso(0);
      setStatusTraducao("");

      alert("Cache eliminado");
   };
   // #endregion

   // #region Funções de Download
   const baixarCache = () => {
      const moviesEmCache = obterCache(CACHE_KEY) || [];
      const arquivoJson = JSON.stringify(moviesEmCache, null, 2);
      const blob = new Blob([arquivoJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "translated-movies.json";
      link.click();

      URL.revokeObjectURL(url);
   };
   // #endregion

   return (
      <div className="min-h-screen bg-[#2b0038] text-white">
         <section className="flex bg-[#3b0050]">
            <input
               type="text"
               placeholder="Buscar Filmes..."
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
                  {filteredMovies.length} filmes carregados do JSON estático
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

            {existemNovosMovies && (
               <div className="mb-8 rounded bg-yellow-900/40 p-4 text-sm text-yellow-300">
                  Sua base local possui {moviesJson.length} filmes, mas a PotterDB possui {totalMoviesApi}.
                  Atualize as traduções e baixe um novo JSON.
               </div>
            )}

            {totalTraduzidos > 0 && percentualTraduzido !== 100 && (
               <div className="mb-8 rounded-xl border border-purple-900 bg-[#21002b] p-4">
                  <p className="text-sm">
                     <strong>Tradução:</strong>{" "}
                     {totalTraduzidos} de {totalMovies} filmes ({percentualTraduzido}%)
                  </p>

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-purple-950">
                     <div
                        className="h-full bg-purple-400 transition-all duration-300"
                        style={{ width: `${percentualTraduzido}%` }}
                     />
                  </div>
               </div>
            )}

            {percentualTraduzido === 100 && totalTraduzidos > 0 && (
               <div className="mb-8 text-sm text-purple-300">
                  Traduções disponíveis para download! ({totalTraduzidos} filmes)
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

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
               {filteredMovies.map((item) => (
                  <div key={item.id} className="flex overflow-hidden rounded bg-[#190020]">
                     <div className="flex w-36 shrink-0 items-center justify-center bg-[#120018] p-2">
                        {item.attributes.poster && (
                           <img
                              src={item.attributes.poster}
                              alt={item.attributes.title}
                              onError={(event) => {
                                 event.currentTarget.style.display = "none";
                              }}
                              className="max-h-56 max-w-full object-contain"
                           />
                        )}
                     </div>

                     <div className="p-4">
                        <h3 className="mb-2 text-sm font-semibold">
                           {item.attributes.title}
                        </h3>

                        <p className="mb-3 text-xs text-purple-200">
                           {item.attributes.summary || "-"}
                        </p>

                        <div className="space-y-1 text-xs text-purple-300">
                           <p>
                              <strong>Lançamento:</strong>{" "}
                              {item.attributes.release_date || "-"}
                           </p>

                           <p>
                              <strong>Duração:</strong>{" "}
                              {item.attributes.running_time || "-"}
                           </p>

                           <p>
                              <strong>Direção:</strong>{" "}
                              {item.attributes.directors || "-"}
                           </p>

                           <p>
                              <strong>Roteiro:</strong>{" "}
                              {item.attributes.screenwriters || "-"}
                           </p>

                           <p>
                              <strong>Distribuição:</strong>{" "}
                              {item.attributes.distributors || "-"}
                           </p>

                           <p>
                              <strong>Bilheteria:</strong>{" "}
                              {item.attributes.box_office || "-"}
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

export default Movies;