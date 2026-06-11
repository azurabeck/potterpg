import { useEffect, useMemo, useState } from "react";
import {
   addDoc,
   arrayUnion,
   collection,
   doc,
   getDocs,
   query,
   serverTimestamp,
   updateDoc,
   where,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import CampaignEditModal from "./CampaignEditModal";
import ModelModal from "./ModelModal";
import Side from "./Side";
import Timeline from "./Timeline";
import {
   appendSessionsToCampaign,
   buildCampaignPayload,
   findCampaignTarget,
   getDefaultCampaignName,
   getFilteredAndSortedCampaigns,
   getUserId,
   normalizeCampaign,
   parseCampaignJson,
} from "./helpers";

const SessionsTab = ({ selectedCharacter, setCharacters }) => {
   const [campaigns, setCampaigns] = useState([]);
   const [expandedCampaignId, setExpandedCampaignId] = useState("");
   const [search, setSearch] = useState("");
   const [sort, setSort] = useState("number-asc");
   const [jsonValue, setJsonValue] = useState("");
   const [error, setError] = useState("");
   const [modal, setModal] = useState(null);
   const [isSaving, setIsSaving] = useState(false);

   const filteredCampaigns = useMemo(() => {
      return getFilteredAndSortedCampaigns({ campaigns, search, sort });
   }, [campaigns, search, sort]);

   useEffect(() => {
      const loadCampaigns = async () => {
         if (!selectedCharacter?.id) return;

         const campaignQuery = query(
            collection(db, "campaigns"),
            where("character_id", "==", selectedCharacter.id)
         );

         const snapshot = await getDocs(campaignQuery);
         setCampaigns(snapshot.docs.map(normalizeCampaign));
      };

      loadCampaigns();
   }, [selectedCharacter?.id]);

   const updateLocalCampaigns = (campaign) => {
      setCampaigns((currentCampaigns) => {
         const exists = currentCampaigns.some((currentCampaign) => currentCampaign.id === campaign.id);
         if (!exists) return [...currentCampaigns, campaign];

         return currentCampaigns.map((currentCampaign) =>
            currentCampaign.id === campaign.id ? campaign : currentCampaign
         );
      });
   };

   const updateCharacterCampaignIds = async (campaignId) => {
      if (!selectedCharacter?.id) return;

      await updateDoc(doc(db, "characters", selectedCharacter.id), {
         campaign_ids: arrayUnion(campaignId),
         updated_at: serverTimestamp(),
      });

      setCharacters((currentCharacters) =>
         currentCharacters.map((character) => {
            if (character.id !== selectedCharacter.id) return character;

            const campaignIds = character.campaign_ids || [];
            const nextCampaignIds = campaignIds.includes(campaignId) ? campaignIds : [...campaignIds, campaignId];

            return { ...character, campaign_ids: nextCampaignIds };
         })
      );
   };

   const createCampaign = async (payload) => {
      const docRef = await addDoc(collection(db, "campaigns"), {
         ...payload,
         created_at: serverTimestamp(),
         updated_at: serverTimestamp(),
      });

      await updateCharacterCampaignIds(docRef.id);

      const campaign = { ...payload, id: docRef.id };
      updateLocalCampaigns(campaign);
      setExpandedCampaignId(docRef.id);

      return campaign;
   };

   const updateCampaign = async (campaignId, payload) => {
      await updateDoc(doc(db, "campaigns", campaignId), {
         ...payload,
         updated_at: serverTimestamp(),
      });

      const campaign = { ...payload, id: campaignId };
      updateLocalCampaigns(campaign);
      setExpandedCampaignId(campaignId);

      return campaign;
   };

   const handleRegisterSession = async () => {
   if (!selectedCharacter?.id) return;

   try {
      setIsSaving(true);
      setError("");

      const parsedCampaign = parseCampaignJson(jsonValue);
      const currentCampaign = findCampaignTarget({ campaigns, parsedCampaign });

      if (currentCampaign) {
         const payload = appendSessionsToCampaign({ campaign: currentCampaign, parsedCampaign, selectedCharacter });
         await updateCampaign(currentCampaign.id, payload);
      } else {
         const payload = buildCampaignPayload({ parsedCampaign, selectedCharacter });
         if (!payload.campaign_name) payload.campaign_name = getDefaultCampaignName(selectedCharacter);
         await createCampaign(payload);
      }

      setJsonValue("");
   } catch (parseError) {
      console.error("Erro ao registrar sessão:", parseError);
      setError("JSON inválido. Confere se o modelo foi preenchido corretamente.");
   } finally {
      setIsSaving(false);
   }
};

   const handleSaveCampaignJson = async (parsedCampaign) => {
      if (!modal?.campaign?.id) return;

      try {
         setIsSaving(true);

         const payload = {
            user_id: parsedCampaign.user_id || parsedCampaign.userid || getUserId(selectedCharacter),
            character_id: selectedCharacter.id,
            campaign_name: parsedCampaign.campaign_name || parsedCampaign.campaing_name || getDefaultCampaignName(selectedCharacter),
            sessions: Array.isArray(parsedCampaign.sessions) ? parsedCampaign.sessions : [],
         };

         await updateCampaign(modal.campaign.id, payload);
         setModal(null);
      } catch (saveError) {
         console.error("Erro ao editar campanha:", saveError);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="grid grid-cols-2 gap-12 pb-2">
         <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
            {modal?.type === "edit" ? <CampaignEditModal campaign={modal.campaign} onSave={handleSaveCampaignJson} /> : null}
            {modal?.type === "model" ? <ModelModal /> : null}
         </Modal>

         <Timeline
            campaigns={filteredCampaigns}
            expandedCampaignId={expandedCampaignId}
            setExpandedCampaignId={setExpandedCampaignId}
            onEditCampaign={(campaign) => setModal({ type: "edit", title: "Editar Campanha", campaign })}
         />

         <div className="sticky top-6 self-start">
            <Side
               search={search}
               sort={sort}
               jsonValue={jsonValue}
               error={error}
               isSaving={isSaving}
               setSearch={setSearch}
               setSort={setSort}
               setJsonValue={setJsonValue}
               onRegisterSession={handleRegisterSession}
               onOpenModel={() => setModal({ type: "model", title: "Modelo de JSON" })}
            />
         </div>
      </div>
   );
};

export default SessionsTab;
