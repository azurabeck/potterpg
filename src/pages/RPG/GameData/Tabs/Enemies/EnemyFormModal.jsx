import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import CustomSelect from "@/components/CustomSelect";
import { attributeOptions, diceOptions, difficultyOptions, distanceOptions, enemyTypeOptions, getBalanceByYear, yearOptions } from "./constants";
import { normalizeEnemy } from "./helpers";

const inputClass = "w-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40";
const labelClass = "mb-2 block text-xs text-purple-100/70";
const cardClass = "space-y-3 border border-white/10 bg-white/5 p-4";

const clampAttributeValue = (value) => Math.max(0, Number(value || 0));

const getSecondaryValue = (balance) => Math.max(balance.attribute_min, balance.attribute_max - 2);

const getAutofilledByYear = (currentForm, year) => {
   const balance = getBalanceByYear(year);

   return {
      ...currentForm,
      recommended_year: Number(year),
      hp: balance.hp_default,
      difficulty: balance.difficulty,
      impact_die: balance.impact_die,
      main_attack: {
         ...(currentForm.main_attack || {}),
         attribute_value: balance.attribute_max,
      },
      secondary_attack: currentForm.secondary_attack === null
         ? null
         : {
              ...(currentForm.secondary_attack || {}),
              attribute_value: getSecondaryValue(balance),
           },
      defense: {
         ...(currentForm.defense || {}),
         attribute_value: getSecondaryValue(balance),
      },
   };
};

