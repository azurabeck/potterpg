export const normalizeText = (text = "") =>
   String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const getUserId = (selectedCharacter) =>
   selectedCharacter?.user_id || selectedCharacter?.userId || "";

export const getDefaultCampaignName = (selectedCharacter) =>
   `Campanha de - ${selectedCharacter?.name || "Personagem"}`;

export const normalizeNumberOrEmpty = (value) => {
   if (value === undefined || value === null || value === "") return "";

   const normalizedValue = Number(value);
   return Number.isNaN(normalizedValue) ? "" : normalizedValue;
};

export const getCampaignYear = (campaign) =>
   campaign?.campaign_year ?? campaign?.campaignYear ?? campaign?.ano_campanha ?? "";

export const getTimelineYear = (campaign) =>
   campaign?.year ?? campaign?.ano ?? "";

export const normalizeSessions = (sessions = []) =>
   sessions.map((session, index) => ({
      ...session,
      order: Number(session.order || index + 1),
      date: session.date || "",
      event: session.event || "",
      local: session.local || "",
      characters: Array.isArray(session.characters) ? session.characters : [],
   }));

export const normalizeCampaign = (docSnap) => {
   const data = docSnap.data();

   return {
      ...data,
      id: docSnap.id,
      order: Number(data.order || 0),
      user_id: data.user_id || data.userid || "",
      character_id: data.character_id || "",
      campaign_name: data.campaign_name || data.campaing_name || "Campanha sem nome",
      campaign_year: normalizeNumberOrEmpty(getCampaignYear(data)),
      year: normalizeNumberOrEmpty(getTimelineYear(data)),
      sessions: normalizeSessions(Array.isArray(data.sessions) ? data.sessions : []),
      created_at: data.created_at || null,
      updated_at: data.updated_at || null,
   };
};

export const parseCampaignJson = (value) => {
   const parsed = JSON.parse(value);
   const sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [parsed.sessions].filter(Boolean);

   return {
      ...parsed,
      id: parsed.id || "",
      order: Number(parsed.order || 0),
      user_id: parsed.user_id || parsed.userid || "",
      character_id: parsed.character_id || "",
      campaign_name: parsed.campaign_name || parsed.campaing_name || "",
      campaign_year: normalizeNumberOrEmpty(getCampaignYear(parsed)),
      year: normalizeNumberOrEmpty(getTimelineYear(parsed)),
      sessions: normalizeSessions(sessions),
   };
};

export const getCampaignYearOptions = (campaigns = []) => {
   const years = campaigns
      .map((campaign) => getCampaignYear(campaign))
      .filter((year) => year !== undefined && year !== null && year !== "")
      .map((year) => Number(year))
      .filter((year) => !Number.isNaN(year));

   return ["Todos", ...Array.from(new Set(years)).sort((a, b) => a - b).map(String)];
};

export const filterCampaigns = ({ campaigns, search, campaignYearFilter }) => {
   const normalizedSearch = normalizeText(search);

   return campaigns.filter((campaign) => {
      const searchableText = normalizeText([
         campaign.campaign_name,
         getCampaignYear(campaign),
         getTimelineYear(campaign),
         campaign.sessions.map((session) =>
            `${session.event} ${session.description || ""} ${session.details || ""} ${session.local} ${(session.characters || []).join(" ")}`
         ).join(" "),
      ].join(" "));

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCampaignYear =
         !campaignYearFilter ||
         campaignYearFilter === "Todos" ||
         String(getCampaignYear(campaign)) === String(campaignYearFilter);

      return matchesSearch && matchesCampaignYear;
   });
};

export const sortCampaigns = ({ campaigns, sort }) =>
   [...campaigns].sort((a, b) => {
      if (sort === "number-desc") return Number(b.order) - Number(a.order);
      return Number(a.order) - Number(b.order);
   });

export const getFilteredAndSortedCampaigns = ({ campaigns, search, sort, campaignYearFilter }) =>
   sortCampaigns({ campaigns: filterCampaigns({ campaigns, search, campaignYearFilter }), sort });

export const buildCampaignPayload = ({ parsedCampaign, selectedCharacter }) => ({
   ...parsedCampaign,
   order: parsedCampaign.order || 0,
   user_id: parsedCampaign.user_id || getUserId(selectedCharacter),
   character_id: selectedCharacter?.id || parsedCampaign.character_id || "",
   campaign_name: parsedCampaign.campaign_name || getDefaultCampaignName(selectedCharacter),
   campaign_year: normalizeNumberOrEmpty(getCampaignYear(parsedCampaign)),
   year: normalizeNumberOrEmpty(getTimelineYear(parsedCampaign)),
   sessions: normalizeSessions(parsedCampaign.sessions || []),
});

export const appendSessionsToCampaign = ({ campaign, parsedCampaign, selectedCharacter }) => ({
   ...campaign,
   ...parsedCampaign,
   id: campaign?.id || parsedCampaign.id,
   order: campaign?.order || parsedCampaign.order || 0,
   user_id: campaign?.user_id || parsedCampaign.user_id || getUserId(selectedCharacter),
   character_id: campaign?.character_id || selectedCharacter?.id || "",
   campaign_name: campaign?.campaign_name || parsedCampaign.campaign_name || getDefaultCampaignName(selectedCharacter),
   campaign_year: normalizeNumberOrEmpty(getCampaignYear(parsedCampaign) || getCampaignYear(campaign)),
   year: normalizeNumberOrEmpty(getTimelineYear(parsedCampaign) || getTimelineYear(campaign)),
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

export const formatCampaignForCopy = (campaign) => {
   const orderedSessions = [...(campaign.sessions || [])].sort(
      (a, b) => Number(b.order || 0) - Number(a.order || 0)
   );

   return [
      `## Campanha ${campaign.order} - ${campaign.campaign_name}`,
      `Ano da campanha: ${getCampaignYear(campaign) || "-"}`,
      `Ano cronológico: ${getTimelineYear(campaign) || "-"}`,
      "",
      ...orderedSessions.map((session) => {
         const characters = Array.isArray(session.characters) ? session.characters.join(", ") : "";

         return [
            `${String(session.order).padStart(2, "0")}. ${session.event}`,
            session.description ? `Descrição: ${session.description}` : "",
            session.details ? `Detalhes: ${session.details}` : "",
            `Local: ${session.local || "-"}`,
            `Personagens: ${characters || "-"}`,
         ].filter(Boolean).join("\n");
      }),
   ].join("\n\n");
};

export const getCampaignsCopyText = (campaigns = []) =>
   [...campaigns]
      .sort((a, b) => Number(b.order || 0) - Number(a.order || 0))
      .map(formatCampaignForCopy)
      .join("\n\n====================================\n\n");
