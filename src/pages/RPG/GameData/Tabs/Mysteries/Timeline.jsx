import {
   ChevronDownIcon,
   ChevronUpIcon,
   PencilSquareIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { categoryLabels, categoryOptions } from "./constants";
import { getMysteryDisplayName, groupMysteriesByCategory } from "./helpers";

const statusClasses = {
   "resolvido": "text-green-300",
   "cancelado": "text-red-300",
   "em andamento": "text-yellow-400",
   "em aberto": "text-yellow-400",
};

const renderMysteryDetails = (mystery) => {
   if (mystery.category === "proxima sessão") {
      return (
         <div className="mt-4 space-y-2 pl-3 text-purple-100/80 sm:pl-8">
            <p><span className="text-white/70">Detalhes:</span> {mystery.details || "-"}</p>
            <p><span className="text-white/70">Próxima sessão:</span> {mystery.next_session ? "Sim" : "Não"}</p>
         </div>
      );
   }

   if (mystery.category === "pendencias narrador") {
      return (
         <div className="mt-4 space-y-2 pl-3 text-purple-100/80 sm:pl-8">
            <p><span className="text-white/70">Evento aguardado:</span> {mystery.awaited_event || "-"}</p>
            <p><span className="text-white/70">Situação atual:</span> {mystery.current_situation || "-"}</p>
            <p><span className="text-white/70">Quem pode responder ao Tomas:</span> {mystery.responder || "-"}</p>
         </div>
      );
   }

   const isProject = mystery.category === "projetos";

   return (
      <div className="mt-5 space-y-5 pl-3 text-purple-100/80 sm:pl-8">
         {isProject && mystery.details ? (
            <p><span className="text-white/70">Detalhes:</span> {mystery.details}</p>
         ) : null}

         {mystery.clues?.length ? (
            mystery.clues.map((clue, index) => (
               <article key={`${mystery.id}-${index}`} className="border-l border-white/10 pl-4 leading-5">
                  <div className="mb-2 flex items-center gap-3">
                     <p className="text-yellow-400">{clue.order}. {clue.name || (isProject ? "Objetivo sem nome" : "Pista sem nome")}</p>
                     <span className={statusClasses[clue.status] || "text-purple-100/50"}>{clue.status}</span>
                  </div>

                  <p><span className="text-white/70">{isProject ? "Meta" : "Pergunta"}:</span> {clue.question || "-"}</p>
                  <p><span className="text-white/70">Detalhes:</span> {clue.details || "-"}</p>
                  <p><span className="text-white/70">{isProject ? "Resultado" : "Resolução"}:</span> {clue.resolution || "-"}</p>
               </article>
            ))
         ) : (
            <p className="text-purple-200/50">{isProject ? "Nenhum objetivo registrado." : "Nenhuma pista registrada."}</p>
         )}
      </div>
   );
};

const Timeline = ({ mysteries, expandedMysteryId, setExpandedMysteryId, onEditMystery, onDeleteMystery }) => {
   const groupedMysteries = groupMysteriesByCategory(mysteries);

   if (!mysteries.length) {
      return (
         <div className="flex min-h-[240px] items-center justify-center text-sm text-purple-200/70">
            Nenhum registro encontrado.
         </div>
      );
   }

   return (
      <div className="relative min-h-[330px] text-xs lg:border-e lg:border-dashed lg:border-white/25 lg:pr-10">
         <div className="space-y-8">
            {categoryOptions.map((category) => {
               const categoryMysteries = groupedMysteries[category] || [];
               if (!categoryMysteries.length) return null;

               return (
                  <section key={category} className="relative pl-4">
                     <h4 className="mb-4 text-yellow-400">
                        <span className="absolute left-[-2px] top-[6px] h-2 w-2 rounded-full bg-yellow-400" />
                        {categoryLabels[category] || category}
                     </h4>

                     <div className="space-y-6 pl-2 sm:pl-8">
                        {categoryMysteries.map((mystery) => {
                           const isOpen = expandedMysteryId === mystery.id;

                           return (
                              <article key={mystery.id}>
                                 <div className="grid grid-cols-[minmax(0,auto)_1fr_24px_24px_20px] items-center gap-3">
                                    <button
                                       type="button"
                                       onClick={() => setExpandedMysteryId(isOpen ? "" : mystery.id)}
                                       className="text-left text-purple-100/80 transition hover:text-yellow-400"
                                    >
                                       <span className="mr-2 text-white/80">•</span>
                                       {getMysteryDisplayName(mystery)}
                                    </button>

                                    <div className="border-t border-dashed border-white/15" />

                                    <button
                                       type="button"
                                       onClick={() => onEditMystery(mystery)}
                                       className="text-yellow-400/80 transition hover:text-yellow-300"
                                       title="Editar registro"
                                    >
                                       <PencilSquareIcon className="h-4 w-4" />
                                    </button>

                                    <button
                                       type="button"
                                       onClick={() => onDeleteMystery(mystery.id)}
                                       className="text-red-300/80 transition hover:text-red-200"
                                       title="Excluir registro"
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

                                 <div className="mt-2 pl-5 text-[11px] text-purple-100/50">
                                    Ano {mystery.year || "-"}
                                    {category === "mistérios" || category === "projetos" ? (
                                       <> • <span className={statusClasses[mystery.status] || "text-purple-100/60"}>{mystery.status}</span> • Última aparição: {mystery.last_appearance || "-"}</>
                                    ) : null}
                                 </div>

                                 {isOpen ? renderMysteryDetails(mystery) : null}
                              </article>
                           );
                        })}
                     </div>
                  </section>
               );
            })}
         </div>
      </div>
   );
};

export default Timeline;
