import { useMemo, useRef, useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";

import IA from "../Tabs/IA";
import Mastery from "../Tabs/Mastery";
import Duel from "../Tabs/Duel";
import Quidditch from "../Tabs/Quidditch";
import PassingYear from "../Tabs/PassingYear";
import Mystery from "../Tabs/Mystery";
import Battles from "../Tabs/Battles";

const pages = {
   "narracao-ia": IA,
   maestria: Mastery,
   "duelo-bruxo": Duel,
   quadribol: Quidditch,
   "ano-letivo": PassingYear,
   misterios: Mystery,
   "batalhas-do-mundo": Battles,
};

const Content = ({ tabs, activeTab }) => {
   const contentRef = useRef(null);
   const [copied, setCopied] = useState(false);
   const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];
   const ActivePage = useMemo(() => pages[currentTab.key] || IA, [currentTab.key]);

   const handleCopy = async () => {
      const text = contentRef.current?.innerText || "";
      if (!text) return;

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
   };

   return (
      <div className="mt-5 min-h-0 flex-1 border-t border-white/20 pt-4">
         <main className="h-full min-h-0 overflow-y-auto px-6 py-6 pt-0 lg:px-12">
            <div className="sticky top-0 z-10 mb-4 flex justify-end bg-[#30003f]/95 py-3 backdrop-blur">
               <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-purple-50 transition hover:border-yellow-400 hover:text-yellow-300"
               >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  {copied ? "Copiado" : "Copiar texto"}
               </button>
            </div>

            <div ref={contentRef}>
               <ActivePage />
            </div>
         </main>
      </div>
   );
};

export default Content;
