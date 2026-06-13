import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const npcTemplate = `[
   {
      "name": "Bethany Grey",
      "tipo": "Aluno",
      "casa": "Corvinal",
      "ano": 1,
      "relacao": "Mistério",

      "amizade": 0,
      "confianca": 0,

      "caracteristicas": "Muito bonita, cabelos dourados, olhos violetas.",
      "personalidade": "Gentil, inteligente e observadora.",
      "detalhes": "Irmã gêmea de Owen Grey.",

      "image_url": "",

      "atributos": {
         "Agilidade": 2,
         "Aprendizado Mágico": 10,
         "Astucia": 3,
         "Ataque": 3,
         "Carisma": 8,
         "Controle": 7,
         "Coragem": 5,
         "Equilibrio": 8,
         "Inteligência": 10,
         "Liderança": 4,
         "Magia": 5,
         "Magia Antiga": 4,
         "Percepção": 10,
         "Persuasão": 7,
         "Precisão": 2,
         "Proteção": 3,
         "Resistência": 2,
         "Sorte": 4
      },

      "habilidades": {},

      "pocoes": {}
   }
]`;

const BulkNpcJsonModal = ({ onSubmit }) => {
   const [jsonText, setJsonText] = useState("");

   const copyTemplate = async () => {
      await navigator.clipboard.writeText(npcTemplate);
   };

   return (
      <div className="space-y-4 text-xs">
         <div className="flex justify-end">
            <button
               type="button"
               onClick={copyTemplate}
               className="flex items-center gap-2 border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-100 transition hover:bg-yellow-400/20"
            >
               <ClipboardDocumentIcon className="h-4 w-4" />
               Copiar Modelo
            </button>
         </div>

         <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder={npcTemplate}
            className="min-h-[360px] w-full resize-none bg-black/30 p-3 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <button
            type="button"
            onClick={() => onSubmit(jsonText)}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Cadastrar NPCs
         </button>
      </div>
   );
};

export default BulkNpcJsonModal;