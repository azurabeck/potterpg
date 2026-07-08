import { useMemo, useState } from "react";

const isObject = (value) => value !== null && typeof value === "object";

const updateArrayValue = (value, nextValue) => {
   if (typeof value !== "number") return nextValue;
   if (nextValue === "") return "";

   const numericValue = Number(nextValue);
   return Number.isNaN(numericValue) ? value : numericValue;
};

const PrimitiveEditor = ({ value, onChange }) => {
   if (typeof value === "boolean") {
      return (
         <select
            value={String(value)}
            onChange={(event) => onChange(event.target.value === "true")}
            className="border border-white/10 bg-[#24102f] px-2 py-1 text-xs text-white outline-none"
         >
            <option value="true">true</option>
            <option value="false">false</option>
         </select>
      );
   }

   if (value === null) {
      return <span className="text-purple-300">null</span>;
   }

   return (
      <input
         type={typeof value === "number" ? "number" : "text"}
         value={value}
         onChange={(event) => onChange(updateArrayValue(value, event.target.value))}
         className="min-w-0 flex-1 border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-white outline-none focus:border-yellow-400/60"
      />
   );
};

const JsonNode = ({ name, value, path, collapsedPaths, onToggle, onChange }) => {
   const objectValue = isObject(value);
   const collapsed = collapsedPaths.has(path);
   const entries = objectValue ? Object.entries(value) : [];
   const label = Array.isArray(value) ? `Array(${value.length})` : "Object";

   if (!objectValue) {
      return (
         <div className="flex items-center gap-2 py-1 pl-5">
            <span className="shrink-0 font-mono text-yellow-300">{name}:</span>
            <PrimitiveEditor value={value} onChange={onChange} />
         </div>
      );
   }

   return (
      <div className="font-mono text-xs">
         <button
            type="button"
            onClick={() => onToggle(path)}
            className="flex w-full items-center gap-2 py-1 text-left hover:bg-white/5"
         >
            <span className="w-3 text-purple-200">{collapsed ? "▶" : "▼"}</span>
            <span className="text-yellow-300">{name}</span>
            <span className="text-purple-200/60">{label}</span>
         </button>

         {!collapsed ? (
            <div className="ml-3 border-l border-white/10 pl-3">
               {entries.map(([key, childValue]) => (
                  <JsonNode
                     key={`${path}.${key}`}
                     name={key}
                     value={childValue}
                     path={`${path}.${key}`}
                     collapsedPaths={collapsedPaths}
                     onToggle={onToggle}
                     onChange={(nextValue) => {
                        const clone = Array.isArray(value) ? [...value] : { ...value };
                        clone[key] = nextValue;
                        onChange(clone);
                     }}
                  />
               ))}
            </div>
         ) : null}
      </div>
   );
};

const JsonTreeEditor = ({ value, onChange }) => {
   const [collapsedPaths, setCollapsedPaths] = useState(new Set());

   const rootName = useMemo(
      () => (Array.isArray(value) ? `Array(${value.length})` : "Campanha"),
      [value]
   );

   const handleToggle = (path) => {
      setCollapsedPaths((current) => {
         const next = new Set(current);
         next.has(path) ? next.delete(path) : next.add(path);
         return next;
      });
   };

   return (
      <div className="max-h-[60vh] overflow-auto border border-white/10 bg-black/20 p-3">
         <JsonNode
            name={rootName}
            value={value}
            path="$"
            collapsedPaths={collapsedPaths}
            onToggle={handleToggle}
            onChange={onChange}
         />
      </div>
   );
};

export default JsonTreeEditor;
