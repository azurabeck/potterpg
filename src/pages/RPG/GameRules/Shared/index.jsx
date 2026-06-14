import { useState } from "react";

import Header from "./Header";
import Content from "./Content";

import { rulesTabs } from "./rules_tabs";

const Container = () => {
   const [activeTab, setActiveTab] = useState(rulesTabs[0].key);

   return (
      <section className="flex h-[calc(100vh-65px)] w-full flex-col bg-[#30003f] px-8 pb-7 pt-6 text-white shadow-2xl">
         <Header
            tabs={rulesTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
         />
         <Content activeTab={activeTab} tabs={rulesTabs}></Content>
      </section>
   );
};

export default Container;
