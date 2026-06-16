import { useEffect, useMemo, useState } from "react";
import {
   arrayUnion,
   collection,
   doc,
   onSnapshot,
   query,
   serverTimestamp,
   setDoc,
   where,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import CopyButton from "@/components/CopyButton";
import GoalFormModal from "./GoalFormModal";
import {
   flattenGoalDocuments,
   getGoalProgress,
   getGoalTypeLabel,
   getYearProgress,
   isGoalCompleted,
   normalizeGoalDocument,
} from "./helpers";

const years = [1, 2, 3, 4, 5, 6, 7];

const GoalsTab = ({ selectedCharacter }) => {
   const [selectedYear, setSelectedYear] = useState(1);
   const [goalDocuments, setGoalDocuments] = useState([]);
   const [modalOpen, setModalOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
      const goalsQuery = query(collection(db, "goals"), where("year", "==", Number(selectedYear)));

      const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
         setGoalDocuments(snapshot.docs.map(normalizeGoalDocument));
      });

      return unsubscribe;
   }, [selectedYear]);

   const yearGoals = useMemo(() => {
      return flattenGoalDocuments({ goalDocuments, selectedCharacter }).map((goal) => {
         const progress = getGoalProgress({ goal, selectedCharacter });
         const completed = isGoalCompleted(progress);

         return { ...goal, progress, completed };
      });
   }, [goalDocuments, selectedCharacter]);

   const yearProgress = useMemo(() => getYearProgress(yearGoals), [yearGoals]);

   const groupedGoals = useMemo(() => {
      return yearGoals.reduce((groups, goal) => {
         const key = goal.type || "custom";
         return { ...groups, [key]: [...(groups[key] || []), goal] };
      }, {});
   }, [yearGoals]);

   const handleSaveGoal = async (form) => {
      try {
         setIsSaving(true);

         const year = Number(form.year);
         const yearDocRef = doc(db, "goals", `year-${year}`);

         const basePayload = {
            year,
            updated_at: serverTimestamp(),
         };

         if (form.type === "spell") {
            await setDoc(
               yearDocRef,
               {
                  ...basePayload,
                  spells: arrayUnion({
                     id: form.source_key || form.title,
                     mastery: Number(form.target),
                  }),
               },
               { merge: true }
            );
         }

         if (form.type === "potion") {
            await setDoc(
               yearDocRef,
               {
                  ...basePayload,
                  potions: arrayUnion({
                     id: form.source_key || form.title,
                     mastery: Number(form.target),
                  }),
               },
               { merge: true }
            );
         }

         if (form.type === "attribute") {
            await setDoc(
               yearDocRef,
               {
                  ...basePayload,
                  attributes: arrayUnion({
                     casa: form.house || "",
                     [form.source_key || form.title]: Number(form.target),
                  }),
               },
               { merge: true }
            );
         }

         setModalOpen(false);
      } catch (error) {
         console.error("Erro ao registrar meta:", error);
      } finally {
         setIsSaving(false);
      }
   };


   const getGoalsText = () => {
      if (!yearGoals.length) return "";

      return yearGoals
         .map((goal) =>
            [
               `Meta: ${goal.title || ""}`,
               `Tipo: ${getGoalTypeLabel(goal.type)}`,
               `Ano: ${goal.year || selectedYear}`,
               `Progresso: ${goal.progress.current} / ${goal.progress.target}`,
               `Status: ${goal.completed ? "Concluída" : "Pendente"}`,
               `Descrição: ${goal.description || ""}`,
            ].join("\n")
         )
         .join("\n\n---\n\n");
   };

   const renderGoal = (goal) => {
      const percent = goal.progress.target ? Math.min(100, Math.round((goal.progress.current / goal.progress.target) * 100)) : 0;

      return (
         <div key={goal.id} className="border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-start justify-between gap-4">
               <div>
                  <div className="flex flex-wrap items-center gap-2">
                     <h3 className="text-sm font-semibold text-white">{goal.title}</h3>
                     <span className={`px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${goal.completed ? "bg-emerald-400/15 text-emerald-200" : "bg-yellow-400/15 text-yellow-200"}`}>
                        {goal.completed ? "Concluída" : "Pendente"}
                     </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-purple-100/70">{goal.description || "Sem descrição."}</p>
               </div>

               <div className="text-right text-xs text-purple-100/70">
                  <p className="text-white">{goal.progress.current} / {goal.progress.target}</p>
                  <p>{goal.type === "spell" || goal.type === "potion" ? "Maestria" : "Meta"}</p>
               </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden bg-white/10">
               <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }} />
            </div>
         </div>
      );
   };

   return (
      <div className="space-y-6 pb-4">
         <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
               <p className="text-xs uppercase tracking-[0.28em] text-yellow-400">Meta atual</p>
               <h2 className="mt-2 text-2xl font-semibold">Metas do {selectedYear}º ano</h2>
               <p className="mt-2 max-w-2xl text-sm leading-6 text-purple-100/70">
                  A tela lê as metas padrão da coleção <strong>goals</strong> e compara com a ficha atual do personagem.
               </p>
            </div>

            <div className="flex gap-2">
               <CopyButton
                  getText={getGoalsText}
                  title="Copiar metas"
                  className="h-10 bg-white/10 px-4 text-white/70 hover:bg-white/20 hover:text-yellow-400"
               />

               <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="h-10 bg-yellow-400 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#2b0038] transition hover:bg-yellow-300"
               >
                  Registrar nova meta
               </button>
            </div>
         </div>

         <div className="flex flex-wrap gap-2">
            {years.map((year) => (
               <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`h-9 px-4 text-xs uppercase tracking-[0.16em] transition ${Number(selectedYear) === year ? "bg-yellow-400 text-[#2b0038]" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"}`}
               >
                  Ano {year}
               </button>
            ))}
         </div>

         <div className="border border-white/10 bg-[#21002b] p-5">
            <div className="flex items-center justify-between gap-4">
               <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-100/60">Progressão do ano</p>
                  <p className="mt-1 text-3xl font-semibold text-yellow-400">{yearProgress}%</p>
               </div>
               <p className="text-right text-xs text-purple-100/70">
                  {yearGoals.filter((goal) => goal.completed).length} de {yearGoals.length} metas concluídas
               </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden bg-white/10">
               <div className="h-full bg-yellow-400" style={{ width: `${yearProgress}%` }} />
            </div>
         </div>

         {yearGoals.length ? (
            <div className="space-y-6">
               {Object.entries(groupedGoals).map(([type, items]) => (
                  <section key={type} className="space-y-3">
                     <h3 className="border-b border-white/10 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                        {getGoalTypeLabel(type)}
                     </h3>
                     <div className="grid gap-3 xl:grid-cols-2">{items.map(renderGoal)}</div>
                  </section>
               ))}
            </div>
         ) : (
            <div className="flex min-h-[240px] items-center justify-center border border-dashed border-white/10 text-center text-sm text-purple-100/60">
               Nenhuma meta cadastrada para este ano.
            </div>
         )}

         <GoalFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveGoal}
            isSaving={isSaving}
            initialYear={selectedYear}
         />
      </div>
   );
};

export default GoalsTab;