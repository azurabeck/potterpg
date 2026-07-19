import { useState } from "react";
import {
   CheckIcon,
   PencilIcon,
   TrashIcon,
   ChevronDownIcon,
   ChevronUpIcon,
} from "@heroicons/react/24/outline";
import EmptyContent from "../../Shared/EmptyContent";

const typeLabel = {
   atributo: "Atributos",
   talento: "Talentos",
   titulo: "Títulos e Reputações",
};

const typeColor = {
   atributo: "bg-[#9d564c]",
   talento: "bg-red-500",
   titulo: "bg-yellow-400 text-[#2b0038]",
};

const Table = ({
   rows,
   isSaving,
   onSaveAttribute,
   onEditExtra,
   onDeleteExtra,
}) => {
   const [editingName, setEditingName] = useState("");
   const [draftValue, setDraftValue] = useState("");
   const [collapsedTypes, setCollapsedTypes] = useState(() => {
      if (typeof window === "undefined") return {};

      const isMobile = window.innerWidth < 768;

      return isMobile
         ? {
            atributo: true,
            talento: true,
            titulo: true,
         }
         : {};
   });

   const groupedRows = rows.reduce((acc, row) => {
      acc[row.tipo] = [...(acc[row.tipo] || []), row];
      return acc;
   }, {});

   const toggleType = (type) => {
      setCollapsedTypes((current) => ({
         ...current,
         [type]: !current[type],
      }));
   };

   const handleEditAttribute = (row) => {
      setEditingName(row.nome);
      setDraftValue(String(row.nivel ?? 0));
   };

   const handleDraftChange = (event) => {
      const { value } = event.target;
      if (/^-?\d*$/.test(value)) setDraftValue(value);
   };

   if (!rows.length) {
      return <EmptyContent>Nenhum dado encontrado.</EmptyContent>;
   }

   return (
      <div className="
            space-y-7
            text-xs
            text-purple-100
         ">
         {["atributo", "talento", "titulo"].map((type) => {
            const items = groupedRows[type] || [];
            if (!items.length) return null;

            const isCollapsed = collapsedTypes[type];

            return (
               <section key={type} className="relative">
                  <button
                     type="button"
                     onClick={() => toggleType(type)}
                     className="mb-4 ml-[15px] pr-[20px] flex w-full items-center justify-between gap-2 text-left text-yellow-400 transition hover:text-yellow-300"
                  >
                     <div>
                        <span className="absolute left-[-10px] top-[6px] h-2 w-2 rounded-full bg-yellow-400" />

                        <span>{typeLabel[type]}</span>

                        <span className="text-[10px] text-purple-100/40 ml-3">
                           ({items.length})
                        </span>
                     </div>

                     {isCollapsed ? (
                        <ChevronDownIcon className="h-4 w-4" />
                     ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                     )}

                  </button>

                  {!isCollapsed && (
                     <div className="space-y-5 pl-1 sm:pl-3">
                        {items.map((item) => {
                           const isAttribute = item.tipo === "atributo";
                           const isEditing = editingName === item.nome;
                           const hasChanged =
                              Number(draftValue || 0) !== Number(item.nivel || 0);

                           return (
                              <div key={`${item.tipo}-${item.id || item.nome}`}>
                                 <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                       <span className="h-1 w-1 shrink-0 rounded-full bg-purple-100" />

                                       <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-3">
                                             <span className="shrink-0 text-purple-100">
                                                {item.nome}
                                             </span>

                                             <span className="h-px flex-1 border-t border-dashed border-purple-100/35" />
                                          </div>
                                       </div>
                                    </div>

                                    {isAttribute && isEditing ? (
                                       <input
                                          type="text"
                                          value={draftValue}
                                          onChange={handleDraftChange}
                                          max={item.maximo ?? 10}
                                          min="0"
                                          className="w-[40px] bg-[#9d564c] px-3 py-1 text-center text-xs text-white outline-none ring-1 ring-white/20 focus:ring-yellow-400"
                                       />
                                    ) : (
                                       <span
                                          className={`flex w-[40px] items-center justify-center px-3 py-1 text-xs ${typeColor[type]}`}
                                       >
                                          {item.nivel ?? 0}
                                       </span>
                                    )}

                                    <span className="flex w-[40px] items-center justify-center bg-white/10 px-3 py-1 text-xs text-white">
                                       {item.maximo ?? 10}
                                    </span>

                                    <div className="flex items-center gap-2">
                                       {isAttribute ? (
                                          isEditing ? (
                                             <button
                                                type="button"
                                                disabled={!hasChanged || isSaving}
                                                onClick={() =>
                                                   onSaveAttribute(item.nome, draftValue)
                                                }
                                                className={`transition ${
                                                   hasChanged && !isSaving
                                                      ? "text-yellow-400 hover:text-yellow-300"
                                                      : "text-purple-100/25"
                                                }`}
                                             >
                                                <CheckIcon className="h-4 w-4" />
                                             </button>
                                          ) : (
                                             <button
                                                type="button"
                                                onClick={() => handleEditAttribute(item)}
                                                className="text-purple-100/45 transition hover:text-yellow-400"
                                             >
                                                <PencilIcon className="h-4 w-4" />
                                             </button>
                                          )
                                       ) : (
                                          <>
                                             <button
                                                type="button"
                                                onClick={() => onEditExtra(item)}
                                                className="text-purple-100/45 transition hover:text-yellow-400"
                                             >
                                                <PencilIcon className="h-4 w-4" />
                                             </button>

                                             <button
                                                type="button"
                                                disabled={isSaving}
                                                onClick={() => onDeleteExtra(item)}
                                                className="text-purple-100/35 transition hover:text-red-300 disabled:opacity-40"
                                             >
                                                <TrashIcon className="h-4 w-4" />
                                             </button>
                                          </>
                                       )}
                                    </div>
                                 </div>

                                 {(item.descricao ||
                                    item.vantagem ||
                                    item.conhecidoPor ||
                                    item.titulo) && (
                                    <div className="ml-7 mt-2 max-w-[82%] space-y-1 text-[11px] leading-5 text-purple-100/55">
                                       {item.descricao && (
                                          <p className="whitespace-pre-line">
                                             {item.descricao}
                                          </p>
                                       )}

                                       {item.conhecidoPor && (
                                          <p className="whitespace-pre-line">
                                             {item.conhecidoPor}
                                          </p>
                                       )}

                                       {item.vantagem && (
                                          <p>
                                             <span className="text-yellow-400">
                                                Vantagem:{" "}
                                             </span>
                                             {item.vantagem}
                                          </p>
                                       )}

                                       {item.titulo && (
                                          <p>
                                             <span className="text-yellow-400">
                                                Título:{" "}
                                             </span>
                                             {item.titulo}
                                          </p>
                                       )}
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  )}
               </section>
            );
         })}
      </div>
   );
};

export default Table;