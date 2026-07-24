import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getYearLabel } from "./constants";

const PotionsTable = ({ potions, selectedYear, onEditPotion, onDeletePotion, deletingPotionId }) => (
   <section className="overflow-hidden rounded-xl border border-purple-900 bg-[#190020]">
      <div className="border-b border-purple-900 bg-[#21002b] p-4">
         <h2 className="text-sm font-semibold">Lista geral de poções</h2>
         <p className="mt-1 text-xs text-purple-300">Filtrando por: {getYearLabel(selectedYear)}</p>
      </div>
      <div className="overflow-x-auto">
         <table className="w-full min-w-[1240px] text-left text-sm">
            <thead className="bg-purple-950 text-xs uppercase text-purple-300"><tr>
               <th className="px-4 py-3">Ano</th><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Aula</th><th className="px-4 py-3">Nível</th><th className="px-4 py-3">XP Total</th><th className="px-4 py-3">Ingredientes</th><th className="px-4 py-3">Efeito</th><th className="px-4 py-3">Preparo</th><th className="px-4 py-3 text-right">Ações</th>
            </tr></thead>
            <tbody className="divide-y divide-purple-950">
               {potions.map((potion) => <tr key={potion.id} className="hover:bg-[#21002b]">
                  <td className="px-4 py-3">{potion.ano}</td><td className="px-4 py-3 font-semibold">{potion.name}</td><td className="px-4 py-3">{potion.aula || "-"}</td><td className="px-4 py-3">{potion.nivel || "-"}</td><td className="px-4 py-3">{potion.xp_total || "-"}</td><td className="px-4 py-3">{potion.ingredientes_info?.length || 0}</td><td className="max-w-[300px] truncate px-4 py-3 text-purple-200" title={potion.effect}>{potion.effect || "-"}</td><td className="max-w-[300px] truncate px-4 py-3 text-purple-200" title={potion.cooking}>{potion.cooking || "-"}</td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-2">
                     <button type="button" onClick={() => onEditPotion(potion)} className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-white/60 transition hover:bg-yellow-400 hover:text-[#2b0038]" title="Editar poção"><PencilSquareIcon className="h-4 w-4" /></button>
                     <button type="button" onClick={() => onDeletePotion(potion)} disabled={deletingPotionId === potion.id} className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-white/60 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40" title="Excluir poção do Firestore"><TrashIcon className="h-4 w-4" /></button>
                  </div></td>
               </tr>)}
               {!potions.length ? <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-purple-300">Nenhuma poção encontrada para este filtro.</td></tr> : null}
            </tbody>
         </table>
      </div>
   </section>
);
export default PotionsTable;
