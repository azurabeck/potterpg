import {
   EyeIcon,
   LockClosedIcon,
   PencilSquareIcon,
   PhotoIcon,
   PlusIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { getSpellCardImage, getSpellMasteryByXp, getSpellName } from "./helpers";



const getCurrentMasteryEffect = (spell, mastery) => {
   const masteryLevel = Number(
      String(mastery?.maestria || "M0").replace("M", "")
   );

   const masteryEffects = spell?.attributes?.mastery_effects || [];

   return masteryEffects.find(
      (effect) =>
         masteryLevel >= Number(effect.from) &&
         masteryLevel <= Number(effect.to)
   );
};

const SpellAlbumCard = ({
   item,
   savingSpellId,
   onAddSpell,
   onDeleteSpell,
   onDeleteSpellFromCatalog,
   onOpenDetails,
   onOpenEdit,
   onOpenImageEditor,
}) => {
   const { spell, savedData, isKnown } = item;
   const attributes = spell.attributes || {};
   const name = getSpellName(spell);
   const mastery = getSpellMasteryByXp(spell, savedData?.xp ?? 0);
   const cardImage = getSpellCardImage({ spell, isKnown });
   const currentMasteryEffect = getCurrentMasteryEffect(spell, mastery);

   return (
      <article
         className={`group relative overflow-hidden border ${
            isKnown ? "border-yellow-400/25 bg-white/[0.04]" : "border-dashed border-white/15 bg-black/15"
         } shadow-lg transition hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-white/[0.07]`}
      >
         <div className="relative aspect-[2/3] bg-[#16001f]">
            {cardImage ? (
               <img
                  src={cardImage}
                  alt={name}
                  className={`h-full w-full object-cover ${isKnown ? "" : "opacity-30 grayscale"}`}
                  loading="lazy"
               />
            ) : (
               <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#21002b] via-[#32003f] to-[#120016] p-5 text-center">
                  {isKnown ? (
                     <PencilSquareIcon className="h-10 w-10 text-yellow-400/70" />
                  ) : (
                     <LockClosedIcon className="h-10 w-10 text-white/25" />
                  )}
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                     {isKnown ? "Sem imagem" : "Não desbloqueado"}
                  </p>
               </div>
            )}

            {!isKnown ? (
               <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                  <span className="border border-white/20 bg-black/60 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white/80">
                     Espaço no álbum
                  </span>
               </div>
            ) : null}
         </div>

         <div className="space-y-3 p-3">
            <div className="space-y-1">
               <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">{name}</h3>
                  {attributes.required ? <span className="text-yellow-400">★</span> : null}
               </div>

               <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-purple-100/70">
                     Ano {attributes.ano_letivo || "-"}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-purple-100/70">
                     Atributo {attributes.attribute || "-"}
                  </span>
               </div>
            </div>

            {isKnown ? (
               <div className="grid grid-cols-1 gap-2 text-[11px] text-purple-100/70">
                  <div className="flex items-center justify-between rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-purple-100/70">
                     <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">Maestria</p>
                     <p className="text-yellow-300">
                        {mastery?.maestria || "M0"}
                        {" - "}
                        {currentMasteryEffect?.value || "-"}
                        {" - "}
                        {currentMasteryEffect?.description || "-"}
                     </p>
                  </div>
               </div>
            ) : (
               <p className="min-h-[44px] text-[11px] leading-5 text-purple-100/45">
                  Espaço reservado para a carta quando Tomas aprender ou desbloquear este feitiço.
               </p>
            )}

            <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">
               <button
                  type="button"
                  onClick={() => onOpenImageEditor(spell)}
                  className="flex h-8 w-8 items-center justify-center bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                  title="Editar imagem"
                  aria-label="Editar imagem"
               >
                  <PhotoIcon className="h-4 w-4" />
               </button>

               <div className="flex gap-1.5">
                  {isKnown ? (
                     <>
                        <button
                           type="button"
                           onClick={() => onOpenDetails(spell, savedData, mastery)}
                           className="flex h-8 w-8 items-center justify-center bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                           title="Detalhes"
                        >
                           <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                           type="button"
                           onClick={() => onOpenEdit(spell, savedData, mastery)}
                           className="flex h-8 w-8 items-center justify-center bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                           title="Editar feitiço"
                        >
                           <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                           type="button"
                           disabled={savingSpellId === spell.id}
                           onClick={() => onDeleteSpell(spell.id)}
                           className="flex h-8 w-8 items-center justify-center bg-white/10 text-white/40 transition hover:bg-orange-500/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                           title="Remover da ficha"
                        >
                           <LockClosedIcon className="h-4 w-4" />
                        </button>
                        <button
                           type="button"
                           disabled={savingSpellId === spell.id}
                           onClick={() => onDeleteSpellFromCatalog(spell)}
                           className="flex h-8 w-8 items-center justify-center bg-white/10 text-white/40 transition hover:bg-red-500/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                           title="Excluir do banco"
                        >
                           <TrashIcon className="h-4 w-4" />
                        </button>
                     </>
                  ) : (
                     <>
                        <button
                           type="button"
                           onClick={() => onOpenEdit(spell, savedData, mastery)}
                           className="flex h-8 w-8 items-center justify-center bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                           title="Editar feitiço"
                        >
                           <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                           type="button"
                           disabled={savingSpellId === spell.id}
                           onClick={() => onDeleteSpellFromCatalog(spell)}
                           className="flex h-8 w-8 items-center justify-center bg-white/10 text-white/40 transition hover:bg-red-500/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                           title="Excluir do banco"
                        >
                           <TrashIcon className="h-4 w-4" />
                        </button>
                        <button
                           type="button"
                           disabled={savingSpellId === spell.id}
                           onClick={() => onAddSpell(spell)}
                           className="flex h-8 w-8 items-center justify-center bg-yellow-400 text-[#2b0038] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                           title="Aprender feitiço"
                           aria-label="Aprender feitiço"
                        >
                           <PlusIcon className="h-4 w-4" />
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>
      </article>
   );
};

const Album = ({
   selectedCharacter,
   albumItems,
   savingSpellId,
   onAddSpell,
   onDeleteSpell,
   onDeleteSpellFromCatalog,
   onOpenDetails,
   onOpenEdit,
   onOpenImageEditor,
}) => {
   if (!albumItems.length) {
      return (
         <div className="flex min-h-[220px] items-center justify-center border border-dashed border-white/10 text-center text-sm text-purple-200/70">
            Nenhum feitiço encontrado para este álbum.
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
         {albumItems.map((item) => (
            <SpellAlbumCard
               key={item.spell.id}
               item={item}
               selectedCharacter={selectedCharacter}
               savingSpellId={savingSpellId}
               onAddSpell={onAddSpell}
               onDeleteSpell={onDeleteSpell}
               onDeleteSpellFromCatalog={onDeleteSpellFromCatalog}
               onOpenDetails={onOpenDetails}
               onOpenEdit={onOpenEdit}
               onOpenImageEditor={onOpenImageEditor}
            />
         ))}
      </div>
   );
};

export default Album;
