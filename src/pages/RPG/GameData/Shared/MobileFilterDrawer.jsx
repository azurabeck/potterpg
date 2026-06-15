import { useState } from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

const MobileFilterDrawer = ({ title = "Filtros", children }) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <>
         <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={title}
            title={title}
            className="fixed bottom-5 right-5 z-[80] flex h-11 w-11 items-center justify-center rounded-full border border-yellow-400/40 bg-[#2b0038] text-yellow-400 shadow-2xl transition hover:bg-yellow-400 hover:text-[#2b0038] md:hidden"
         >
            <FunnelIcon className="h-5 w-5" />
         </button>

         {isOpen ? (
            <div className="fixed inset-0 z-[9999] md:hidden">
               <button
                  type="button"
                  aria-label="Fechar filtros"
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-0 bg-black/70"
               />

               <aside className="absolute right-0 top-0 h-full w-[86vw] max-w-[360px] overflow-y-auto bg-[#30003f] p-5 text-white shadow-2xl">
                  <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                     <h3 className="text-xs uppercase tracking-[0.25em] text-yellow-400">
                        {title}
                     </h3>

                     <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="text-white/70 transition hover:text-white"
                     >
                        <XMarkIcon className="h-5 w-5" />
                     </button>
                  </div>

                  {children}
               </aside>
            </div>
         ) : null}
      </>
   );
};

export default MobileFilterDrawer;
