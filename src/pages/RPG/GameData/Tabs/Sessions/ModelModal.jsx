import { sessionModel } from "./constants";

const ModelModal = () => {
   return (
      <pre className="whitespace-pre-wrap border border-white/10 bg-white/5 p-4 font-mono text-xs leading-5 text-purple-100/80">
         {JSON.stringify(sessionModel, null, 2)}
      </pre>
   );
};

export default ModelModal;
