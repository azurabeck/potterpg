import { useEffect, useState } from "react";
import { getSpellCardImage, getSpellName } from "./helpers";

const CardImageModal = ({ spell, savedData, saving, onSave }) => {
   const [imageUrl, setImageUrl] = useState("");

   useEffect(() => {
      if (!spell) return;
      setImageUrl(getSpellCardImage({ spell, isKnown: true }) || "");
   }, [spell, savedData]);

   if (!spell) return null;

   return (
      <div className="space-y-5 text-sm text-purple-100/80">
         <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-yellow-400/80">
               Carta do álbum
            </p>
            <h3 className="mt-1 text-lg text-white">{getSpellName(spell)}</h3>
            <p className="mt-2 text-xs leading-5 text-purple-100/60">
               Cole aqui a URL da imagem da carta. Ela será salva diretamente no documento do feitiço na collection spells.
            </p>
         </div>

         <input
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://..."
            className="h-10 w-full border border-white/10 bg-white/10 px-3 text-xs text-white outline-none placeholder:text-white/30 focus:border-yellow-400/60"
         />

         <div className="overflow-hidden border border-white/10 bg-black/20">
            {imageUrl ? (
               <img
                  src={imageUrl}
                  alt={getSpellName(spell)}
                  className="mx-auto max-h-[420px] object-contain"
               />
            ) : (
               <div className="flex h-56 items-center justify-center text-xs text-white/35">
                  Prévia da carta
               </div>
            )}
         </div>

         <div className="flex justify-end gap-2">
            <button
               type="button"
               disabled={saving}
               onClick={() => onSave(spell.id, imageUrl.trim())}
               className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
               Salvar imagem
            </button>
         </div>
      </div>
   );
};

export default CardImageModal;
