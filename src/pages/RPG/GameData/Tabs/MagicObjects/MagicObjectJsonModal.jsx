import { useState } from "react";
import { emptyMagicObject } from "./constants";

const inputClass = "w-full border border-white/10 bg-[#17051f] px-3 py-3 font-mono text-xs leading-5 text-white outline-none placeholder:text-white/30 focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40";

const jsonExample = JSON.stringify({
   id: "",
   ...emptyMagicObject,
}, null, 2);

const MagicObjectJsonModal = ({ onSubmit }) => {
   const [jsonValue, setJsonValue] = useState(jsonExample);
   const [error, setError] = useState("");
   const [isSaving, setIsSaving] = useState(false);

   const handleSubmit = async () => {
      setError("");

      let parsedObject;
      try {
         parsedObject = JSON.parse(jsonValue);
      } catch (parseError) {
         setError(`JSON inválido: ${parseError.message}`);
         return;
      }

      if (!parsedObject || Array.isArray(parsedObject) || typeof parsedObject !== "object") {
         setError("O JSON precisa ser um objeto.");
         return;
      }

      if (!String(parsedObject.name || "").trim()) {
         setError("O campo name é obrigatório.");
         return;
      }

      setIsSaving(true);
      try {
         await onSubmit(parsedObject);
      } catch (saveError) {
         setError(saveError?.message || "Não foi possível salvar o objeto.");
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <div className="border border-yellow-400/20 bg-yellow-400/5 p-3 leading-5 text-yellow-100/80">
            Informe um <strong>id</strong> para atualizar ou criar usando esse ID. Sem <strong>id</strong>, um novo documento será criado automaticamente.
         </div>

         <div>
            <label className="mb-2 block text-xs text-purple-100/70">Objeto em JSON</label>
            <textarea
               value={jsonValue}
               onChange={(event) => setJsonValue(event.target.value)}
               rows={24}
               spellCheck={false}
               className={`${inputClass} resize-y`}
            />
         </div>

         {error ? <div className="border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-200">{error}</div> : null}

         <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
         >
            {isSaving ? "Salvando..." : "Adicionar ou atualizar"}
         </button>
      </div>
   );
};

export default MagicObjectJsonModal;
