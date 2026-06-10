import { Route, Routes } from "react-router-dom";

import Container from "./Shared/index.jsx";
import CreateCharacter from "./Modals/CreateCharacter.jsx";

const RPGSheet = () => {
   return (
      <div className="text-white">
         <Routes>
            <Route index element={<Container />} />
            <Route path="create" element={<CreateCharacter />} />
         </Routes>
      </div>
   );
};

export default RPGSheet;
