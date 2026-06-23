import { useMemo, useState } from "react";
import CustomSelect from "../../../../../components/CustomSelect";
import { locationTypeOptions } from "./constants";

const inputClass = "w-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:ring-1 focus:ring-yellow-400";
const labelClass = "mb-2 block text-xs text-purple-100/70";

const LocationFormModal = ({ location, characters = [], onSubmit }) => {
   const [imageError, setImageError] = useState(false);

   const [form, setForm] = useState(() => ({
      name: location?.name || "",
      characteristics: location?.characteristics || "",
      importance: location?.importance || "",
      access_character_ids: location?.access_character_ids || [],
      image_url: location?.image_url || "",
      type: location?.type || "Público",
   }));

   const typeOptions = useMemo(
      () => locationTypeOptions.filter((item) => item !== "Todos"),
      []
   );

   const handleChange = (key, value) => {
      if (key === "image_url") setImageError(false);
      setForm((current) => ({ ...current, [key]: value }));
   };

   const handleToggleAccess = (characterId) => {
      setForm((current) => {
         const ids = current.access_character_ids || [];
         const nextIds = ids.includes(characterId)
            ? ids.filter((id) => id !== characterId)
            : [...ids, characterId];

         return { ...current, access_character_ids: nextIds };
      });
   };

   const handleSubmit = () => {
      onSubmit({
         ...location,
         ...form,
         access_character_ids: form.access_character_ids || [],
      });
   };

   return (
      <div className="space-y-4 text-xs text-purple-100/80">
         <div className="grid gap-4 md:grid-cols-[260px_1fr]">
            <div className="h-[170px] border border-white/10 bg-white/5">
               {form.image_url && !imageError ? (
                  <img
                     src={form.image_url}
                     alt={form.name || "Preview do local"}
                     className="h-full w-full object-cover"
                     style={{ objectPosition: "center" }}
                     onError={() => setImageError(true)}
                  />
               ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-white/40">
                     {form.image_url ? "Não foi possível carregar essa imagem." : "Preview retangular da imagem"}
                  </div>
               )}
            </div>

            <div className="space-y-3">
               <div>
                  <label className={labelClass}>Nome</label>
                  <input
                     type="text"
                     value={form.name}
                     onChange={(event) => handleChange("name", event.target.value)}
                     placeholder="Nome do local"
                     className={inputClass}
                  />
               </div>

               <div>
                  <label className={labelClass}>URL da imagem</label>
                  <input
                     type="url"
                     value={form.image_url}
                     onChange={(event) => handleChange("image_url", event.target.value)}
                     placeholder="https://..."
                     className={inputClass}
                  />
               </div>
            </div>
         </div>

         <div>
            <label className={labelClass}>Tipo</label>
            <CustomSelect value={form.type} options={typeOptions} onChange={(value) => handleChange("type", value)} />
         </div>

         <div>
            <label className={labelClass}>Quem tem acesso</label>
            <div className="max-h-44 space-y-2 overflow-y-auto border border-white/10 bg-black/20 p-3">
               {characters.length ? (
                  characters.map((character) => (
                     <label key={character.id} className="flex cursor-pointer items-center gap-2 text-[#ceb4aa]">
                        <input
                           type="checkbox"
                           checked={form.access_character_ids.includes(character.id)}
                           onChange={() => handleToggleAccess(character.id)}
                           className="accent-yellow-400"
                        />
                        <span>{character.name || "Personagem sem nome"}</span>
                        {character.character_type === "npc" ? <span className="text-white/30">NPC</span> : null}
                     </label>
                  ))
               ) : (
                  <p className="text-white/40">Nenhum personagem encontrado.</p>
               )}
            </div>
         </div>

         <textarea
            value={form.characteristics}
            onChange={(event) => handleChange("characteristics", event.target.value)}
            placeholder="Características do local"
            rows={4}
            className={`${inputClass} resize-none`}
         />

         <textarea
            value={form.importance}
            onChange={(event) => handleChange("importance", event.target.value)}
            placeholder="Importância narrativa"
            rows={4}
            className={`${inputClass} resize-none`}
         />

         <button
            type="button"
            onClick={handleSubmit}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Salvar local
         </button>
      </div>
   );
};

export default LocationFormModal;
