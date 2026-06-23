import { useState } from "react";
import CopyButton from "@/components/CopyButton";

const locationTemplate = `[
   {
      "name": "Casa de Tomas Black",
      "characteristics": "Casa isolada, média, de dois andares, rústica e elegante, cercada por floresta. Possui jardim de inverno, saída lateral, saída aos fundos, riacho próximo e aros de quadribol no terreno.",
      "importance": "Lar da família Black e ponto importante para cenas familiares, descanso e preparação entre aventuras.",
      "access_character_ids": [],
      "image_url": "https://i.pinimg.com/1200x/41/e3/d5/41e3d557e8a53cf93cdf26882bcb7ec7.jpg",
      "type": "Particular"
   }
]`;

const BulkLocationJsonModal = ({ onSubmit }) => {
   const [jsonText, setJsonText] = useState("");

   return (
      <div className="space-y-4 text-xs">
         <div className="flex justify-end">
            <CopyButton
               text={locationTemplate}
               title="Copiar modelo"
               className="border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-100 hover:bg-yellow-400/20 hover:text-yellow-100"
            />
         </div>

         <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder={locationTemplate}
            className="min-h-[360px] w-full resize-none bg-black/30 p-3 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <button
            type="button"
            onClick={() => onSubmit(jsonText)}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Cadastrar locais
         </button>
      </div>
   );
};

export default BulkLocationJsonModal;
