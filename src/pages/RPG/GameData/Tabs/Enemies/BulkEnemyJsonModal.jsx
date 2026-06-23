import { useState } from "react";

const BulkEnemyJsonModal = ({ onSubmit }) => {
   const [jsonText, setJsonText] = useState("");

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <p>
            Cole um JSON com um array de adversários ou um objeto com a chave <strong>enemies</strong>.
         </p>

         <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            rows={14}
            placeholder='[{ "name": "Acromântula Matriarca", "hp": 130, "main_attack": { "name": "Presas Cortantes", "damage": { "partial": "1D4", "normal": "1D6", "strong": "1D8", "critical": "1D10" } } }]'
            className="w-full resize-none bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         <button
            type="button"
            onClick={() => onSubmit(jsonText)}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Cadastrar adversários
         </button>
      </div>
   );
};

export default BulkEnemyJsonModal;
