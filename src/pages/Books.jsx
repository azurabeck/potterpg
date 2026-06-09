import { useState } from "react";
import {
   MagnifyingGlassIcon,
   ArrowDownTrayIcon,
   TrashIcon,
   ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { getBooks } from "../services/potterdb";
import { translateBooksBatch } from "../services/translator";
import { dividirEmLotes } from "../utils/array.utils";
import { obterCache, salvarCache } from "../utils/storage.utils";
import booksJson from "../assets/json/books.json";

const CACHE_KEY = "translated-books-v1";

const Books = () => {
   // #region State
   const [books, setBooks] = useState(booksJson);
   const [search, setSearch] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [progresso, setProgresso] = useState(0);
   const [statusTraducao, setStatusTraducao] = useState("");
   const [totalBooks, setTotalBooks] = useState(booksJson.length);
   const [totalBooksApi, setTotalBooksApi] = useState(null);
   const [verificandoAtualizacao, setVerificandoAtualizacao] = useState(false);
   const [totalTraduzidos, setTotalTraduzidos] = useState(() => {
      const booksEmCache = obterCache(CACHE_KEY) || [];
      return booksEmCache.length;
   });
   // #endregion

   // #region Computed
   const percentualTraduzido = totalBooks > 0
      ? Math.round((totalTraduzidos / totalBooks) * 100)
      : 0;

   const existemNovosBooks = totalBooksApi !== null && totalBooksApi !== booksJson.length;

   const filteredBooks = books?.filter((item) =>
      item.attributes.title?.toLowerCase().includes(search?.toLowerCase())
   );
   // #endregion

   // #region Funções de tradução e atualização
   const traduzirLivrosPendentes = async (booksOriginais, booksEmCache) => {
      const mapaCache = {};
      booksEmCache.forEach((item) => { mapaCache[item.id] = item; });

      const booksPendentes = booksOriginais.filter((item) => !mapaCache[item.id]);

      console.log(`Livros já traduzidos: ${booksEmCache.length}`);
      console.log(`Livros pendentes: ${booksPendentes.length}`);

      if (booksPendentes.length === 0) {
         return booksEmCache;
      }

      const lotes = dividirEmLotes(booksPendentes, 20);
      const resultadoFinal = [...booksEmCache];

      setIsLoading(true);

      for (let indiceLote = 0; indiceLote < lotes.length; indiceLote++) {
         try {
            const percentual = Math.round(((indiceLote + 1) / lotes.length) * 100);

            setProgresso(percentual);
            setStatusTraducao(`Traduzindo lote ${indiceLote + 1} de ${lotes.length}`);

            const translated = await translateBooksBatch(lotes[indiceLote]);
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

         const booksApi = await getBooks();
         const existeDiferenca = booksApi.length !== booksJson.length;

         setTotalBooksApi(booksApi.length);
         setTotalBooks(booksApi.length);

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
         const booksEmCache = obterCache(CACHE_KEY) || [];
         const booksOriginais = await getBooks();

         setTotalBooks(booksOriginais.length);
         setTotalBooksApi(booksOriginais.length);

         const resultado = await traduzirLivrosPendentes(booksOriginais, booksEmCache);

         setTotalTraduzidos(resultado.length);
      } catch (error) {
         console.error(error);
      }
   };

   const limparCache = () => {
      localStorage.removeItem(CACHE_KEY);
      setBooks(booksJson);
      setTotalTraduzidos(0);
      setProgresso(0);
      setStatusTraducao("");

      alert("Cache eliminado");
   };
   // #endregion

   // #region Funções de Download
   const baixarCache = () => {
      const booksEmCache = obterCache(CACHE_KEY) || [];
      const arquivoJson = JSON.stringify(booksEmCache, null, 2);
      const blob = new Blob([arquivoJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "translated-books.json";
      link.click();

      URL.revokeObjectURL(url);
   };
   // #endregion

   return (
      <div className="min-h-screen bg-[#2b0038] text-white">
         <section className="flex bg-[#3b0050]">
            <input
               type="text"
               placeholder="Buscar Livros..."
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
                  {filteredBooks.length} livros carregados do JSON estático
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

            {existemNovosBooks && (
               <div className="mb-8 rounded bg-yellow-900/40 p-4 text-sm text-yellow-300">
                  Sua base local possui {booksJson.length} livros, mas a PotterDB possui {totalBooksApi}.
                  Atualize as traduções e baixe um novo JSON.
               </div>
            )}

            {totalTraduzidos > 0 && percentualTraduzido !== 100 && (
               <div className="mb-8 rounded-xl border border-purple-900 bg-[#21002b] p-4">
                  <p className="text-sm">
                     <strong>Tradução:</strong>{" "}
                     {totalTraduzidos} de {totalBooks} livros ({percentualTraduzido}%)
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
                  Traduções disponíveis para download! ({totalTraduzidos} livros)
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
                  {filteredBooks.map((item) => (
                     <div
                        key={item.id}
                        className="overflow-hidden rounded bg-[#190020]"
                     >
                        <div className="flex h-72 w-full items-center justify-center bg-[#120018] p-3">
                              {item.attributes.cover && (
                              <img
                                 src={item.attributes.cover}
                                 alt={item.attributes.title}
                                 onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                 }}
                                 className="max-h-full max-w-full object-contain"
                              />
                              )}
                        </div>

                        <div className="p-4">
                              <h3 className="mb-2 text-sm font-semibold">
                              {item.attributes.title}
                              </h3>

                              <p className="text-xs text-purple-200">
                              {item.attributes.summary || "-"}
                              </p>

                              <div className="mt-3 space-y-1 text-xs text-purple-300">
                              <p>
                                 <strong>Autor:</strong>{" "}
                                 {item.attributes.author || "-"}
                              </p>

                              <p>
                                 <strong>Páginas:</strong>{" "}
                                 {item.attributes.pages || "-"}
                              </p>

                              <p>
                                 <strong>Lançamento:</strong>{" "}
                                 {item.attributes.release_date || "-"}
                              </p>

                              <p>
                                 <strong>Dedicatória:</strong>{" "}
                                 {item.attributes.dedication || "-"}
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

export default Books;