const DetailRow = ({ label, value }) => (
   <div className="border-b border-white/10 py-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-yellow-400/80">
         {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-purple-100/80">
         {value || "-"}
      </p>
   </div>
);

const SpellDetailsModal = ({ spell, savedData, mastery }) => {
   const attributes = spell?.attributes || {};

   return (
      <div className="space-y-5 text-xs text-purple-100/80">
         <div className="border-y border-dashed border-white/25 py-4">
            <div className="mb-4 flex items-center gap-7">
               <div className="h-px flex-1 border-t border-dashed border-white/25" />
               <p className="text-center text-[11px] uppercase text-white">
                  {attributes.name || attributes.incantation || "Feitiço"}
               </p>
               <div className="h-px flex-1 border-t border-dashed border-white/25" />
            </div>

            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
               <DetailRow label="Nome" value={attributes.name} />
               <DetailRow label="Conjuração" value={attributes.incantation} />
               <DetailRow label="Tipo" value={spell?.type} />
               <DetailRow label="Categoria" value={attributes.category} />
               <DetailRow label="Ano letivo" value={attributes.ano_letivo} />
               <DetailRow label="Nível" value={savedData?.nivel || attributes.nivel} />
               <DetailRow label="XP" value={savedData?.xp ?? 0} />
               <DetailRow label="Maestria" value={mastery?.maestria} />
               <DetailRow label="Dado de maestria" value={mastery?.dado} />
               <DetailRow label="Dice / efeito" value={attributes.effect_dice} />
               <DetailRow label="Atributo" value={savedData?.atributo} />
               <DetailRow label="Luz" value={attributes.light} />
               <DetailRow label="Aula" value={attributes.aula} />
               <DetailRow
                  label="Penalidade crime mágico"
                  value={attributes.penalidade_crime_magico}
               />
               <DetailRow label="Obrigatório" value={attributes.required ? "Sim" : "Não"} />
               <DetailRow
                  label="Maestria obrigatória"
                  value={attributes.maestria_required || 0}
               />
            </div>

            <div className="mt-4">
               <DetailRow label="Efeito" value={attributes.effect} />
               <DetailRow label="Imagem" value={attributes.image} />
               <DetailRow label="Slug" value={attributes.slug} />
               <DetailRow label="ID" value={spell?.id} />
            </div>
         </div>
      </div>
   );
};

export default SpellDetailsModal;
