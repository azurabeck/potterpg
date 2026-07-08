import { useState } from "react";
import JsonTreeEditor from "./JsonTreeEditor";

const getEditableCampaign = (campaign) => {
   const { created_at, updated_at, ...editableCampaign } = campaign;

   return {
      ...editableCampaign,
      userid: campaign.userid || campaign.user_id || "",
      user_id: campaign.user_id || campaign.userid || "",
      campaign_year: campaign.campaign_year === "" ? "" : Number(campaign.campaign_year || 0),
      year: campaign.year === "" ? "" : Number(campaign.year || 0),
      sessions: Array.isArray(campaign.sessions) ? campaign.sessions : [],
   };
};

const CampaignEditModal = ({ campaign, onSave }) => {
   const initialCampaign = getEditableCampaign(campaign);

   const [editorMode, setEditorMode] = useState("tree");
   const [campaignValue, setCampaignValue] = useState(initialCampaign);
   const [jsonValue, setJsonValue] = useState(() => JSON.stringify(initialCampaign, null, 2));
   const [error, setError] = useState("");

   const openRawMode = () => {
      setJsonValue(JSON.stringify(campaignValue, null, 2));
      setEditorMode("raw");
      setError("");
   };

   const openTreeMode = () => {
      try {
         setCampaignValue(JSON.parse(jsonValue));
         setEditorMode("tree");
         setError("");
      } catch {
         setError("JSON inválido. Corrige o conteúdo antes de voltar ao editor visual.");
      }
   };

   const handleSave = () => {
      try {
         const parsed = editorMode === "raw" ? JSON.parse(jsonValue) : campaignValue;
         setError("");
         onSave(parsed);
      } catch {
         setError("JSON inválido. Confere vírgulas, aspas e colchetes.");
      }
   };

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <div className="flex gap-2">
            <button
               type="button"
               onClick={editorMode === "tree" ? undefined : openTreeMode}
               className={`px-3 py-2 text-xs transition ${
                  editorMode === "tree"
                     ? "bg-yellow-400 font-semibold text-[#2b0038]"
                     : "bg-white/10 text-white hover:bg-white/15"
               }`}
            >
               Editor visual
            </button>

            <button
               type="button"
               onClick={editorMode === "raw" ? undefined : openRawMode}
               className={`px-3 py-2 text-xs transition ${
                  editorMode === "raw"
                     ? "bg-yellow-400 font-semibold text-[#2b0038]"
                     : "bg-white/10 text-white hover:bg-white/15"
               }`}
            >
               JSON bruto
            </button>
         </div>

         {editorMode === "tree" ? (
            <JsonTreeEditor value={campaignValue} onChange={setCampaignValue} />
         ) : (
            <textarea
               value={jsonValue}
               onChange={(event) => setJsonValue(event.target.value)}
               rows={22}
               className="w-full resize-y border border-white/10 bg-white/10 px-3 py-3 font-mono text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400"
            />
         )}

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
