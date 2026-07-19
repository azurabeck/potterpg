import { getEffectTypeLabel, getLocationLabel, getRarityLabel, getTypeLabel } from "./helpers";

const InfoLine = ({ label, value }) => {
   if (value === undefined || value === null || value === "") return null;
   return <p><span className="text-[#ceb4aa]">{label}:</span> {value}</p>;
};

const StatPill = ({ label, value }) => (
   <div className="border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-purple-100/35">{label}</p>
      <p className="mt-1 text-sm font-semibold text-yellow-400">{value || "-"}</p>
   </div>
);

const Side = ({ selectedObject }) => {
   if (!selectedObject) return <aside className="text-xs"><div className="flex min-h-[350px] items-center justify-center border border-white/10 bg-white/5 text-center text-purple-100/50">Selecione um objeto mágico</div></aside>;

   return (
      <aside className="grid grid-cols-1 gap-6 text-xs text-purple-100/75 lg:grid-cols-[250px_1fr]">
         <div className="h-[240px] w-full bg-white/5 lg:h-[390px] lg:w-[250px]" style={{ border: "10px solid #5a0d0d" }}>
            {selectedObject.img_url ? <img src={selectedObject.img_url} alt={selectedObject.name || "Objeto mágico"} className="h-[220px] w-full object-cover object-top lg:h-[370px]" /> : <div className="flex h-[220px] items-center justify-center text-center text-purple-100/50 lg:h-[350px]">Sem imagem</div>}
         </div>

         <div className="space-y-5">
            <div>
               <h3 className="text-lg font-semibold text-yellow-400">{selectedObject.name || "Objeto sem nome"}</h3>
               <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                  <StatPill label="Tipo" value={getTypeLabel(selectedObject.type)} />
                  <StatPill label="Tipo de efeito" value={getEffectTypeLabel(selectedObject.effect_type)} />
                  <StatPill label="Raridade" value={getRarityLabel(selectedObject.rarity)} />
                  <StatPill label="Local" value={getLocationLabel(selectedObject.location)} />
                  <StatPill label="Preço" value={selectedObject.price ?? 0} />
                  <StatPill label="Duração" value={selectedObject.duration} />
                  <StatPill label="Dado 1" value={selectedObject.dice1} />
                  <StatPill label="Dado 2" value={selectedObject.dice2} />
                  <StatPill label="Dado 3" value={selectedObject.dice3} />
               </div>
            </div>

            <div className="space-y-3 leading-5 text-[#736868]">
               <InfoLine label="Efeito" value={selectedObject.effect} />
               <InfoLine label="Ano necessário" value={selectedObject.requirements?.year} />
               <InfoLine label="Habilidade necessária" value={selectedObject.requirements?.skill} />
               <InfoLine label="Maestria necessária" value={selectedObject.requirements?.mastery} />
               <InfoLine label="Detalhes" value={selectedObject.detalhes} />
               <InfoLine label="Details" value={selectedObject.details} />
            </div>
         </div>
      </aside>
   );
};

export default Side;
