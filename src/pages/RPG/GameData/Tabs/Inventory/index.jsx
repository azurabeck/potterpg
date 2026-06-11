const InventoryTab = ({ selectedCharacter }) => {
   const dinheiro = selectedCharacter?.dinheiro;
   const varinha = selectedCharacter?.varinha;

   return (
      <div className="space-y-5 pt-6 text-sm text-[#736868]">
         <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
               Dinheiro
            </p>

            <p>
               {dinheiro?.galeoes ?? 0} Galeões • {dinheiro?.sicles ?? 0} Sicles • {dinheiro?.nuques ?? 0} Nuques
            </p>
         </div>

         <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
               Varinha
            </p>

            <p>Madeira: {varinha?.madeira || "-"}</p>
            <p>Miolo: {varinha?.miolo || "-"}</p>
            <p>Atributo: {varinha?.atributo || "-"}</p>
         </div>

         <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
               Animal
            </p>

            <p>{selectedCharacter?.animal || "-"}</p>
         </div>
      </div>
   );
};

export default InventoryTab;
