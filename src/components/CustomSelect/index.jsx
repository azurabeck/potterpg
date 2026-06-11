import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const normalizeOptions = (options) => {
   return options.map((option) => {
      if (typeof option === "string" || typeof option === "number") {
         return {
            value: option,
            label: String(option),
         };
      }

      return option;
   });
};

const CustomSelect = ({
   value,
   options = [],
   placeholder = "Selecionar",
   onChange,
   className = "",
}) => {
   const containerRef = useRef(null);
   const [isOpen, setIsOpen] = useState(false);

   const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const selectedOption = normalizedOptions.find((option) => option.value === value);

   return (
      <div ref={containerRef} className={`relative ${className}`}>
         <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex w-full items-center justify-between border border-yellow-400/30 bg-[#4a185c] px-4 py-2 text-left text-sm text-white"
         >
            <span>{selectedOption?.label || placeholder}</span>
            <ChevronDownIcon className="h-4 w-4" />
         </button>

         {isOpen ? (
            <div className="absolute left-0 top-full z-50 mt-1 w-full border border-white/10 bg-[#21002b] shadow-2xl">
               {normalizedOptions.map((option) => (
                  <button
                     key={option.value}
                     type="button"
                     onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                     }}
                     className={`flex w-full px-4 py-2 text-left text-sm transition ${
                        value === option.value
                           ? "bg-yellow-400 text-[#21002b]"
                           : "text-white hover:bg-white/10"
                     }`}
                  >
                     {option.label}
                  </button>
               ))}
            </div>
         ) : null}
      </div>
   );
};

export default CustomSelect;