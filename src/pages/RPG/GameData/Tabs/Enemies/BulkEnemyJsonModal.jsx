import { useState } from "react";

const BulkEnemyJsonModal = ({ onCreate, onUpdate }) => {
   const [jsonText, setJsonText] = useState("");

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <div className="space-y-2">
            <p>
               Cole um JSON com um array de adversários ou um objeto com a chave <strong>enemies</strong>.
            </p>

            <p className="text-[11px] text-purple-100/55">
               Use <strong>Cadastrar novos</strong> para criar documentos. Use <strong>Atualizar existentes</strong> para buscar adversários pelo <strong>id</strong> ou pelo <strong>name</strong> e sobrescrever os campos enviados no JSON.
            </p>
         </div>

         <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            rows={14}
            placeholder='[{ "name": "Acromântula Matriarca", "hp": 130, "impact_die": "1D10", "main_attack": { "name": "Presas Cortantes", "attribute": "Ataque", "attribute_value": 38 } }]'
            className="w-full resize-none bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <div className="flex flex-wrap gap-3">
            <button
               type="button"
               onClick={() => onCreate(jsonText)}
               className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
            >
               Cadastrar novos
            </button>

            <button
               type="button"
               onClick={() => onUpdate(jsonText)}
               className="border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-400/20"
            >
               Atualizar existentes
            </button>
         </div>
      </div>
   );
};

export default BulkEnemyJsonModal;
