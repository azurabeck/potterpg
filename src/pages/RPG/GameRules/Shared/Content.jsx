import { useRef } from "react";
import CopyButton from "@/components/CopyButton";

const Content = ({ children }) => {
   const contentRef = useRef(null);

   const getCurrentRuleText = () => {
      return contentRef.current?.innerText || "";
   };

   return (
      <div className="mt-5 min-h-0 flex-1 border-t border-white/20 pt-4">
         <main className="h-full min-h-0 overflow-y-auto px-0 py-6 pt-0 md:px-6 lg:px-12">
            <div className="sticky top-0 z-10 mb-4 flex justify-end bg-[#30003f]/95 py-3 backdrop-blur">
               <CopyButton
                  getText={getCurrentRuleText}
                  title="Copiar texto"
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-purple-50 hover:border-yellow-400 hover:text-yellow-300"
               />
            </div>

            <div ref={contentRef}>{children}</div>
         </main>
      </div>
   );
};

export default Content;
