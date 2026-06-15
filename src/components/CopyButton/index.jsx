import { useState } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

const CopyButton = ({
   text = "",
   getText,
   onCopy,
   title = "Copiar",
   disabled = false,
   className = "",
   iconClassName = "h-4 w-4",
}) => {
   const [copied, setCopied] = useState(false);

   const handleClick = async () => {
      if (copied || disabled) return;

      try {
         let copyText = typeof getText === "function" ? await getText() : text;

         if (typeof onCopy === "function") {
            const result = await onCopy();

            if (typeof result === "string") {
               copyText = result;
            }
         }

         if (copyText) {
            await navigator.clipboard.writeText(copyText);
         }

         setCopied(true);

         setTimeout(() => {
            setCopied(false);
         }, 1200);
      } catch (error) {
         console.error("Erro ao copiar:", error);
      }
   };

   return (
      <button
         type="button"
         onClick={handleClick}
         title={title}
         disabled={disabled}
         className={`inline-flex items-center justify-center text-white/50 transition hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      >
         <span
            className={`transition-all duration-300 ${
               copied ? "scale-125 rotate-12 text-green-300" : "scale-100 rotate-0"
            }`}
         >
            {copied ? (
               <CheckIcon className={iconClassName} />
            ) : (
               <ClipboardIcon className={iconClassName} />
            )}
         </span>
      </button>
   );
};

export default CopyButton;