const InfoHint = ({ text }) => (
   <span className="group relative inline-flex align-middle">
      <InformationCircleIcon className="h-4 w-4 cursor-help text-yellow-400/70 transition group-hover:text-yellow-300" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-[70] mb-2 hidden w-64 -translate-x-1/2 border border-yellow-400/30 bg-[#21002b] p-3 text-[11px] leading-5 text-purple-100 shadow-2xl group-hover:block">
         {text}
      </span>
   </span>
);

const LabelWithInfo = ({ children, info }) => (
   <label className={`${labelClass} flex items-center gap-1`}>
      <span>{children}</span>
      {info ? <InfoHint text={info} /> : null}
   </label>
);

const BalanceSummary = ({ balance }) => (
   <div className="border border-yellow-400/20 bg-yellow-400/10 p-3 text-[11px] leading-5 text-purple-100/75">
      <p className="font-semibold text-yellow-300">Referência de equilíbrio — {balance.label}</p>
      <p>Ataque e defesa: entre {balance.attribute_min} e {balance.attribute_max} pontos.</p>
      <p>HP sugerido: entre {balance.hp_min} e {balance.hp_max}. Padrão: {balance.hp_default}.</p>
      <p>Dado de impacto sugerido: {balance.impact_die}.</p>
      <p className="mt-1 text-purple-100/50">{balance.note}</p>
   </div>
);

const AttackFields = ({ title, attack, onChange, allowDisable = false, balance }) => {
   const isDisabled = attack === null;

   if (isDisabled) {
      return (
         <div className={cardClass}>
            <div className="flex items-center justify-between gap-3">
               <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">{title}</p>
               {allowDisable ? (
                  <button
                     type="button"
                     onClick={() => onChange({ ...normalizeEnemy({}).secondary_attack, attribute_value: getSecondaryValue(balance) })}
                     className="text-[11px] text-yellow-400 transition hover:text-yellow-300"
                  >
                     Adicionar ataque
                  </button>
               ) : null}
            </div>
            <p className="text-xs text-purple-100/45">Este adversário não possui ataque secundário.</p>
         </div>
      );
   }

   return (
      <div className={cardClass}>
         <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">{title}</p>
            {allowDisable ? (
               <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-[11px] text-red-300/80 transition hover:text-red-300"
               >
                  Remover
               </button>
            ) : null}
         </div>

         <div>
            <LabelWithInfo info="Nome narrativo da habilidade. Ex: Presas e Patas, Teia, Sopro de Fogo, Investida.">Nome do ataque</LabelWithInfo>
            <input
               value={attack.name || ""}
               onChange={(event) => onChange({ ...attack, name: event.target.value })}
               placeholder="Ex: Presas Cortantes"
               className={inputClass}
            />
         </div>

         <div className="grid gap-3 md:grid-cols-3">
            <div>
               <LabelWithInfo info="Atributo usado na rolagem do ataque. Para criaturas físicas use Força, Agilidade, Ataque ou Precisão. Para efeitos mentais use Controle, Magia ou Inteligência.">Atributo</LabelWithInfo>
               <CustomSelect
                  value={attack.attribute}
                  options={attributeOptions}
                  onChange={(value) => onChange({ ...attack, attribute: value })}
               />
            </div>

            <div>
               <LabelWithInfo info={`Para ${balance?.label || "este ano"}, use entre ${balance?.attribute_min ?? 0} e ${balance?.attribute_max ?? 0}. Ataque principal pode ficar no máximo; ataque secundário geralmente fica 1 a 2 pontos abaixo.`}>Valor</LabelWithInfo>
               <input
                  type="number"
                  value={attack.attribute_value}
                  onChange={(event) => onChange({ ...attack, attribute_value: clampAttributeValue(event.target.value) })}
                  className={inputClass}
               />
            </div>

            <div>
               <LabelWithInfo info="Distância de uso da habilidade. Use Longa para teias, sopros, projéteis e cantos; Curta para mordidas, garras e investidas.">Distância</LabelWithInfo>
               <CustomSelect
                  value={attack.distance}
                  options={distanceOptions}
                  onChange={(value) => onChange({ ...attack, distance: value })}
               />
            </div>
         </div>

         <textarea
            value={attack.effect || ""}
            onChange={(event) => onChange({ ...attack, effect: event.target.value })}
            placeholder="Efeito do ataque"
            rows={3}
            className={`${inputClass} resize-none`}
         />

      </div>
   );
};

const EnemyFormModal = ({ enemy, onSubmit }) => {
   const [imageError, setImageError] = useState(false);
   const [form, setForm] = useState(() => {
      const normalizedEnemy = normalizeEnemy(enemy);
      return enemy?.id ? normalizedEnemy : getAutofilledByYear(normalizedEnemy, normalizedEnemy.recommended_year);
   });
   const balance = getBalanceByYear(form.recommended_year);

   const applyBalanceForYear = (year) => {
      setForm((current) => getAutofilledByYear(current, year));
   };

   const handleYearChange = (year) => {
      applyBalanceForYear(Number(year));
   };

   const handleChange = (key, value) => {
      if (key === "image_url") setImageError(false);
      setForm((current) => ({ ...current, [key]: value }));
   };

   const handleSubmit = () => {
      onSubmit({
         ...(enemy || {}),
         ...form,
         hp: Number(form.hp || 0),
      });
   };

   return (
      <div className="space-y-5 text-xs text-purple-100/80">
         <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="h-[220px] border border-white/10 bg-white/5">
               {form.image_url && !imageError ? (
                  <img
                     src={form.image_url}
                     alt={form.name || "Preview"}
                     className="h-full w-full object-cover"
                     style={{ objectPosition: "center 15%" }}
                     onError={() => setImageError(true)}
                  />
               ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-white/40">
                     {form.image_url ? "Não foi possível carregar essa imagem." : "Preview da imagem"}
                  </div>
               )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
               <div className="md:col-span-2">
                  <label className={labelClass}>Nome</label>
                  <input value={form.name} onChange={(event) => handleChange("name", event.target.value)} className={inputClass} />
               </div>

               <div className="md:col-span-2">
                  <label className={labelClass}>URL da imagem</label>
                  <input type="url" value={form.image_url} onChange={(event) => handleChange("image_url", event.target.value)} placeholder="https://..." className={inputClass} />
               </div>

               <div>
                  <label className={labelClass}>Tipo</label>
                  <CustomSelect value={form.type} options={enemyTypeOptions.filter((item) => item !== "Todos")} onChange={(value) => handleChange("type", value)} />
               </div>

               <div>
                  <label className={labelClass}>Dificuldade</label>
                  <CustomSelect value={form.difficulty} options={difficultyOptions.filter((item) => item !== "Todos")} onChange={(value) => handleChange("difficulty", value)} />
               </div>

               <div>
                  <LabelWithInfo info={`Para ${balance.label}, use entre ${balance.hp_min} e ${balance.hp_max} de HP. O padrão automático é ${balance.hp_default}. Treinos e brinquedos podem ter menos.`}>HP</LabelWithInfo>
                  <input type="number" value={form.hp} onChange={(event) => handleChange("hp", Number(event.target.value || 0))} className={inputClass} />
               </div>

               <div>
                  <LabelWithInfo info="Ao trocar o ano, o formulário preenche automaticamente HP, dificuldade, dados e valores de ataque/defesa usando a curva balanceada.">Ano recomendado</LabelWithInfo>
                  <CustomSelect value={form.recommended_year} options={yearOptions} onChange={handleYearChange} />
               </div>

               <div className="md:col-span-2">
                  <label className={labelClass}>Local</label>
                  <input value={form.local} onChange={(event) => handleChange("local", event.target.value)} className={inputClass} />
               </div>
            </div>
         </div>

         <BalanceSummary balance={balance} />

         <div className={cardClass}>
            <div className="flex items-center justify-between gap-3"><p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">Defesa</p><button type="button" onClick={() => applyBalanceForYear(form.recommended_year)} className="text-[11px] text-yellow-400 transition hover:text-yellow-300">Preencher pelo ano</button></div>
            <div className="grid gap-3 md:grid-cols-2">
               <div>
                  <LabelWithInfo info="Atributo usado para resistir, esquivar, bloquear ou evitar ataques. Agilidade e Resistência são os mais comuns.">Atributo de defesa</LabelWithInfo>
                  <CustomSelect
                     value={form.defense.attribute}
                     options={attributeOptions}
                     onChange={(value) => handleChange("defense", { ...form.defense, attribute: value })}
                  />
               </div>

               <div>
                  <LabelWithInfo info={`Para ${balance.label}, use entre ${balance.attribute_min} e ${balance.attribute_max}. Defesa costuma ficar perto do ataque secundário.`}>Valor da defesa</LabelWithInfo>
                  <input
                     type="number"
                     value={form.defense.attribute_value}
                     onChange={(event) => handleChange("defense", { ...form.defense, attribute_value: clampAttributeValue(event.target.value) })}
                     className={inputClass}
                  />
               </div>
            </div>
         </div>

         <div className={cardClass}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-500">Dano de impacto</p>
            <p className="text-xs leading-5 text-purple-100/45">Usado no dano final quando o ataque vence a defesa: diferença + dado de impacto.</p>

            <div>
               <LabelWithInfo info={`Sugestão para ${balance.label}: ${balance.impact_die}. Treinos podem usar 1D4; criaturas perigosas usam 1D10 ou mais.`}>Dado de impacto</LabelWithInfo>
               <CustomSelect value={form.impact_die} options={diceOptions} onChange={(value) => handleChange("impact_die", value)} />
            </div>
         </div>

         <div className="grid gap-4 xl:grid-cols-2">
            <AttackFields title="Ataque principal" attack={form.main_attack} onChange={(value) => handleChange("main_attack", value)} balance={balance} />
            <AttackFields title="Ataque secundário" attack={form.secondary_attack} onChange={(value) => handleChange("secondary_attack", value)} allowDisable balance={balance} />
         </div>

         <div>
            <LabelWithInfo info="Descrição narrativa da criatura. Inclua fraquezas, estilo de combate, ambiente e condições especiais.">Características</LabelWithInfo>
            <textarea
               value={form.caracteristicas}
               onChange={(event) => handleChange("caracteristicas", event.target.value)}
               placeholder="Características"
               rows={4}
               className={`${inputClass} resize-none`}
            />
         </div>

         <button
            type="button"
            onClick={handleSubmit}
            className="bg-yellow-400 px-4 py-2 text-xs font-semibold text-[#2b0038] transition hover:bg-yellow-300"
         >
            Salvar adversário
         </button>
      </div>
   );
};

export default EnemyFormModal;
