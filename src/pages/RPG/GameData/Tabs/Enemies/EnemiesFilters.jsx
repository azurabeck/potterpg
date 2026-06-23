import { CodeBracketSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import CopyButton from "@/components/CopyButton";
import CustomSelect from "@/components/CustomSelect";
import { difficultyOptions, enemyTypeOptions, sortOptions } from "./constants";
import { formatDamage } from "./helpers";

const EnemiesFilters = ({
   search,
   typeFilter,
   difficultyFilter,
   sort,
   setSearch,
   setTypeFilter,
   setDifficultyFilter,
   setSort,
   enemies = [],
   onOpenFormModal,
   onOpenBulkJsonModal,
}) => {
   const getAllEnemiesText = () => {
      if (!enemies.length) return "";

      return enemies
         .map((enemy) =>
            [
               `Nome: ${enemy.name || ""}`,
               `Tipo: ${enemy.type || ""}`,
               `HP: ${enemy.hp ?? ""}`,
               `Dificuldade: ${enemy.difficulty || ""}`,
               `Local: ${enemy.local || ""}`,
               `Ataque principal: ${enemy.main_attack?.attribute || ""} +${enemy.main_attack?.attribute_value ?? 0}`,
               `Dano ataque principal: ${formatDamage(enemy.main_attack?.damage)}`,
               `Ataque secundário: ${enemy.secondary_attack?.attribute || ""} +${enemy.secondary_attack?.attribute_value ?? 0}`,
               `Defesa: ${enemy.defense?.attribute || ""} +${enemy.defense?.attribute_value ?? 0}`,
               `Características: ${enemy.caracteristicas || ""}`,
            ].join("\n")
         )
         .join("\n\n---\n\n");
   };

   return (
      <div className="mb-8 space-y-3 text-xs">
         <div className="grid grid-cols-3 gap-3">
            <CustomSelect value={typeFilter} options={enemyTypeOptions} onChange={setTypeFilter} placeholder="Tipo" />
            <CustomSelect value={difficultyFilter} options={difficultyOptions} onChange={setDifficultyFilter} placeholder="Dificuldade" />
            <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="A-B" />
         </div>

         <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3">
            <input
               type="text"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Procurar adversário"
               className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-yellow-400"
            />

            <CopyButton
               getText={getAllEnemiesText}
               disabled={!enemies.length}
               title="Copiar adversários"
               className="border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-100 hover:bg-yellow-400/20 hover:text-yellow-100"
            />

            <button
               type="button"
               onClick={onOpenBulkJsonModal}
               className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20"
               title="Cadastrar adversários por JSON"
            >
               <CodeBracketSquareIcon className="h-4 w-4" />
            </button>

            <button
               type="button"
               onClick={onOpenFormModal}
               className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20"
               title="Novo adversário"
            >
               <PlusIcon className="h-4 w-4" />
            </button>
         </div>
      </div>
   );
};

export default EnemiesFilters;
