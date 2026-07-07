import { useEffect, useState } from "react";

const getObjectValue = (object, path, fallback = "-") => {
   const value = path.reduce((currentValue, key) => currentValue?.[key], object);

   if (Array.isArray(value)) return value.filter(Boolean).join(", ") || fallback;

   return value || fallback;
};

const ApiObjectDetailsModal = ({ item, title, onClose }) => {
   const [jsonValue, setJsonValue] = useState("");

   useEffect(() => {
      setJsonValue(item ? JSON.stringify(item, null, 2) : "");
   }, [item]);

   if (!item) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
         <section className="flex max-h-full w-full max-w-5xl flex-col border border-purple-500/30 bg-[#16001f] shadow-2xl">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
               <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-yellow-400/70">
                     JSON editável
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">{title}</h2>
               </div>

               <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-sm text-purple-100/70 transition hover:text-yellow-300"
               >
                  Fechar
               </button>
            </header>

            <textarea
               value={jsonValue}
               onChange={(event) => setJsonValue(event.target.value)}
               spellCheck={false}
               className="min-h-[60vh] flex-1 resize-none bg-[#0f0014] p-5 font-mono text-xs leading-6 text-purple-50 outline-none"
            />
         </section>
      </div>
   );
};

const ApiAlbumCard = ({ title, description, image, tags = [], onClick }) => {
   return (
      <article
         onClick={onClick}
         title={description || title}
         className="group cursor-pointer overflow-hidden border border-dashed border-purple-400/20 bg-[#190020] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/45 hover:bg-[#22002d]"
      >
         <div className="relative aspect-[2/3] overflow-hidden bg-[#120018]">
            {image ? (
               <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  onError={(event) => {
                     event.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full object-cover opacity-35 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
               />
            ) : (
               <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#140018] via-[#23002f] to-[#0c0010] px-4 text-center">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-purple-100/35">
                     Sem imagem
                  </span>
               </div>
            )}

            <div className="pointer-events-none absolute inset-2 border border-purple-200/10 transition group-hover:border-yellow-300/30" />
         </div>

         <div className="space-y-2 p-3">
            <div>
               <h3 className="line-clamp-2 min-h-[36px] text-xs font-semibold leading-5 text-white">
                  {title}
               </h3>

               <p className="mt-2 line-clamp-3 min-h-[54px] text-[11px] leading-5 text-purple-100/60">
                  {description || "-"}
               </p>
            </div>

            {tags.length ? (
               <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                     <span
                        key={tag}
                        className="border border-white/10 px-1.5 py-0.5 text-[9px] text-purple-100/65"
                     >
                        {tag}
                     </span>
                  ))}
               </div>
            ) : null}

            <div className="border-t border-white/10 pt-2 text-[9px] uppercase tracking-[0.18em] text-purple-100/35 transition group-hover:text-yellow-300/80">
               Ver detalhes
            </div>
         </div>
      </article>
   );
};

const ApiAlbumGrid = ({ items, getTitle, getDescription, getImage, getTags }) => {
   const [selectedItem, setSelectedItem] = useState(null);

   return (
      <>
         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {items.map((item, index) => {
               const title = getTitle(item);
               const description = getDescription(item);
               const image = getImage?.(item);
               const tags = getTags?.(item) || [];

               return (
                  <ApiAlbumCard
                     key={item.id || item.animal || title || index}
                     title={title}
                     description={description}
                     image={image}
                     tags={tags}
                     onClick={() => setSelectedItem(item)}
                  />
               );
            })}
         </div>

         <ApiObjectDetailsModal
            item={selectedItem}
            title={selectedItem ? getTitle(selectedItem) : ""}
            onClose={() => setSelectedItem(null)}
         />
      </>
   );
};

export { ApiAlbumGrid, getObjectValue };
