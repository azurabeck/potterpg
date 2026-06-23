import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { getYearLabel } from "./constants";
import { getSpellDisplayName } from "./helpers";

const SpellsTable = ({ spells, selectedYear, onEditSpell }) => {
   return (
      <section className="overflow-hidden rounded-xl border border-purple-900 bg-[#190020]">
         <div className="border-b border-purple-900 bg-[#21002b] p-4">
            <h2 className="text-sm font-semibold">
               Lista geral de feitiços
            </h2>

            <p className="mt-1 text-xs text-purple-300">
               Filtrando por: {getYearLabel(selectedYear)}
            </p>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left text-sm">
               <thead className="bg-purple-950 text-xs uppercase text-purple-300">
                  <tr>
                     <th className="px-4 py-3">Ano</th>
                     <th className="px-4 py-3">Nome</th>
                     <th className="px-4 py-3">Categoria</th>
                     <th className="px-4 py-3">Aula</th>
                     <th className="px-4 py-3">Nível</th>
                     <th className="px-4 py-3">Dice</th>
                     <th className="px-4 py-3">XP Total</th>
                     <th className="px-4 py-3">Efeito</th>
                     <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
               </thead>

               <tbody className="divide-y divide-purple-950">
                  {spells.map((spell) => (
                     <tr key={spell.id} className="hover:bg-[#21002b]">
                        <td className="px-4 py-3">
                           {spell.attributes.ano_letivo}
                        </td>

                        <td className="px-4 py-3 font-semibold">
                           {getSpellDisplayName(spell)}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.category || "-"}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.aula || "-"}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.nivel || "-"}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.effect_dice || "-"}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.xp_total || "-"}
                        </td>

                        <td className="max-w-[360px] truncate px-4 py-3 text-purple-200">
                           {spell.attributes.effect || "-"}
                        </td>

                        <td className="px-4 py-3">
                           <div className="flex justify-end">
                              <button
                                 type="button"
                                 onClick={() => onEditSpell(spell)}
                                 className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-white/60 transition hover:bg-yellow-400 hover:text-[#2b0038]"
                              >
                                 <PencilSquareIcon className="h-4 w-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}

                  {!spells.length && (
                     <tr>
                        <td
                           colSpan={9}
                           className="px-4 py-10 text-center text-sm text-purple-300"
                        >
                           Nenhum feitiço encontrado para este filtro.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>
   );
};

export default SpellsTable;
