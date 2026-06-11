import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { categoryOptions } from "./constants";
import { groupItemsByCategory } from "./helpers";

const Table = ({ items, onOpenItem, onDeleteItem, isSaving }) => {
   const groupedItems = groupItemsByCategory(items);

   return (
      <div className="relative min-h-[310px] pr-8 text-xs border-e border-dashed border-white/25">

         <div className="space-y-8">
            {items.length ? (
               categoryOptions.map((category) => {
                  const categoryItems = groupedItems[category] || [];
                  if (!categoryItems.length) return null;

                  return (
                     <section key={category} className="relative pl-4">
                        <div className="absolute left-0 top-1 h-full" />
                        <div className="absolute -left-[3px] top-0 h-2 w-2 rounded-full bg-yellow-400" />

                        <h4 className="mb-4 text-yellow-400">{category}</h4>

                        <div className="space-y-3 pl-8">
                           {categoryItems.map((item) => (
                              <div key={item.id} className="grid grid-cols-[minmax(160px,1fr)_48px_52px] items-center gap-3">
                                 <button
                                    type="button"
                                    onClick={() => onOpenItem(item)}
                                    className="flex items-center text-left text-purple-100/80 transition hover:text-yellow-400"
                                 >
                                    <span className="mr-2 text-white/80">•</span>
                                    <span className="line-clamp-1">{item.nome || "Item sem nome"}</span>
                                    <span className="mx-2 flex-1 border-t border-dashed border-purple-100/40" />
                                 </button>

                                 <span className="bg-[#9d564c] px-3 py-1 text-center text-white">
                                    {item.quantidade || 1}
                                 </span>

                                 <div className="flex items-center gap-2">
                                    <button
                                       type="button"
                                       onClick={() => onOpenItem(item)}
                                       className="text-white/50 transition hover:text-yellow-400"
                                       title="Ver detalhes"
                                    >
                                       <InformationCircleIcon className="h-4 w-4" />
                                    </button>

                                    <button
                                       type="button"
                                       disabled={isSaving}
                                       onClick={() => onDeleteItem(item.id)}
                                       className="text-white/40 transition hover:text-red-300 disabled:opacity-40"
                                       title="Excluir item"
                                    >
                                       <TrashIcon className="h-4 w-4" />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>
                  );
               })
            ) : (
               <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-purple-200/70">
                  Nenhum item encontrado.
               </div>
            )}
         </div>
      </div>
   );
};

export default Table;
