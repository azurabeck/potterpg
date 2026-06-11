import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const emptyIngredient = {
   name: "",
   drop: "",
   shop: "",
   value: "",
};

const IngredientsInfoModal = ({
   ingredientsInfo,
   setIngredientsInfo,
}) => {
   const handleChange = (index, key, value) => {
      setIngredientsInfo((current) =>
         current.map((ingredient, currentIndex) =>
            currentIndex === index
               ? { ...ingredient, [key]: value }
               : ingredient
         )
      );
   };

   const handleAdd = () => {
      setIngredientsInfo((current) => [...current, emptyIngredient]);
   };

   const handleRemove = (index) => {
      setIngredientsInfo((current) =>
         current.filter((_, currentIndex) => currentIndex !== index)
      );
   };

   return (
      <div className="space-y-5">
         {ingredientsInfo.map((ingredient, index) => (
            <div
               key={index}
               className="space-y-3 border border-white/10 bg-white/5 p-4"
            >
               <input
                  type="text"
                  value={ingredient.name}
                  onChange={(event) =>
                     handleChange(index, "name", event.target.value)
                  }
                  placeholder="Nome do ingrediente"
                  className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
               />

               <input
                  type="text"
                  value={ingredient.drop}
                  onChange={(event) =>
                     handleChange(index, "drop", event.target.value)
                  }
                  placeholder="Onde dropar"
                  className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
               />

               <input
                  type="text"
                  value={ingredient.shop}
                  onChange={(event) =>
                     handleChange(index, "shop", event.target.value)
                  }
                  placeholder="Loja"
                  className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
               />

               <input
                  type="text"
                  value={ingredient.value}
                  onChange={(event) =>
                     handleChange(index, "value", event.target.value)
                  }
                  placeholder="Valor"
                  className="w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
               />

               <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex items-center gap-2 text-xs text-red-300 transition hover:text-red-200"
               >
                  <TrashIcon className="h-4 w-4" />
                  Remover ingrediente
               </button>
            </div>
         ))}

         <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            <PlusIcon className="h-4 w-4" />
            Adicionar ingrediente
         </button>
      </div>
   );
};

export default IngredientsInfoModal;