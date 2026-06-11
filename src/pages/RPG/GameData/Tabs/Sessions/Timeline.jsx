import {
   ChevronDownIcon,
   ChevronUpIcon,
   PencilSquareIcon,
} from "@heroicons/react/24/outline";

const Timeline = ({
   campaigns,
   expandedCampaignId,
   setExpandedCampaignId,
   onEditCampaign,
}) => {
   if (!campaigns.length) {
      return (
         <div className="flex min-h-[240px] items-center justify-center text-sm text-purple-200/70">
            Nenhuma campanha encontrada.
         </div>
      );
   }

   return (
      <div className="relative min-h-[330px] pr-10 text-xs border-e border-dashed border-white/25">

         <div className="space-y-8">
            {campaigns.map((campaign) => {
               const isOpen = expandedCampaignId === campaign.id;

               return (
                  <section key={campaign.id}>
                     <div className="grid grid-cols-[minmax(120px,auto)_1fr_24px_20px] items-center gap-3">
                        <button
                           type="button"
                           onClick={() => setExpandedCampaignId(isOpen ? "" : campaign.id)}
                           className="text-left text-yellow-400 transition hover:text-yellow-300"
                        >
                           {campaign.campaign_name}
                        </button>

                        <div className="border-t border-dashed border-white/15" />

                        <button
                           type="button"
                           onClick={() => onEditCampaign(campaign)}
                           className="text-yellow-400/80 transition hover:text-yellow-300"
                           title="Editar JSON da campanha"
                        >
                           <PencilSquareIcon className="h-4 w-4" />
                        </button>

                        <button
                           type="button"
                           onClick={() => setExpandedCampaignId(isOpen ? "" : campaign.id)}
                           className="text-yellow-400/80 transition hover:text-yellow-300"
                           title={isOpen ? "Recolher" : "Expandir"}
                        >
                           {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                        </button>
                     </div>

                     {isOpen ? (
                        <div className="mt-4 space-y-3 pl-8 text-purple-100/80">
                           {campaign.sessions?.length ? (
                              campaign.sessions.map((session, index) => (
                                 <button
                                    key={`${campaign.id}-${index}`}
                                    type="button"
                                    className="block text-left leading-5 transition hover:text-yellow-400"
                                    title={(session.characters || []).join(", ")}
                                 >
                                    Nome - {session.event || "O que aconteceu"} - {session.local || "local"} - {(session.characters || []).join(", ") || "quem estava presente"}
                                 </button>
                              ))
                           ) : (
                              <p className="text-purple-200/50">Nenhuma sessão registrada.</p>
                           )}
                        </div>
                     ) : null}
                  </section>
               );
            })}
         </div>
      </div>
   );
};

export default Timeline;
