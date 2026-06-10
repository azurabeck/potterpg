import attributeRules from "../../../../../assets/json/attributeRules.json";

const RulesPanel = ({ activeTab, currentRules }) => {
   if (activeTab === "attributes") {
      return (
         <aside className="col-span-5 pr-2 text-left text-xs leading-4 text-[#736868]">
            <h4 className="mb-5 uppercase text-[#ceb4aa] tracking-[0.08em]">
               {attributeRules.title}
            </h4>

            {attributeRules.description.map((paragraph) => (
               <p key={paragraph} className="mb-4">
                  {paragraph}
               </p>
            ))}

            <h4 className="mb-4 mt-6 text-[#ceb4aa] uppercase tracking-[0.08em]">
               {attributeRules.evolutionTitle}
            </h4>

            <div className="space-y-5">
               {attributeRules.attributes.map((attribute) => (
                  <div key={attribute.name}>
                     <p className="mb-1 text-yellow-400">
                        {attribute.name}
                     </p>

                     <p className="mb-2">{attribute.description}</p>

                     <p className="mb-1">Exemplos:</p>

                     <ul className="list-disc space-y-1 pl-4">
                        {attribute.examples.map((example) => (
                           <li key={example}>{example}</li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>

            <h4 className="mb-4 mt-6 uppercase text-[#ceb4aa] tracking-[0.08em]">
               {attributeRules.gainRule.title}
            </h4>

            <p className="mb-2">Um atributo só deve receber ponto quando:</p>

            <ul className="mb-4 list-disc space-y-1 pl-4">
               {attributeRules.gainRule.conditions.map((condition) => (
                  <li key={condition}>{condition}</li>
               ))}
            </ul>

            <p className="mb-2">Normalmente:</p>

            <ul className="list-disc space-y-1 pl-4">
               {attributeRules.gainRule.normal.map((rule) => (
                  <li key={rule}>{rule}</li>
               ))}
            </ul>
         </aside>
      );
   }

   return (
      <aside className="col-span-5 pr-2 text-left text-xs leading-4 text-[#736868]">
         <h3 className="mb-5 uppercase tracking-[0.08em]">
            {currentRules.title}
         </h3>

         {currentRules.text.map((paragraph) => (
            <p key={paragraph} className="mb-4">
               {paragraph}
            </p>
         ))}

         <h4 className="mb-4 mt-6 uppercase tracking-[0.08em]">
            {currentRules.subtitle}
         </h4>

         <p className="mb-1">{currentRules.highlight}</p>
         <p>{currentRules.description}</p>
      </aside>
   );
};

export default RulesPanel;