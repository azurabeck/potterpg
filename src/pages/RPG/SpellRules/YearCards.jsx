import { getClosedYearLabel, getYearLabel, YEAR_CARD_BG } from "./constants";
import { getSpellDisplayName } from "./helpers";

const YearCards = ({ spellsByYear, selectedYear, onSelectYear }) => {
   return (
      <section className="mb-14 flex flex-col gap-8 text-left xl:flex-row xl:items-start xl:justify-between">
         <div className="w-full xl:w-[20%]">
            <h2 className="mb-4 text-md font-normal">
               Feitiços por ano letivo
            </h2>

            <p className="text-sm leading-5 text-purple-100">
               Esses feitiços são obrigatórios para conquistar certo nível
               de maestria e avançar para o próximo ano letivo. Feitiços de
               ano mais alto possuem penalidade no dado quando tentados
               antes do ano correto.
            </p>

            <p className="mt-4 text-sm leading-5 text-purple-100">
               Feitiços proibidos, maldições e magia negra não são
               aprendidos em matéria comum e recebem punição por crime
               mágico.
            </p>
         </div>

         <div className="flex w-full gap-3 overflow-x-auto pb-4 xl:w-auto">
            {spellsByYear.map((yearData) => {
               const isActive = selectedYear === yearData.year;

               return (
                  <button
                     key={yearData.year}
                     type="button"
                     onClick={() => onSelectYear(yearData.year)}
                     className={`relative min-h-64 min-w-24 overflow-hidden rounded text-sm transition ${
                        isActive
                           ? "w-[420px] bg-[#52006b]"
                           : "w-24 bg-purple-950 opacity-80 hover:opacity-100"
                     }`}
                  >
                     {!isActive && (
                        <>
                           <img
                              src={YEAR_CARD_BG}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                           />

                           <span className="absolute inset-0 bg-black/35" />
                        </>
                     )}

                     <div
                        className={`relative z-10 h-full ${
                           isActive
                              ? "p-4 text-left"
                              : "flex items-start justify-center p-5"
                        }`}
                     >
                        {!isActive && (
                           <span className="text-xs font-semibold text-white drop-shadow">
                              {getClosedYearLabel(yearData.year)}
                           </span>
                        )}

                        {isActive && (
                           <>
                              <div className="mb-6 grid grid-cols-[1fr_70px_90px] gap-3 text-xs text-red-400">
                                 <span>nome</span>
                                 <span className="text-center">maestria</span>
                                 <span>aula</span>
                              </div>

                              <h3 className="mb-5 text-center text-base font-semibold text-purple-100">
                                 {getYearLabel(yearData.year)}
                              </h3>

                              <div className="space-y-4">
                                 {yearData.required.length > 0 ? (
                                    yearData.required.map((spell) => (
                                       <div
                                          key={spell.id}
                                          className="grid grid-cols-[1fr_60px_90px] items-center gap-3 text-sm"
                                       >
                                          <span>{getSpellDisplayName(spell)}</span>

                                          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-purple-300">
                                             {spell.attributes.maestria_required}
                                          </span>

                                          <span className="text-purple-200">
                                             {spell.attributes.aula || "-"}
                                          </span>
                                       </div>
                                    ))
                                 ) : (
                                    <p className="text-sm text-purple-300">
                                       Nenhum feitiço obrigatório definido para este ano.
                                    </p>
                                 )}
                              </div>

                              <p className="mt-8 text-right text-xs text-yellow-300">
                                 Outros feitiços do ano: {yearData.spells.length}
                              </p>
                           </>
                        )}
                     </div>
                  </button>
               );
            })}
         </div>
      </section>
   );
};

export default YearCards;
