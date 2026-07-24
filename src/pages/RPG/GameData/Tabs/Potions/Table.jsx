import {
   CheckIcon,
   InformationCircleIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { getMasteryByXp } from "../../../../../helpers/mastery";
import { tableColumns } from "./constants";
import { getPotionDisplayName } from "./helpers";

const Table = ({
   filteredAndSortedPotions,
   xpDrafts,
   savingPotionId,
   handleSort,
   renderSortIcon,
   handleXpChange,
   handleSavePotion,
   handleDeletePotion,
}) => (
   <div className="overflow-x-auto md:overflow-visible">
      <div className={`grid ${tableColumns} gap-5 border-b border-white/10 pb-3 text-xs text-purple-100/90`}>
         <button type="button" onClick={() => handleSort("year")} className="p-2 text-left">Ano {renderSortIcon("year")}</button>
         <button type="button" onClick={() => handleSort("name")} className="p-2 text-left">Nome {renderSortIcon("name")}</button>
         <button type="button" onClick={() => handleSort("effect")} className="p-2 text-left">Efeito {renderSortIcon("effect")}</button>
         <div className="p-2">Ingredientes</div>
         <button type="button" onClick={() => handleSort("level")} className="p-2 text-left">Nível {renderSortIcon("level")}</button>
         <button type="button" onClick={() => handleSort("xp")} className="p-2 text-left">XP atual {renderSortIcon("xp")}</button>
         <div className="p-2">Maestria</div>
         <span />
      </div>

      <div className="space-y-1 pt-3">
         {filteredAndSortedPotions.length ? filteredAndSortedPotions.map(({ potion, savedData, ...item }) => {
            const potionId = potion.id;
            const currentXp = savedData?.xp ?? 0;
            const draftXp = xpDrafts[potionId] ?? String(currentXp);
            const hasChanged = Number(draftXp) !== Number(currentXp);
            const mastery = getMasteryByXp(potion.nivel || "", draftXp);

            return (
               <div key={potionId} className={`grid ${tableColumns} min-h-12 items-center gap-5 text-xs text-[#736868] transition hover:bg-white/5`}>
                  <span className="p-2">{potion.ano || "-"}</span>
                  <span className="p-2 text-white/80">{getPotionDisplayName(potion)}</span>
                  <span className="line-clamp-2 p-2" title={item.effect}>{item.effect || "-"}</span>
                  <span className="flex items-center gap-2 p-2" title={item.ingredients}>
                     <span className="line-clamp-1">{item.ingredients || "-"}</span>
                     <InformationCircleIcon className="h-4 w-4 shrink-0" />
                  </span>
                  <span className="p-2">{potion.nivel || "-"}</span>
                  <input
                     type="text"
                     value={draftXp}
                     onChange={(event) => handleXpChange(potionId, event.target.value)}
                     className="w-full bg-[#9d564c] px-3 py-1 text-center text-xs text-white outline-none ring-1 ring-transparent focus:ring-yellow-400"
                  />
                  <span>{mastery.maestria === "-" ? "M0" : mastery.maestria} → {mastery.dado}</span>
                  <div className="flex items-center gap-2">
                     <button
                        type="button"
                        disabled={!hasChanged || savingPotionId === potionId}
                        onClick={() => handleSavePotion(potionId, potion, savedData)}
                        className={`flex h-7 w-7 items-center justify-center rounded transition ${hasChanged && savingPotionId !== potionId ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300" : "bg-white/10 text-white/30"}`}
                     >
                        <CheckIcon className="h-4 w-4" />
                     </button>
                     <button
                        type="button"
                        disabled={savingPotionId === potionId}
                        onClick={() => handleDeletePotion(potionId)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white/40 transition hover:bg-red-500/70 hover:text-white disabled:opacity-40"
                     >
                        <TrashIcon className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            );
         }) : (
            <div className="flex min-h-[180px] items-center justify-center text-sm text-purple-200/70">Nenhuma poção encontrada.</div>
         )}
      </div>
   </div>
);

export default Table;
