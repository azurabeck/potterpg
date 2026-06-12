import { ChevronDownIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { attributeLabels } from "./constants";
import { getMainAttributes } from "./helpers";

const Table = ({ relations, expandedRelationId, setExpandedRelationId, onSelectRelation, onEditRelation }) => {
   const handleToggle = (relation) => {
      onSelectRelation(relation);
      setExpandedRelationId((current) => current === relation.id ? "" : relation.id);
   };

   return (
      <div className="relative min-h-[310px] pr-10 text-xs border-e border-dashed border-white/25">
         {relations.length ? (
            <div className="space-y-7">
               {relations.map((relation) => {
                  const isOpen = expandedRelationId === relation.id;
                  const mainAttributes = getMainAttributes(relation.atributos);

                  return (
                     <section key={relation.id} className="space-y-3">
                        <div className="grid grid-cols-[minmax(160px,1fr)_28px_24px] items-center gap-2">
                           <button
                              type="button"
                              onClick={() => handleToggle(relation)}
                              className={`flex items-center text-left transition ${isOpen ? "text-yellow-400" : "text-[#9d564c] hover:text-yellow-400"}`}
                           >
                              <span className="line-clamp-1">{relation.name || "NPC sem nome"}</span>
                              <span className="mx-3 flex-1 border-t border-dashed border-purple-100/20" />
                           </button>

                           <button
                              type="button"
                              onClick={() => onEditRelation(relation)}
                              className="text-yellow-400/70 transition hover:text-yellow-400"
                              title="Editar relação"
                           >
                              <PencilSquareIcon className="h-4 w-4" />
                           </button>

                           <button
                              type="button"
                              onClick={() => handleToggle(relation)}
                              className="text-yellow-400/70 transition hover:text-yellow-400"
                              title={isOpen ? "Fechar" : "Abrir"}
                           >
                              <ChevronDownIcon className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                           </button>
                        </div>

                        {isOpen ? (
                           <div className="space-y-4 pl-1 text-purple-100/80">
                              <p className="text-[11px] text-white/80">
                                 Ano {relation.ano || "-"} • {relation.relacao || "Conhecido"} • Amizade {relation.amizade ?? 0} • Confiança {relation.confianca ?? 0}
                              </p>

                              <div>
                                 <p className="mb-2 text-[11px] uppercase text-white">Atributos:</p>

                                 <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-[11px] leading-4 text-purple-100/70">
                                    {attributeLabels.map((attribute) => (
                                       <p key={attribute}>*{attribute} - {relation.atributos?.[attribute] ?? 0}</p>
                                    ))}
                                 </div>
                              </div>

                              {mainAttributes ? (
                                 <p className="text-[11px] leading-4 text-purple-100/70">
                                    Principais atributos: {mainAttributes}
                                 </p>
                              ) : null}

                              <div className="space-y-1 text-[11px] leading-4 text-purple-100/70">
                                 {relation.caracteristicas ? <p>Características: {relation.caracteristicas}</p> : null}
                                 {relation.personalidade ? <p>Personalidade: {relation.personalidade}</p> : null}
                                 {relation.detalhes ? <p>Detalhes: {relation.detalhes}</p> : null}
                              </div>
                           </div>
                        ) : null}
                     </section>
                  );
               })}
            </div>
         ) : (
            <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-purple-200/70">
               Nenhuma relação encontrada.
            </div>
         )}
      </div>
   );
};

export default Table;
