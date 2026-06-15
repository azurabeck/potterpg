import { getYearLabel } from "./constants";
import { getSpellDisplayName } from "./helpers";

const SpellsTable = ({ spells, selectedYear }) => {
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
            <table className="w-full min-w-[1100px] text-left text-sm">
               <thead className="bg-purple-950 text-xs uppercase text-purple-300">
                  <tr>
                     <th className="px-4 py-3">Ano</th>
                     <th className="px-4 py-3">Nome</th>
                     <th className="px-4 py-3">Aula</th>
                     <th className="px-4 py-3">Nível</th>
                     <th className="px-4 py-3">Required</th>
                     <th className="px-4 py-3">Maestria Req.</th>
                     <th className="px-4 py-3">XP Total</th>
                     <th className="px-4 py-3">Efeito</th>
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
                           {spell.attributes.aula || "-"}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.nivel || "-"}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.required || 0}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.maestria_required || 0}
                        </td>

                        <td className="px-4 py-3">
                           {spell.attributes.xp_total || "-"}
                        </td>

                        <td className="px-4 py-3 text-purple-200">
                           {spell.attributes.effect || "-"}
                        </td>
                     </tr>
                  ))}

                  {!spells.length && (
                     <tr>
                        <td
                           colSpan={8}
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
