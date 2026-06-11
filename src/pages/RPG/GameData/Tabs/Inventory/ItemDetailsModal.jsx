import { PencilSquareIcon } from "@heroicons/react/24/outline";

const ItemDetailsModal = ({ item, onEdit }) => {
   return (
      <div className="space-y-5 text-xs text-purple-100/80">
         <div className="border-y border-dashed border-white/25 py-4">
            <div className="mb-4 flex items-center gap-7">
               <div className="h-px flex-1 border-t border-dashed border-white/25" />
               <p className="text-center text-[11px] uppercase text-white">
                  {item.nome || "Item sem nome"}
               </p>
               <div className="h-px flex-1 border-t border-dashed border-white/25" />
            </div>

            <div className="space-y-2 leading-5 text-purple-100/70">
               <p>Categoria: {item.categoria || "-"}</p>
               <p>Quantidade: {item.quantidade || 1}</p>
               <p>Atributo: {item.atributo || "-"}</p>
               <p>Valor do atributo: {item.valor_atributo || "-"}</p>
               <p>Onde encontrou: {item.onde_encontrou || "-"}</p>
            </div>
         </div>

         <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex items-center gap-2 bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            <PencilSquareIcon className="h-4 w-4" />
            Editar item
         </button>
      </div>
   );
};

export default ItemDetailsModal;
