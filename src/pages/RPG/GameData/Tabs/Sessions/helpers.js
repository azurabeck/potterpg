export const normalizeText = (text = "") =>
   String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const getUserId = (selectedCharacter) =>
   selectedCharacter?.user_id || selectedCharacter?.userId || "";

export const getDefaultCampaignName = (selectedCharacter) =>
   `Campanha de - ${selectedCharacter?.name || "Personagem"}`;

export const normalizeSessions = (sessions = []) =>
   sessions.map((session, index) => ({
      order: Number(session.order || index + 1),
      date: session.date || "",
      event: session.event || "",
      local: session.local || "",
      characters: Array.isArray(session.characters) ? session.characters : [],
   }));

export const normalizeCampaign = (docSnap) => {
   const data = docSnap.data();

   return {
      id: docSnap.id,
      order: Number(data.order || 0),
      user_id: data.user_id || data.userid || "",
      character_id: data.character_id || "",
      campaign_name: data.campaign_name || data.campaing_name || "Campanha sem nome",
      sessions: normalizeSessions(Array.isArray(data.sessions) ? data.sessions : []),
      created_at: data.created_at || null,
      updated_at: data.updated_at || null,
   };
};

export const parseCampaignJson = (value) => {
   const parsed = JSON.parse(value);
   const sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [parsed.sessions].filter(Boolean);

   return {
      id: parsed.id || "",
      order: Number(parsed.order || 0),
      user_id: parsed.user_id || parsed.userid || "",
      character_id: parsed.character_id || "",
      campaign_name: parsed.campaign_name || parsed.campaing_name || "",
      sessions: normalizeSessions(sessions),
   };
};

export const filterCampaigns = ({ campaigns, search }) => {
   const normalizedSearch = normalizeText(search);
   if (!normalizedSearch) return campaigns;

   return campaigns.filter((campaign) => {
      const searchableText = normalizeText([
         campaign.campaign_name,
         campaign.sessions.map((session) => `${session.event} ${session.local} ${(session.characters || []).join(" ")}`).join(" "),
      ].join(" "));

      return searchableText.includes(normalizedSearch);
   });
};

export const sortCampaigns = ({ campaigns, sort }) =>
   [...campaigns].sort((a, b) => {
      if (sort === "number-desc") return Number(b.order) - Number(a.order);
      return Number(a.order) - Number(b.order);
   });

export const getFilteredAndSortedCampaigns = ({ campaigns, search, sort }) =>
   sortCampaigns({ campaigns: filterCampaigns({ campaigns, search }), sort });

export const buildCampaignPayload = ({ parsedCampaign, selectedCharacter }) => ({
   order: parsedCampaign.order || 0,
   user_id: parsedCampaign.user_id || getUserId(selectedCharacter),
   character_id: selectedCharacter?.id || parsedCampaign.character_id || "",
   campaign_name: parsedCampaign.campaign_name || getDefaultCampaignName(selectedCharacter),
   sessions: normalizeSessions(parsedCampaign.sessions || []),
});

export const appendSessionsToCampaign = ({ campaign, parsedCampaign, selectedCharacter }) => ({
   order: campaign?.order || parsedCampaign.order || 0,
   user_id: campaign?.user_id || parsedCampaign.user_id || getUserId(selectedCharacter),
   character_id: campaign?.character_id || selectedCharacter?.id || "",
   campaign_name: campaign?.campaign_name || parsedCampaign.campaign_name || getDefaultCampaignName(selectedCharacter),
   sessions: normalizeSessions([...(campaign?.sessions || []), ...(parsedCampaign.sessions || [])]),
});

export const findCampaignTarget = ({ campaigns, parsedCampaign }) => {
   if (parsedCampaign.id) {
      const byId = campaigns.find((campaign) => campaign.id === parsedCampaign.id);
      if (byId) return byId;
   }

   if (parsedCampaign.order) {
      const byOrder = campaigns.find((campaign) => Number(campaign.order) === Number(parsedCampaign.order));
      if (byOrder) return byOrder;
   }

   return campaigns.find((campaign) => normalizeText(campaign.campaign_name) === normalizeText(parsedCampaign.campaign_name));
};