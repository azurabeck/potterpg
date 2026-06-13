import CharacterImage from "./CharacterImage";
import RulesPanel from "./RulesPanel";

const Content = ({ children, character, activeTab, currentRules, hideRules = false }) => {
   return (
      <div className="mt-5 min-h-0 flex-1 border-t border-white/20 pt-4">
         <div className="grid h-full min-h-0 w-full grid-cols-12">
            <CharacterImage character={character} />

            <main className="col-span-9 h-full min-h-0 overflow-y-auto px-12 py-6 pt-0">
               <div
                  className={
                     hideRules
                        ? "min-h-full text-left"
                        : "grid min-h-[1200px] grid-cols-12 gap-8"
                  }
               >
                  <div className={hideRules ? "" : "col-span-6 pr-6 text-left"}>
                     <div className={hideRules ? "" : "sticky top-0"}>{children}</div>
                  </div>

                  {!hideRules ? (
                     <>
                        <div className="col-span-1 border-l border-dashed border-white/25" />

                        <div className="col-span-5 pr-2">
                           <RulesPanel activeTab={activeTab} currentRules={currentRules} />
                        </div>
                     </>
                  ) : null}
               </div>
            </main>
         </div>
      </div>
   );
};

export default Content;
