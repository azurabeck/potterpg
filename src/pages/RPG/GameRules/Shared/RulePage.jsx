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
      <div className="my-7 w-full overflow-x-auto border-y border-white/10">
         <table className="w-full min-w-[820px] border-collapse text-left text-sm text-purple-50/85">
            <tbody>
               {clean.map((row, rowIndex) => (
                  <tr
                     key={rowIndex}
                     className={rowIndex === 0 ? "border-b border-yellow-400/40 text-yellow-300" : "border-b border-white/8 last:border-b-0"}
                  >
                     {row.map((cell, cellIndex) => (
                        <td
                           key={`${rowIndex}-${cellIndex}`}
                           className={`whitespace-pre-line px-3 py-3.5 align-top first:pl-0 last:pr-0 ${compact ? "text-xs leading-6" : "leading-7"} ${cellIndex === 0 ? "font-semibold text-white" : ""}`}
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
      <section className="grid gap-5 border-t border-white/10 py-8 first:border-t-0 first:pt-2 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
         <aside className="lg:pr-8">
            <h3 className="text-left text-sm font-semibold uppercase tracking-[0.18em] text-yellow-300">
               {title}
            </h3>

            {description ? (
               <p className="mt-3 max-w-sm text-sm leading-7 text-purple-100/65">
                  {description}
               </p>
            ) : null}
         </aside>

         <div className="min-w-0 space-y-5">
            {children}
         </div>
      </section>
   );
};

const TextBlock = ({ children }) => {
   if (!children) return null;

   return (
      <div className="max-w-[980px] whitespace-pre-line text-left text-[15px] leading-8 text-purple-50/85">
         {children}
      </div>
   );
};

const SimpleList = ({ items = [] }) => {
   return (
      <ul className="ml-5 max-w-[980px] list-disc space-y-2.5 text-left text-[15px] leading-8 text-purple-50/85 marker:text-yellow-400/80">
         {items.map((item) => (
            <li key={item} className="pl-1">{item}</li>
         ))}
      </ul>
   );
};

const RulePage = ({ title, intro, children }) => {
   return (
      <article className="w-full max-w-[1280px] pb-16 text-left">
         <header className="mb-7 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
            <div>
               <p className="text-xs uppercase tracking-[0.24em] text-purple-100/45">
                  Documento
               </p>
            </div>

            <div className="max-w-[980px]">
               <h2 className="text-left text-2xl font-semibold tracking-wide text-yellow-300">
                  {title}
               </h2>

               {intro ? (
                  <p className="mt-3 text-left text-[15px] leading-8 text-purple-50/80">
                     {intro}
                  </p>
               ) : null}
            </div>
         </header>

         <div>{children}</div>
      </article>
   );
};

export { RulePage, RuleSection, RuleTable, TextBlock, SimpleList };
