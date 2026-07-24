import { getClosedYearLabel, getYearLabel, YEAR_CARD_BG } from "./constants";

const YearCards = ({ potionsByYear, selectedYear, onSelectYear }) => (
   <section className="mb-14 flex flex-col gap-8 text-left xl:flex-row xl:items-start xl:justify-between">
      <div className="w-full xl:w-[20%]">
         <h2 className="mb-4 text-md font-normal">Poções por ano letivo</h2>
         <p className="text-sm leading-5 text-purple-100">
            As receitas mais simples ficam nos primeiros anos. Poções com efeitos mais fortes,
            ingredientes raros e preparos complexos são liberadas nos anos avançados.
         </p>
         <p className="mt-4 text-sm leading-5 text-purple-100">
            O nível e o XP indicam a dificuldade de preparo e a evolução de maestria da poção.
         </p>
      </div>

      <div className="flex w-full gap-3 overflow-x-auto pb-4 xl:w-auto">
         {potionsByYear.map((yearData, index) => {
            const isActive = selectedYear === yearData.year;
            const bgImage = YEAR_CARD_BG[index];

            return (
               <button
                  key={yearData.year}
                  type="button"
                  onClick={() => onSelectYear(yearData.year)}
                  className={`relative min-h-64 min-w-24 overflow-hidden rounded text-sm transition ${
                     isActive ? "w-[420px] bg-[#52006b]" : "w-24 bg-purple-950 opacity-80 hover:opacity-100"
                  }`}
               >
                  {!isActive && bgImage ? (
                     <>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${bgImage}")` }} />
                        <span className="absolute inset-0 bg-black/45" />
                     </>
                  ) : null}

                  <div className={`relative z-10 h-full ${isActive ? "p-4 text-left" : "flex items-start justify-center p-5"}`}>
                     {!isActive ? <span className="text-xs font-semibold text-white drop-shadow">{getClosedYearLabel(yearData.year)}</span> : null}

                     {isActive ? (
                        <>
                           <h3 className="mb-5 text-center text-sm font-semibold text-purple-100">
                              <span className="flex w-full border-t border-dashed border-white/30" />
                              <span className="flex w-full items-center justify-center py-2 text-white/50">{getYearLabel(yearData.year)}</span>
                              <span className="flex w-full border-t border-dashed border-white/30" />
                           </h3>

                           <div className="space-y-4">
                              {yearData.levels.map(([level, count]) => (
                                 <div key={level} className="flex items-center justify-between gap-3 text-xs">
                                    <span>{level}</span>
                                    <span className="text-purple-200">{count} poções</span>
                                 </div>
                              ))}
                           </div>

                           <p className="mt-8 text-right text-xs text-yellow-300">total por ano: {yearData.potions.length}</p>
                        </>
                     ) : null}
                  </div>
               </button>
            );
         })}
      </div>
   </section>
);

export default YearCards;
