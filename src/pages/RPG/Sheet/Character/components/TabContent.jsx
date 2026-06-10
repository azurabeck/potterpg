import AttributeList from "./AttributeList";

const TabContent = ({
   activeTab,
   selectedCharacter,
   attributeEntries,
   editingAttributeName,
   attributeDraftValue,
   savingAttributeName,
   onSelectAttribute,
   onAttributeValueChange,
   onSaveAttribute,
   getAttributeChangedStatus,
}) => {
   const renderEmptyContent = (message) => {
      return (
         <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-purple-200/70">
            {message}
         </div>
      );
   };

   const renderObjectList = (data, emptyMessage) => {
      const entries = Object.entries(data || {});

      if (!entries.length) return renderEmptyContent(emptyMessage);

      return (
         <div className="space-y-3">
            {entries.map(([name, value]) => (
               <div
                  key={name}
                  className="grid cursor-pointer grid-cols-[1fr_84px] items-center gap-4 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-white/10 hover:text-white"
               >
                  <span className="text-[#736868]">{name}</span>

                  <span className="bg-[#9d564c] px-3 py-1 text-center text-xs text-white">
                     {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                  </span>
               </div>
            ))}
         </div>
      );
   };

   const renderInventory = () => {
      const dinheiro = selectedCharacter?.dinheiro;
      const varinha = selectedCharacter?.varinha;

      return (
         <div className="space-y-5 pt-6 text-sm text-[#736868]">
            <div>
               <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-400">
                  Dinheiro
               </p>

               <p>
                  {dinheiro?.galeoes ?? 0} Galeões • {dinheiro?.sicles ?? 0}{" "}
                  Sicles • {dinheiro?.nuques ?? 0} Nuques
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

   if (activeTab === "attributes") {
      return (
         <AttributeList
            entries={attributeEntries}
            editingAttributeName={editingAttributeName}
            attributeDraftValue={attributeDraftValue}
            savingAttributeName={savingAttributeName}
            onSelectAttribute={onSelectAttribute}
            onAttributeValueChange={onAttributeValueChange}
            onSaveAttribute={onSaveAttribute}
            getAttributeChangedStatus={getAttributeChangedStatus}
            renderEmptyContent={renderEmptyContent}
         />
      );
   }

   if (activeTab === "spells") {
      return renderObjectList(
         selectedCharacter?.habilidades,
         "Nenhum feitiço ou habilidade cadastrado."
      );
   }

   if (activeTab === "potions") {
      return renderObjectList(
         selectedCharacter?.pocoes,
         "Nenhuma poção cadastrada."
      );
   }

   if (activeTab === "inventory") return renderInventory();

   if (activeTab === "mysteries") {
      return renderEmptyContent("Mistérios serão vinculados nas próximas sessões.");
   }

   if (activeTab === "sessions") {
      return renderEmptyContent("Sessões da campanha ainda não cadastradas.");
   }

   if (activeTab === "relations") {
      return renderEmptyContent("Relações ainda não cadastradas.");
   }

   return null;
};

export default TabContent;