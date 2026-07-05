import { XMarkIcon } from "@heroicons/react/24/outline";

const sizeClasses = {
   sm: "max-w-lg",
   md: "max-w-2xl",
   lg: "max-w-4xl",
   xl: "max-w-6xl",
   full: "max-w-[92vw]",
};

const Modal = ({
   isOpen,
   title = "Modal",
   onClose,
   children,
   size = "md",
   bodyClassName = "",
}) => {
   if (!isOpen) return null;

   const widthClass = sizeClasses[size] || sizeClasses.md;

   return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#120016]/80 p-4 backdrop-blur-sm m-0">
         <div
            className={`flex h-[calc(100vh-2rem)] w-full ${widthClass} flex-col overflow-hidden border border-white/10 bg-[#21002b] p-6 text-white shadow-2xl`}
         >
            <header className="mb-6 flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
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

            <div className={`min-h-0 flex-1 overflow-y-auto pr-1 text-sm text-[#c3b7c8] ${bodyClassName}`}>
               {children}
            </div>
         </div>
      </div>
   );
};

export default Modal;
