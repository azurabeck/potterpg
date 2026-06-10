import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import spellsJson from "../../assets/json/spells_rpg.json";
import masteryJson from "../../assets/json/mastery_rpg.json";

const YEARS = [1, 2, 3, 4, 5, 6, 7, 8];

const SpellRules = () => {
   const [search, setSearch] = useState("");
   const [selectedYear, setSelectedYear] = useState(1);

   const spellsByYear = useMemo(() => {
      return YEARS.map((year) => ({
         year,
         spells: spellsJson.filter(
            (spell) => spell.attributes.ano_letivo === year
         ),
         required: spellsJson.filter(
            (spell) => spell.attributes.required === year
         ),
      }));
   }, []);

   const filteredSpells = spellsJson.filter((spell) => {
      const name = spell.attributes.name || "";
      const category = spell.attributes.category || "";
      const nivel = spell.attributes.nivel || "";
      const incantation = spell.attributes.incantation || "";

      return `${name} ${category} ${nivel} ${incantation}`
         .toLowerCase()
         .includes(search.toLowerCase());
   });

   return (
      <div className="bg-[#2b0038] text-white">
         <section className="sticky top-[65px] z-50 w-full shadow-md flex bg-[#3b0050]">
            <input
               type="text"
               placeholder="Buscar Feitiços...."
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               className="flex-1 bg-transparent px-8 py-5 text-sm text-white outline-none placeholder:text-purple-300"
            />

            <button className="w-32 border-l border-[#21002b]">
               <MagnifyingGlassIcon className="mx-auto h-7 w-7 text-purple-300" />
            </button>
         </section>

         <main className="p-8">
            <section className="mb-14 flex items-top justify-between text-left">
               <div className=" w-[20%]">
                  <h2 className="mb-4 text-md font-normal">
                     Feitiços por ano letivo
                  </h2>

                  <p className="text-sm leading-5 text-purple-100 ">
                     Esses feitiços são obrigatórios para conquistar certo nível
                     de maestria e avançar para o próximo ano letivo. Feitiços de
                     ano mais alto possuem penalidade no dado quando tentados
                     antes do ano correto.
                  </p>

                  <p className="mt-4 text-sm leading-5 text-purple-100 ">
                     Feitiços proibidos, maldições e magia negra não são
                     aprendidos em matéria comum e recebem punição por crime
                     mágico.
                  </p>
               </div>

               <div className="flex gap-3 overflow-x-auto pb-4">
                  {spellsByYear.map((yearData) => {
                     const isActive = selectedYear === yearData.year;

                     return (
                        <button
                           key={yearData.year}
                           onClick={() => setSelectedYear(yearData.year)}
                           className={`min-h-64 min-w-24 overflow-hidden rounded text-sm transition ${
                              isActive
                                 ? "w-[420px] bg-[#52006b]"
                                 : "w-24 bg-purple-950 opacity-80"
                           }`}
                        >
                           <div
                              className={`h-full ${
                                 isActive
                                    ? "p-4 text-left"
                                    : "flex items-start justify-center p-5"
                              }`}
                           >
                              {!isActive && (
                                 <span className="text-black">
                                    {yearData.year === 8
                                       ? "PÓS"
                                       : `${yearData.year} ANO`}
                                 </span>
                              )}

                              {isActive && (
                                 <>
                                    <div className="mb-6 flex justify-between text-xs text-red-400">
                                       <span>nome</span>
                                       <span>maestria</span>
                                       <span>aula</span>
                                    </div>

                                    <h3 className="mb-5 text-center text-base font-semibold text-purple-100">
                                       {yearData.year === 8
                                          ? "Pós-Hogwarts"
                                          : `${yearData.year}º Ano`}
                                    </h3>

                                    <div className="space-y-4">
                                       {yearData.required.length > 0 ? (
                                          yearData.required.map((spell) => (
                                             <div
                                                key={spell.id}
                                                className="grid grid-cols-[1fr_60px_90px] items-center gap-3 text-sm"
                                             >
                                                <span>
                                                   {
                                                      spell?.attributes?.incantation 
                                                         ? spell.attributes.incantation.includes('(')
                                                            ? spell.attributes.incantation.substring(0, spell.attributes.incantation.indexOf('(')).trim()
                                                            : spell.attributes.incantation
                                                         : (spell?.attributes?.name || spell?.attributes?.slug || '')
                                                   }
                                                </span>

                                                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-purple-300">
                                                   { spell.attributes.maestria_required }
                                                </span>
                                                <span className="text-purple-200">
                                                   {spell.attributes.aula ||
                                                      "-"}
                                                </span>
                                             </div>
                                          ))
                                       ) : (
                                          <p className="text-sm text-purple-300">
                                             Nenhum feitiço obrigatório definido
                                             para este ano.
                                          </p>
                                       )}
                                    </div>

                                    <p className="mt-8 text-right text-xs text-yellow-300">
                                       Outros feitiços do ano:{" "}
                                       {yearData.spells.length}
                                    </p>
                                 </>
                              )}
                           </div>
                        </button>
                     );
                  })}
               </div>
            </section>

            <section className="mb-10 rounded-xl border border-purple-900 bg-[#21002b] p-5">
               <h2 className="mb-4 text-sm font-semibold">
                  Tabela de maestria
               </h2>

               <p className="mb-4 text-sm text-purple-200">
                  O campo <strong>xp_maestria</strong> define quanto XP é
                  necessário para alcançar cada nível de maestria. O{" "}
                  <strong>xp_total</strong> representa a maestria máxima.
               </p>

               <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-xs">
                     <thead className="bg-purple-950 text-purple-200">
                        <tr>
                           <th className="px-3 py-2">Nível</th>
                           <th className="px-3 py-2">XP Total</th>
                           {Array.from({ length: 10 }, (_, index) => (
                              <th key={index} className="px-3 py-2">
                                 M{index + 1}
                              </th>
                           ))}
                        </tr>
                     </thead>

                     <tbody>
                        {masteryJson.maestria.map((mastery) => (
                           <tr
                              key={mastery.aprendizado}
                              className="border-t border-purple-900"
                           >
                              <td className="px-3 py-2">
                                 {mastery.aprendizado}
                              </td>

                              <td className="px-3 py-2">
                                 {mastery.xp_total}
                              </td>

                              {Array.from({ length: 10 }, (_, index) => {
                                 const masteryKey = `M${index + 1}`;

                                 return (
                                    <td key={masteryKey} className="px-3 py-2">
                                       {mastery.xp_maestria[masteryKey]}
                                    </td>
                                 );
                              })}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-purple-900 bg-[#190020]">
               <div className="border-b border-purple-900 bg-[#21002b] p-4">
                  <h2 className="text-sm font-semibold">
                     Lista geral de feitiços
                  </h2>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-sm">
                     <thead className="bg-purple-950 text-xs uppercase text-purple-300">
                        <tr>
                           <th className="px-4 py-3">Ano</th>
                           <th className="px-4 py-3">Nome</th>
                           <th className="px-4 py-3">Aula</th>
                           <th className="px-4 py-3">Nível</th>
                           <th className="px-4 py-3">Required</th>
                           <th className="px-4 py-3">Maestria Req.</th>
                           <th className="px-4 py-3">XP Total</th>
                           <th className="px-4 py-3">Efeito</th>
                        </tr>
                     </thead>

                     <tbody className="divide-y divide-purple-950">
                        {filteredSpells.map((spell) => (
                           <tr key={spell.id} className="hover:bg-[#21002b]">
                              <td className="px-4 py-3">
                                 {spell.attributes.ano_letivo}
                              </td>

                              <td className="px-4 py-3 font-semibold">
                                 {
                                    spell?.attributes?.incantation 
                                       ? spell.attributes.incantation.includes('(')
                                          ? spell.attributes.incantation.substring(0, spell.attributes.incantation.indexOf('(')).trim()
                                          : spell.attributes.incantation
                                       : (spell?.attributes?.name || spell?.attributes?.slug || '')
                                 }
                              </td>

                              <td className="px-4 py-3">
                                 {spell.attributes.aula || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {spell.attributes.nivel || "-"}
                              </td>

                              <td className="px-4 py-3">
                                 {spell.attributes.required || 0}
                              </td>

                              <td className="px-4 py-3">
                                 {spell.attributes.maestria_required || 0}
                              </td>

                              <td className="px-4 py-3">
                                 {spell.attributes.xp_total || "-"}
                              </td>

                              <td className="px-4 py-3 text-purple-200">
                                 {spell.attributes.effect || "-"}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>
         </main>
      </div>
   );
};

export default SpellRules;