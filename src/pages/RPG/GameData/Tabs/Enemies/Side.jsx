import { getDistanceLabel } from "./helpers";

const InfoLine = ({ label, value }) => {
   if (value === undefined || value === null || value === "") return null;

   return (
      <p>
         <span className="text-[#ceb4aa]">{label}:</span> {value}
      </p>
   );
};

const StatPill = ({ label, value }) => (
   <div className="border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-purple-100/35">{label}</p>
      <p className="mt-1 text-sm font-semibold text-yellow-400">{value}</p>
   </div>
);

const AttackCard = ({ title, attack }) => {
   if (!attack?.attribute && !attack?.effect && !attack?.name) return null;

   return (
      <div className="border border-white/10 bg-white/5 p-4">
         <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">{title}</p>
            {attack.name ? <p className="text-sm font-semibold text-purple-100/80">{attack.name}</p> : null}
         </div>

         <div className="grid gap-2 text-[#736868] md:grid-cols-3">
            <StatPill label="Atributo" value={`${attack.attribute || "-"} +${attack.attribute_value ?? 0}`} />
            <StatPill label="Distância" value={getDistanceLabel(attack.distance)} />
         </div>

         {attack.effect ? (
            <p className="mt-3 leading-5 text-[#736868]">
               <span className="text-[#ceb4aa]">Efeito:</span> {attack.effect}
            </p>
         ) : null}
      </div>
   );
};

const Side = ({ selectedEnemy }) => {
   if (!selectedEnemy) {
      return (
         <aside className="text-xs">
            <div className="flex min-h-[350px] items-center justify-center border border-white/10 bg-white/5 text-center text-purple-100/50">
               Selecione um adversário
            </div>
         </aside>
      );
   }

   return (
      <aside className="grid grid-cols-1 gap-6 text-xs text-purple-100/75 lg:grid-cols-[250px_1fr]">
         <div className="h-[240px] w-full bg-white/5 lg:h-[390px] lg:w-[250px]" style={{ border: "10px solid #5a0d0d" }}>
            {selectedEnemy.image_url ? (
               <img
                  src={selectedEnemy.image_url}
                  alt={selectedEnemy.name || "Adversário"}
                  className="h-[220px] w-full object-cover object-top lg:h-[370px]"
               />
            ) : (
               <div className="flex h-[220px] items-center justify-center text-center text-purple-100/50 lg:h-[350px]">
                  Sem imagem
               </div>
            )}
         </div>

         <div className="space-y-5">
            <div>
               <h3 className="text-lg font-semibold text-yellow-400">
                  {selectedEnemy.name || "Adversário sem nome"}
               </h3>

               <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <StatPill label="Tipo" value={selectedEnemy.type || "-"} />
                  <StatPill label="Dificuldade" value={selectedEnemy.difficulty || "-"} />
                  <StatPill label="HP" value={selectedEnemy.hp || 0} />
                  <StatPill label="Ano" value={selectedEnemy.recommended_year ? `${selectedEnemy.recommended_year}º` : "-"} />
                  <StatPill
                     label="Defesa"
                     value={`${selectedEnemy.defense?.attribute || "-"} +${selectedEnemy.defense?.attribute_value ?? 0}`}
                  />
               </div>

               <div className="mt-4 space-y-1 leading-5 text-[#736868]">
                  <InfoLine label="Local" value={selectedEnemy.local} />
               </div>

               <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <StatPill label="Impacto" value={selectedEnemy.impact_die || "-"} />
               </div>
            </div>

            <div className="space-y-2 leading-5 text-[#736868]">
               <InfoLine label="Características" value={selectedEnemy.caracteristicas} />
            </div>
         </div>

         <div className="col-span-full grid grid-cols-1 gap-4">
            <AttackCard title="Ataque principal" attack={selectedEnemy.main_attack} />
            <AttackCard title="Ataque secundário" attack={selectedEnemy.secondary_attack} />
         </div>
      </aside>
   );
};

export default Side;
