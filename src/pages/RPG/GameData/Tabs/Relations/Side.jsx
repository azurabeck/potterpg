import { attributeLabels } from "./constants";
import { getMainAttributes } from "./helpers";

const InfoLine = ({ label, value }) => {
   if (value === undefined || value === null || value === "") return null;

   return (
      <p>
         <span className="text-[#ceb4aa]">{label}:</span> {value}
      </p>
   );
};

const Side = ({ selectedRelation }) => {
   const mainAttributes = getMainAttributes(selectedRelation?.atributos);

   if (!selectedRelation) {
      return (
         <aside className="text-xs">
            <div className="flex min-h-[350px] items-center justify-center border border-white/10 bg-white/5 text-center text-purple-100/50">
               Selecione um personagem
            </div>
         </aside>
      );
   }

const bullet = (
   <span className="inline-block h-2 w-2 rounded-full bg-yellow-900" />
);

   return (
      <aside className="grid grid-cols-[250px_1fr] gap-6 text-xs text-purple-100/75">
         <div className="w-[250px] h-[390px] bg-white/5" style={{ border: "10px solid #5a0d0d" }}>
            {selectedRelation.image_url ? (
               <img
                  src={selectedRelation.image_url}
                  alt={selectedRelation.name || "NPC"}
                  className="h-[370px] w-full object-cover"
               />
            ) : (
               <div className="flex h-[350px] items-center justify-center text-center text-purple-100/50">
                  Sem imagem
               </div>
            )}
         </div>

         <div className="space-y-5">
            <div>
               <h3 className="flex items-baseline text-lg font-semibold text-yellow-400">
                  {selectedRelation.name || "NPC sem nome"}
                  <div className="flex items-center text-xs ml-2 gap-3 text-[#736868]">
                     {bullet}
                     <span>{selectedRelation.tipo}</span>
                     -
                     <span>{selectedRelation.house || selectedRelation.casa}</span>
                     -
                     <span>{selectedRelation.ano || "-"}</span>
                  </div>
               </h3>



               <div className="mt-5 mb-2 space-y-1 leading-5 text-[#736868]">
                  <InfoLine label="Amizade" value={selectedRelation.amizade ?? 0} />
                  <InfoLine label="Confiança" value={selectedRelation.confianca ?? 0} />
                  <InfoLine label="Principais atributos" value={mainAttributes} />
               </div>
            </div>

            <div className="space-y-2 leading-5 text-[#736868]">
               <InfoLine label="Características" value={selectedRelation.caracteristicas} />
               <InfoLine label="Personalidade" value={selectedRelation.personalidade} />
               <InfoLine label="Detalhes" value={selectedRelation.detalhes} />
            </div>
         </div>

         <div className="col-span-full mt-2">
            <p className="mb-2 text-[12px] uppercase text-[#ceb4aa]">
               Atributos
            </p>

            <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-[12px] leading-4 text-[#736868]">
               {attributeLabels.map((attribute) => (
                  <p key={attribute} className="flex items-center justify-between">
                     <span className="text-yellow-500">*{attribute}</span> 
                     <span className="border border-dashed w-100 mx-2"></span>
                     <span className="font-bold text-yellow-700">
                        {selectedRelation.atributos?.[attribute] ?? 0}
                     </span>
                  </p>
               ))}
            </div>
         </div>
      </aside>
   );
};

export default Side;