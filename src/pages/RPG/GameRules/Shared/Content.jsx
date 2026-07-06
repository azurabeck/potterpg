import { useRef } from "react";
import CopyButton from "@/components/CopyButton";

const Content = ({ children }) => {
   const contentRef = useRef(null);

   const getCurrentRuleText = () => {
      return contentRef.current?.innerText || "";
   };

   return (
      <div className="mt-5 min-h-0 flex-1 border-t border-white/10 pt-5">
         <main className="h-full min-h-0 overflow-y-auto px-0 pb-10 pt-0">
            <div className="sticky top-0 z-10 mb-5 flex justify-end bg-[#30003f]/95 py-2 backdrop-blur">
               <CopyButton
                  getText={getCurrentRuleText}
                  title="Copiar texto"
                  className="px-3 py-2 text-purple-50/60 transition hover:text-yellow-300"
               />
            </div>

            <div ref={contentRef}>{children}</div>
         </main>
      </div>
   );
};

export default Content;
