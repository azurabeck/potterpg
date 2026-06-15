import { Navigate, Route, Routes } from "react-router-dom";

import Container from "./Shared/index.jsx";
import CreateCharacter from "./Modals/CreateCharacter.jsx";

const RPGSheet = () => {
   return (
      <div className="text-white">
         <Routes>
            <Route index element={<Navigate to="attributes" replace />} />
            <Route path="create" element={<CreateCharacter />} />
            <Route path=":tabKey" element={<Container />} />
            <Route path="*" element={<Navigate to="attributes" replace />} />
         </Routes>
      </div>
   );
};

export default RPGSheet;
