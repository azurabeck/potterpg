import {
   ChevronDownIcon,
   ChevronUpIcon,
   PencilSquareIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";

const statusClasses = {
   "resolvido": "text-green-300",
   "cancelado": "text-red-300",
   "em andamento": "text-yellow-400",
   "em aberto": "text-yellow-400",
};

const Timeline = ({ mysteries, expandedMysteryId, setExpandedMysteryId, onEditMystery, onDeleteMystery }) => {
   if (!mysteries.length) {
      return (
         <div className="flex min-h-[240px] items-center justify-center text-sm text-purple-200/70">
            Nenhum mistério encontrado.
         </div>
      );
   }

   return (
      <div className="relative min-h-[330px] pr-10 text-xs border-e border-dashed border-white/25">

         <div className="space-y-8">
            {mysteries.map((mystery) => {
               const isOpen = expandedMysteryId === mystery.id;

               return (
                  <section key={mystery.id}>
                     <div className="grid grid-cols-[minmax(160px,auto)_1fr_24px_24px_20px] items-center gap-3">
                        <button
                           type="button"
                           onClick={() => setExpandedMysteryId(isOpen ? "" : mystery.id)}
                           className="text-left text-yellow-400 transition hover:text-yellow-300"
                        >
                           {mystery.name}
                        </button>

                        <div className="border-t border-dashed border-white/15" />

                        <button
                           type="button"
                           onClick={() => onEditMystery(mystery)}
                           className="text-yellow-400/80 transition hover:text-yellow-300"
                           title="Editar mistério"
                        >
                           <PencilSquareIcon className="h-4 w-4" />
                        </button>

                        <button
                           type="button"
                           onClick={() => onDeleteMystery(mystery.id)}
                           className="text-red-300/80 transition hover:text-red-200"
                           title="Excluir mistério"
                        >
                           <TrashIcon className="h-4 w-4" />
                        </button>

                        <button
                           type="button"
                           onClick={() => setExpandedMysteryId(isOpen ? "" : mystery.id)}
                           className="text-yellow-400/80 transition hover:text-yellow-300"
                           title={isOpen ? "Recolher" : "Expandir"}
                        >
                           {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                        </button>
                     </div>

                     <div className="mt-2 pl-1 text-[11px] text-purple-100/50">
                        Ano {mystery.year || "-"} • <span className={statusClasses[mystery.status] || "text-purple-100/60"}>{mystery.status}</span> • Última aparição: {mystery.last_appearance || "-"}
                     </div>

                     {isOpen ? (
                        <div className="mt-5 space-y-5 pl-8 text-purple-100/80">
                           {mystery.clues?.length ? (
                              mystery.clues.map((clue, index) => (
                                 <article key={`${mystery.id}-${index}`} className="border-l border-white/10 pl-4 leading-5">
                                    <div className="mb-2 flex items-center gap-3">
                                       <p className="text-yellow-400">{clue.order}. {clue.name || "Pista sem nome"}</p>
                                       <span className={statusClasses[clue.status] || "text-purple-100/50"}>{clue.status}</span>
                                    </div>

                                    <p><span className="text-white/70">Pergunta:</span> {clue.question || "-"}</p>
                                    <p><span className="text-white/70">Detalhes:</span> {clue.details || "-"}</p>
                                    <p><span className="text-white/70">Resolução:</span> {clue.resolution || "-"}</p>
                                 </article>
                              ))
                           ) : (
                              <p className="text-purple-200/50">Nenhuma pista registrada.</p>
                           )}
                        </div>
                     ) : null}
                  </section>
               );
            })}
         </div>
      </div>
   );
};

export default Timeline;
