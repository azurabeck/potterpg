import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Header from "./Header";
import Content from "./Content";
import { rulesTabs } from "./rules_tabs";

const Container = () => {
   const location = useLocation();
   const activeTab = location.pathname.split("/").filter(Boolean).at(-1);
   const currentTab = rulesTabs.find((tab) => tab.key === activeTab) || rulesTabs[0];

   return (
      <section className="flex h-[calc(100vh-65px)] w-full flex-col bg-[#30003f] px-5 pb-7 pt-6 text-white md:px-8 lg:px-10 xl:px-14">
         <Header tabs={rulesTabs} activeTab={currentTab.key} />

         <Content>
            <Routes>
               <Route index element={<Navigate to={rulesTabs[0].key} replace />} />

               {rulesTabs.map((tab) => {
                  const RuleComponent = tab.component;

                  return (
                     <Route
                        key={tab.key}
                        path={tab.key}
                        element={<RuleComponent />}
                     />
                  );
               })}

               <Route path="*" element={<Navigate to={rulesTabs[0].key} replace />} />
            </Routes>
         </Content>
      </section>
   );
};

export default Container;
