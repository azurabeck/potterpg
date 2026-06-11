import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({ isOpen, title = "Modal", onClose, children }) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120016]/80 p-4 backdrop-blur-sm">
         <div className="w-full h-full max-w-2xl border border-white/10 bg-[#21002b] p-6 text-white shadow-2xl">
            <header className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
               <h2 className="text-lg font-normal tracking-wide text-[#f2e8f5]">
                  {title}
               </h2>

               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-yellow-400"
               >
                  <XMarkIcon className="h-5 w-5" />
               </button>
            </header>

            <div className="max-h-[70vh] overflow-y-auto pr-1 text-sm text-[#c3b7c8]">
               {children}
            </div>
         </div>
      </div>
   );
};

export default Modal;