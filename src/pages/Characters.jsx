import { useEffect, useMemo, useState } from "react";
import {
   MagnifyingGlassIcon,
   ArrowDownTrayIcon,
   TrashIcon,
   ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { getCharacters } from "../services/potterdb";
import { translateCharactersBatch } from "../services/translator";

import { dividirEmLotes } from "../utils/array.utils";
import { obterCache, salvarCache } from "../utils/storage.utils";
import { converterTextoParaJson } from "../utils/json.utils";

import charactersJson from "../assets/json/characters.json";

const CACHE_KEY = "translated-characters-v1";

const PAGE_SIZE = 5;

const FILTER_COLUMNS = [
   { key: "house", label: "Casa" },
   { key: "species", label: "Espécie" },
   { key: "gender", label: "Gênero" },
   { key: "blood_status", label: "Sangue" },
   { key: "nationality", label: "Nacionalidade" },
   { key: "patronus", label: "Patrono" },
];

const Characters = () => {
   // #region State
   const [characters] = useState(charactersJson);
   const [search, setSearch] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [progresso, setProgresso] = useState(0);
   const [statusTraducao, setStatusTraducao] = useState("");
   const [totalCharacters, setTotalCharacters] = useState(charactersJson.length);
   const [totalTraduzidos, setTotalTraduzidos] = useState(charactersJson.length);
   const [totalCharactersApi, setTotalCharactersApi] = useState(0);
   const [verificandoAtualizacao, setVerificandoAtualizacao] = useState(false);

   const [paginaAtual, setPaginaAtual] = useState(1);
   const [ordenacao, setOrdenacao] = useState({
      key: "name",
      direction: "asc",
   });

   const [filtros, setFiltros] = useState({
      house: [],
      species: [],
      gender: [],
      blood_status: [],
      nationality: [],
      patronus: [],
   });
   // #endregion

   // #region Funções de tradução
   const obterUltimoIdDoJsonEstatico = () => {
      const ultimoPersonagem = charactersJson[charactersJson.length - 1];

      return ultimoPersonagem?.id;
   };

   const traduzirPersonagensPendentes = async (
      charactersOriginais,
      charactersEmCache
   ) => {
      const ultimoIdDoJsonEstatico = obterUltimoIdDoJsonEstatico();

      const indiceUltimoJson = charactersOriginais.findIndex(
         (character) => character.id === ultimoIdDoJsonEstatico
      );

      const charactersDepoisDoJsonEstatico =
         indiceUltimoJson >= 0
            ? charactersOriginais.slice(indiceUltimoJson + 1)
            : charactersOriginais;

      const mapaCache = {};

      charactersEmCache.forEach((character) => {
         mapaCache[character.id] = character;
      });

      const charactersPendentes = charactersDepoisDoJsonEstatico.filter(
         (character) => !mapaCache[character.id]
      );

      if (charactersPendentes.length === 0) {
         return [...charactersJson, ...charactersEmCache];
      }

      const lotes = dividirEmLotes(charactersPendentes, 20);
      const resultadoCache = [...charactersEmCache];

      setIsLoading(true);

      for (let indiceLote = 0; indiceLote < lotes.length; indiceLote++) {
         try {
            const percentual = Math.round(
               ((indiceLote + 1) / lotes.length) * 100
            );

            setProgresso(percentual);
            setStatusTraducao(
               `Traduzindo lote ${indiceLote + 1} de ${lotes.length}`
            );

            const translated = await translateCharactersBatch(lotes[indiceLote]);
            const parsedBatch = converterTextoParaJson(translated);

            resultadoCache.push(...parsedBatch);

            salvarCache(CACHE_KEY, resultadoCache);

            setTotalTraduzidos(charactersJson.length + resultadoCache.length);

            await new Promise((resolve) => setTimeout(resolve, 1000));
         } catch (error) {
            console.error(error);
            setStatusTraducao("Limite da IA atingido. Continue mais tarde.");
            break;
         }
      }

      setIsLoading(false);

      return [...charactersJson, ...resultadoCache];
   };

   const atualizarListaETraduzir = async () => {
      try {
         const charactersEmCache = obterCache(CACHE_KEY) || [];
         const charactersOriginais = await getCharacters();

         setTotalCharacters(charactersOriginais.length);
         setTotalCharactersApi(charactersOriginais.length);

         const resultado = await traduzirPersonagensPendentes(
            charactersOriginais,
            charactersEmCache
         );

         setTotalTraduzidos(resultado.length);
      } catch (error) {
         console.error(error);
      }
   };

   const verificarAtualizacoes = async () => {
      try {
         setVerificandoAtualizacao(true);

         const charactersOriginais = await getCharacters();

         setTotalCharacters(charactersOriginais.length);
         setTotalCharactersApi(charactersOriginais.length);
      } catch (error) {
         console.error(error);
      } finally {
         setVerificandoAtualizacao(false);
      }
   };
   // #endregion

   // #region Effects
   useEffect(() => {
      const carregarTotal = async () => {
         const charactersOriginais = await getCharacters();

         setTotalCharacters(charactersOriginais.length);
         setTotalCharactersApi(charactersOriginais.length);
      };

      carregarTotal();
   }, []);
   // #endregion

   // #region Helpers
   const obterValorCampo = (item, key) => {
      return item.attributes[key] || "-";
   };

   const obterOpcoesFiltro = (key) => {
      const valores = characters.map((item) => obterValorCampo(item, key));

      return [...new Set(valores)].sort((a, b) => a.localeCompare(b));
   };

   const alterarFiltro = (key, values) => {
      setFiltros((filtrosAtuais) => ({
         ...filtrosAtuais,
         [key]: values,
      }));

      setPaginaAtual(1);
   };

   const alterarOrdenacao = (key) => {
      setOrdenacao((ordenacaoAtual) => {
         if (ordenacaoAtual.key === key) {
            return {
               key,
               direction: ordenacaoAtual.direction === "asc" ? "desc" : "asc",
            };
         }

         return {
            key,
            direction: "asc",
         };
      });
   };

   const obterIconeOrdenacao = (key) => {
      if (ordenacao.key !== key) {
         return "↕";
      }

      return ordenacao.direction === "asc" ? "↑" : "↓";
   };
   // #endregion

   // #region Computed
   const percentualTraduzido =
      totalCharacters > 0
         ? Math.round((totalTraduzidos / totalCharacters) * 100)
         : 0;

   const existemNovosPersonagens = totalCharactersApi > charactersJson.length;

   const charactersFiltrados = useMemo(() => {
      return characters
         .filter((item) => {
            const nome = item.attributes.name || "";

            return nome.toLowerCase().includes(search.toLowerCase());
         })
         .filter((item) => {
            return FILTER_COLUMNS.every((column) => {
               const filtroAtual = filtros[column.key];

               if (!filtroAtual.length) {
                  return true;
               }

               return filtroAtual.includes(obterValorCampo(item, column.key));
            });
         })
         .sort((a, b) => {
            const valorA = obterValorCampo(a, ordenacao.key);
            const valorB = obterValorCampo(b, ordenacao.key);

            if (ordenacao.direction === "asc") {
               return valorA.localeCompare(valorB);
            }

            return valorB.localeCompare(valorA);
         });
   }, [characters, search, filtros, ordenacao]);

   const totalPaginas = Math.ceil(charactersFiltrados.length / PAGE_SIZE);

   const charactersPaginados = charactersFiltrados.slice(
      (paginaAtual - 1) * PAGE_SIZE,
      paginaAtual * PAGE_SIZE
   );
   // #endregion

   // #region Funções de cache/download
   const limparCache = () => {
      localStorage.removeItem(CACHE_KEY);
      setTotalTraduzidos(charactersJson.length);
      setProgresso(0);
      setStatusTraducao("");
   };

   const baixarCache = () => {
      const charactersEmCache = obterCache(CACHE_KEY) || [];
      const arquivoJson = JSON.stringify(charactersEmCache, null, 2);

      const blob = new Blob([arquivoJson], {
         type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "translated-characters.json";
      link.click();

      URL.revokeObjectURL(url);
   };
   // #endregion

   // #region Render
   return (
      <div className="bg-[#2b0038] text-white">
         <section className="flex bg-[#3b0050]">
            <input
               type="text"
               placeholder="Buscar Personagens..."
               value={search}
               onChange={(event) => {
                  setSearch(event.target.value);
                  setPaginaAtual(1);
               }}
               className="flex-1 bg-transparent px-8 py-5 text-sm text-white outline-none placeholder:text-purple-300"
            />

            <button className="w-32 border-l border-[#21002b] text-3xl">
               <MagnifyingGlassIcon className="mx-auto h-6 w-6 text-purple-300" />
            </button>
         </section>

         <main className="px-8 pt-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
               <p className="text-sm text-purple-300">
                  {charactersFiltrados.length} personagens encontrados de{" "}
                  {charactersJson.length} no JSON estático
               </p>

               <div className="flex flex-wrap gap-3">
                  <button
                     onClick={verificarAtualizacoes}
                     disabled={verificandoAtualizacao}
                     title="Verificar atualizações"
                     className="flex items-center gap-2 rounded bg-purple-900 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                     {verificandoAtualizacao && (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                     )}
                     Verificar
                  </button>

                  <button
                     onClick={atualizarListaETraduzir}
                     disabled={isLoading}
                     title="Atualizar lista e traduzir"
                     className="rounded bg-purple-600 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                     <ArrowPathIcon
                        className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                     />
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
                     disabled={totalTraduzidos === charactersJson.length}
                     title="Baixar traduções"
                     className="rounded bg-purple-700 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                     <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
               </div>
            </div>

            <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
               {FILTER_COLUMNS.map((column) => {
                  const opcoes = obterOpcoesFiltro(column.key);
                  const selecionados = filtros[column.key];
                  const todosSelecionados = selecionados.length === opcoes.length;

                  return (
                     <div key={column.key} className="relative text-xs text-purple-300 text-left">
                        <details className="bg-[#190020]">
                           <summary className="cursor-pointer list-none px-3 py-2 text-white">
                              {selecionados.length === 0
                                 ? `Selecionar ${column.label}`
                                 : todosSelecionados
                                    ? "Todos selecionados"
                                    : `${selecionados.length} selecionado(s)`}
                           </summary>

                           <div className="p-2 absolute bg-[#190020]">

                              <div className="max-h-42 overflow-auto">
                                 {opcoes.map((option) => {
                                    const isChecked = selecionados.includes(option);

                                    return (
                                       <label
                                          key={option}
                                          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-purple-100 hover:bg-purple-950"
                                       >
                                          <input
                                             type="checkbox"
                                             checked={isChecked}
                                             onChange={(event) => {
                                                const novasOpcoes = event.target.checked
                                                   ? [...selecionados, option]
                                                   : selecionados.filter((item) => item !== option);

                                                alterarFiltro(column.key, novasOpcoes);
                                             }}
                                             className="accent-purple-500"
                                          />

                                          <span>{option}</span>
                                       </label>
                                    );
                                 })}
                              </div>

                              <div className="flex gap-2">
                                 <button
                                    type="button"
                                    onClick={() => alterarFiltro(column.key, opcoes)}
                                    className="rounded px-2 py-1 text-[10px] font-normal text-[#efefef]"
                                 >
                                    Selecionar todos
                                 </button>

                                 <button
                                    type="button"
                                    onClick={() => alterarFiltro(column.key, [])}
                                    className="rounded px-2 py-1 text-[10px] font-normal text-white"
                                 >
                                    Limpar
                                 </button>
                              </div>
                           </div>
                        </details>
                     </div>
                  );
               })}
            </div>

            {totalTraduzidos > charactersJson.length && percentualTraduzido !== 100 && (
               <div className="mb-8 rounded-xl border border-purple-900 bg-[#21002b] p-4">
                  <p className="text-sm">
                     <strong>Tradução:</strong>{" "}
                     {totalTraduzidos} de {totalCharacters} personagens (
                     {percentualTraduzido}%)
                  </p>

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-purple-950">
                     <div
                        className="h-full bg-purple-400 transition-all duration-300"
                        style={{ width: `${percentualTraduzido}%` }}
                     />
                  </div>
               </div>
            )}

            {existemNovosPersonagens && (
               <div className="mb-8 rounded bg-yellow-900/40 p-4 text-sm text-yellow-300">
                  Sua base local possui {charactersJson.length} personagens, mas
                  a PotterDB possui {totalCharactersApi}. Atualize as traduções
                  e baixe um novo JSON.
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

            <div className="overflow-hidden bg-[#190020]">
               <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-sm">
                     <thead className="bg-[#21002b] text-xs uppercase text-purple-300">
                        <tr>
                           <th className="px-4 py-3">Imagem</th>

                           <th
                              className="cursor-pointer px-4 py-3"
                              onClick={() => alterarOrdenacao("name")}
                           >
                              Nome {obterIconeOrdenacao("name")}
                           </th>

                           {FILTER_COLUMNS.map((column) => (
                              <th
                                 key={column.key}
                                 className="cursor-pointer px-4 py-3"
                                 onClick={() => alterarOrdenacao(column.key)}
                              >
                                 {column.label} {obterIconeOrdenacao(column.key)}
                              </th>
                           ))}

                           <th
                              className="cursor-pointer px-4 py-3"
                              onClick={() => alterarOrdenacao("born")}
                           >
                              Nascimento {obterIconeOrdenacao("born")}
                           </th>

                           <th className="px-4 py-3">Wiki</th>
                        </tr>
                     </thead>

                     <tbody className="divide-y divide-purple-950">
                        {charactersPaginados.map((item) => (
                           <tr key={item.id} className="hover:bg-[#21002b]">
                              <td className="px-4 py-3">
                                 <div className="flex h-14 w-14 items-center justify-center rounded bg-[#120018]">
                                    {item.attributes.image ? (
                                       <img
                                          src={item.attributes.image}
                                          alt={item.attributes.name}
                                          className="max-h-full max-w-full object-contain"
                                       />
                                    ) : (
                                       <span className="text-[10px] text-purple-400">
                                          Sem imagem
                                       </span>
                                    )}
                                 </div>
                              </td>

                              <td className="px-4 py-3 font-semibold">
                                 {item.attributes.name || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.house || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.species || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.gender || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.blood_status || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.nationality || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.patronus || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.born || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {item.attributes.wiki ? (
                                    <a
                                       href={item.attributes.wiki}
                                       target="_blank"
                                       rel="noreferrer"
                                       className="font-semibold text-purple-300 hover:text-purple-100"
                                    >
                                       Abrir
                                    </a>
                                 ) : (
                                    "-"
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="flex flex-col gap-3 border-t border-purple-900 bg-[#21002b] px-4 py-4 text-sm text-purple-200 md:flex-row md:items-center md:justify-between">
                  <span>
                     Página {paginaAtual} de {totalPaginas || 1}
                  </span>

                  <div className="flex gap-2">
                     <button
                        onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                        disabled={paginaAtual === 1}
                        className="rounded bg-purple-900 px-3 py-2 font-semibold disabled:opacity-50"
                     >
                        Anterior
                     </button>

                     <button
                        onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                        disabled={paginaAtual >= totalPaginas}
                        className="rounded bg-purple-900 px-3 py-2 font-semibold disabled:opacity-50"
                     >
                        Próxima
                     </button>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
   // #endregion
};

export default Characters;