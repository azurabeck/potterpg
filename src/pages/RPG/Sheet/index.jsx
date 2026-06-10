import { Route, Routes } from "react-router-dom";

import Character from "./Character/index.jsx";
import CreateCharacter from "./CreateCharacter/index.jsx";

const RPGSheet = () => {
   return (
      <div className="text-white">
         <Routes>
            <Route index element={<Character />} />
            <Route path="create" element={<CreateCharacter />} />
         </Routes>
      </div>
   );
};

export default RPGSheet;
