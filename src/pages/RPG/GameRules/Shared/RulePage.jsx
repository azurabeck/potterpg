const valueToText = (value) => {
   if (value === null || value === undefined) return "";
   return String(value);
};

export const cleanRows = (rows = []) => {
   const cleanedRows = rows
      .map((row) => row.map(valueToText))
      .filter((row) => row.some((cell) => cell.trim() !== ""));

   let lastColumn = 0;

   cleanedRows.forEach((row) => {
      row.forEach((cell, index) => {
         if (cell.trim() !== "") lastColumn = Math.max(lastColumn, index);
      });
   });

   return cleanedRows.map((row) => row.slice(0, lastColumn + 1));
};

export const normalizeMetasRows = (rows = []) => {
   return cleanRows(rows.slice(0, 37)).map((row) =>
      row.map((cell) => {
         if (cell === "46271") return "6-9";
         if (cell === "46144") return "2-5";
         if (cell === "46268") return "5-9";
         if (cell === "46054") return "2-4";
         return cell;
      })
   );
};

const RuleTable = ({ rows, compact = false }) => {
   const clean = cleanRows(rows);

   if (!clean.length) return null;

   return (
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
         <table className="w-full min-w-[720px] border-collapse text-left text-xs text-purple-50/85">
            <tbody>
               {clean.map((row, rowIndex) => (
                  <tr
                     key={rowIndex}
                     className={rowIndex === 0 ? "bg-white/10 text-yellow-300" : "border-t border-white/10"}
                  >
                     {row.map((cell, cellIndex) => (
                        <td
                           key={`${rowIndex}-${cellIndex}`}
                           className={`whitespace-pre-line px-4 py-3 align-top ${
                              compact ? "text-[11px]" : ""
                           } ${cellIndex === 0 ? "font-semibold text-white" : ""}`}
                        >
                           {cell}
                        </td>
                     ))}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

const RuleSection = ({ title, description, children }) => {
   return (
      <section className="space-y-3 rounded-2xl border border-white/10 bg-black/10 p-5 shadow-lg">
         <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-400">
               {title}
            </h3>
            {description ? (
               <p className="mt-2 text-sm leading-6 text-purple-100/75">{description}</p>
            ) : null}
         </div>

         {children}
      </section>
   );
};

const TextBlock = ({ children }) => {
   if (!children) return null;

   return (
      <div className="whitespace-pre-line rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-purple-50/85">
         {children}
      </div>
   );
};

const SimpleList = ({ items = [] }) => {
   return (
      <ul className="space-y-2 text-sm leading-6 text-purple-50/85">
         {items.map((item) => (
            <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
               {item}
            </li>
         ))}
      </ul>
   );
};

const RulePage = ({ title, intro, children }) => {
   return (
      <article className="mx-auto w-full max-w-6xl space-y-5 pb-10">
         <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-yellow-300">
               {title}
            </h2>
            {intro ? <p className="mt-3 text-sm leading-7 text-purple-50/85">{intro}</p> : null}
         </div>

         {children}
      </article>
   );
};

export { RulePage, RuleSection, RuleTable, TextBlock, SimpleList };
