import { getAccessNames } from "./helpers";

const InfoLine = ({ label, value }) => {
   if (value === undefined || value === null || value === "") return null;

   return (
      <p>
         <span className="text-[#ceb4aa]">{label}:</span> {value}
      </p>
   );
};

const Side = ({ selectedLocation, characters = [] }) => {
   if (!selectedLocation) {
      return (
         <aside className="text-xs">
            <div className="flex min-h-[350px] items-center justify-center border border-white/10 bg-white/5 text-center text-purple-100/50">
               Selecione um local
            </div>
         </aside>
      );
   }

   const bullet = <span className="inline-block h-2 w-2 rounded-full bg-yellow-900" />;

   return (
      <aside className="space-y-6 text-xs text-purple-100/75">
         <div className="h-[220px] w-full bg-white/5" style={{ border: "10px solid #5a0d0d" }}>
            {selectedLocation.image_url ? (
               <img
                  src={selectedLocation.image_url}
                  alt={selectedLocation.name || "Local"}
                  className="h-[200px] w-full object-cover object-center"
               />
            ) : (
               <div className="flex h-[200px] items-center justify-center text-center text-purple-100/50">
                  Sem imagem
               </div>
            )}
         </div>

         <div>
            <h3 className="flex flex-wrap items-baseline text-lg font-semibold text-yellow-400">
               {selectedLocation.name || "Local sem nome"}
               <div className="ml-2 flex items-center gap-3 text-xs text-[#736868]">
                  {bullet}
                  <span>{selectedLocation.type || "-"}</span>
               </div>
            </h3>

            <div className="mt-5 space-y-2 leading-5 text-[#736868]">
               <InfoLine label="Quem tem acesso" value={getAccessNames(selectedLocation, characters)} />
               <InfoLine label="Características" value={selectedLocation.characteristics} />
               <InfoLine label="Importância" value={selectedLocation.importance} />
            </div>
         </div>
      </aside>
   );
};

export default Side;
