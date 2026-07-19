import { CodeBracketIcon, PlusIcon } from "@heroicons/react/24/outline";
import CopyButton from "@/components/CopyButton";
import CustomSelect from "@/components/CustomSelect";
import { effectTypeOptions, locationOptions, sortOptions, typeOptions } from "./constants";
import { getEffectTypeLabel, getLocationLabel, getRarityLabel, getTypeLabel } from "./helpers";

const MagicObjectsFilters = ({ search, locationFilter, typeFilter, effectTypeFilter, sort, setSearch, setLocationFilter, setTypeFilter, setEffectTypeFilter, setSort, objects = [], onOpenFormModal, onOpenJsonModal }) => {
   const getAllObjectsText = () => objects.map((object) => [
      `Nome: ${object.name || ""}`,
      `Tipo: ${getTypeLabel(object.type)}`,
      `Efeito: ${object.effect || ""}`,
      `Tipo de efeito: ${getEffectTypeLabel(object.effect_type)}`,
      `Raridade: ${getRarityLabel(object.rarity)}`,
      `Preço: ${object.price ?? 0}`,
      `Local: ${getLocationLabel(object.location)}`,
      `Dado 1: ${object.dice1 || ""}`,
      `Dado 2: ${object.dice2 || ""}`,
      `Dado 3: ${object.dice3 || ""}`,
      `Duração: ${object.duration || ""}`,
      `Requisito - Ano: ${object.requirements?.year ?? 1}`,
      `Requisito - Habilidade: ${object.requirements?.skill || ""}`,
      `Requisito - Maestria: ${object.requirements?.mastery ?? 0}`,
      `Detalhes: ${object.detalhes || ""}`,
      `Details: ${object.details || ""}`,
   ].join("\n")).join("\n\n---\n\n");

   return (
      <div className="mb-8 space-y-3 text-xs">
         <div className="grid grid-cols-2 gap-3">
            <CustomSelect value={typeFilter} options={typeOptions} onChange={setTypeFilter} placeholder="Tipo" />
            <CustomSelect value={effectTypeFilter} options={effectTypeOptions} onChange={setEffectTypeFilter} placeholder="Tipo de efeito" />
            <CustomSelect value={locationFilter} options={locationOptions} onChange={setLocationFilter} placeholder="Local" />
            <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="A-B" />
         </div>

         <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3">
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Procurar objeto mágico" className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-yellow-400" />
            <CopyButton getText={getAllObjectsText} disabled={!objects.length} title="Copiar objetos mágicos" className="border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-100 hover:bg-yellow-400/20 hover:text-yellow-100" />
            <button type="button" onClick={onOpenJsonModal} className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20" title="Adicionar ou atualizar por JSON">
               <CodeBracketIcon className="h-4 w-4" />
            </button>
            <button type="button" onClick={onOpenFormModal} className="border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-100 transition hover:bg-yellow-400/20" title="Novo objeto mágico">
               <PlusIcon className="h-4 w-4" />
            </button>
         </div>
      </div>
   );
};

export default MagicObjectsFilters;
