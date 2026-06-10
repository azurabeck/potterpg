import { CheckIcon } from "@heroicons/react/24/solid";

const AttributeList = ({
   entries,
   editingAttributeName,
   attributeDraftValue,
   savingAttributeName,
   onSelectAttribute,
   onAttributeValueChange,
   onSaveAttribute,
   getAttributeChangedStatus,
   renderEmptyContent,
}) => {
   if (!entries.length) {
      return renderEmptyContent("Nenhum atributo cadastrado.");
   }

   return (
      <div className="space-y-3">
         {entries.map(([name, value]) => {
            const isEditing = editingAttributeName === name;
            const hasChanged = getAttributeChangedStatus(name, value);
            const isSaving = savingAttributeName === name;

            return (
               <div
                  key={name}
                  onClick={() => onSelectAttribute(name, value)}
                  className="group grid cursor-pointer grid-cols-[1fr_84px_36px] items-center gap-4 rounded-md p-2 text-sm text-[#736868] transition-all duration-200 hover:bg-white/60 hover:text-[#2b0038]"
               >
                  <span>{name}</span>

                  {isEditing ? (
                     <input
                        type="text"
                        value={attributeDraftValue}
                        onClick={(event) => event.stopPropagation()}
                        onChange={onAttributeValueChange}
                        className="w-full bg-[#603467] px-3 py-1 text-center text-xs text-white outline-none ring-1 ring-white/20 focus:ring-yellow-400"
                     />
                  ) : (
                     <span className="bg-[#603467] px-3 py-1 text-center text-xs text-white">
                        {value}
                     </span>
                  )}

                  {isEditing ? (
                     <button
                        type="button"
                        disabled={!hasChanged || isSaving}
                        onClick={(event) => {
                           event.stopPropagation();
                           onSaveAttribute(name, value);
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded transition ${
                           hasChanged && !isSaving
                              ? "bg-yellow-400 text-[#2b0038] hover:bg-yellow-300"
                              : "bg-white/10 text-white/30"
                        }`}
                        title="Salvar atributo"
                     >
                        <CheckIcon className="h-4 w-4" />
                     </button>
                  ) : (
                     <div className="h-7 w-7" />
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default AttributeList;