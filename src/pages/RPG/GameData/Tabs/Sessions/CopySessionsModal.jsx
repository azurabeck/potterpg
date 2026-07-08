import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { getCampaignYear, getCampaignYearOptions, getCampaignsCopyText } from "./helpers";

const CopySessionsModal = ({ campaigns = [] }) => {
   const campaignYears = useMemo(
      () => getCampaignYearOptions(campaigns).filter((year) => year !== "Todos"),
      [campaigns]
   );
   const [selectedYears, setSelectedYears] = useState(campaignYears);

   const toggleYear = (year) => {
      setSelectedYears((current) =>
         current.includes(year) ? current.filter((item) => item !== year) : [...current, year]
      );
   };

   const getSelectedCampaignsText = () => {
      const selectedCampaigns = campaigns.filter((campaign) =>
         selectedYears.includes(String(getCampaignYear(campaign)))
      );

      return getCampaignsCopyText(selectedCampaigns);
   };

   if (!campaignYears.length) {
      return <p className="text-sm text-white/50">Nenhum ano de campanha encontrado nas sessões.</p>;
   }

   return (
      <div className="space-y-5">
         <p className="text-sm text-white/60">Escolha quais anos de campanha entram na cópia.</p>

         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {campaignYears.map((year) => (
               <label
                  key={year}
                  className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
               >
                  <input
                     type="checkbox"
                     checked={selectedYears.includes(year)}
                     onChange={() => toggleYear(year)}
                     className="h-4 w-4 accent-yellow-400"
                  />
                  Ano {year}
               </label>
            ))}
         </div>

         <div className="flex justify-end">
            <CopyButton
               getText={getSelectedCampaignsText}
               disabled={!selectedYears.length}
               title="Copiar sessões selecionadas"
               className="border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-yellow-100 hover:bg-yellow-400/20 hover:text-yellow-100"
            />
         </div>
      </div>
   );
};

export default CopySessionsModal;
