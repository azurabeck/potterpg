import { useState } from "react";

const CampaignEditModal = ({ campaign, onSave }) => {
   const [jsonValue, setJsonValue] = useState(() =>
      JSON.stringify(
         {
            id: campaign.id,
            userid: campaign.user_id,
            campaign_name: campaign.campaign_name,
            sessions: campaign.sessions || [],
         },
         null,
         2
      )
   );
   const [error, setError] = useState("");

   const handleSave = () => {
      try {
         const parsed = JSON.parse(jsonValue);
         setError("");
         onSave(parsed);
      } catch {
         setError("JSON inválido. Confere vírgulas, aspas e colchetes.");
      }
   };

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <textarea
            value={jsonValue}
            onChange={(event) => setJsonValue(event.target.value)}
            rows={18}
            className="w-full resize-none border border-white/10 bg-white/10 px-3 py-3 font-mono text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
         />

         {error ? <p className="text-red-300">{error}</p> : null}

         <button
            type="button"
            onClick={handleSave}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Salvar campanha
         </button>
      </div>
   );
};

export default CampaignEditModal;
