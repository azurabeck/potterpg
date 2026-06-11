import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../../services/firebase";
import CustomSelect from "../../../../components/CustomSelect";
import { createCharacter } from "../../../../services/rpg/character.service";

const atributosIniciais = {
   Coragem: 0,
   Inteligência: 0,
   Agilidade: 0,
   Carisma: 0,
   Percepção: 0,
   Sorte: 0,
   Magia: 0,
   Resistência: 0,
   Ataque: 0,
   Proteção: 0,
   Precisão: 0,
   Controle: 0,
   "Magia Antiga": 0,
   Liderança: 0,
   "Aprendizado Mágico": 0,
   Persuasão: 0,
   Astucia: 0,
   Equilibrio: 0,
};

const dinheiroPorCasa = {
   Grifinória: { galeoes: 7, sicles: 10, nuques: 20 },
   "Lufa-Lufa": { galeoes: 6, sicles: 15, nuques: 25 },
   Corvinal: { galeoes: 8, sicles: 8, nuques: 18 },
   Sonserina: { galeoes: 10, sicles: 5, nuques: 10 },
};

const houseOptions = ["Grifinória", "Lufa-Lufa", "Corvinal", "Sonserina"];
const yearOptions = [1, 2, 3, 4, 5, 6, 7].map((year) => ({ value: String(year), label: `${year}º ano` }));
const playerTypeOptions = [
   { value: "puro", label: "Puro" },
   { value: "nascido trouxa", label: "Nascido trouxa" },
   { value: "mestiço", label: "Mestiço" },
];
const animalOptions = [
   { value: "sapo", label: "Sapo" },
   { value: "gato", label: "Gato" },
   { value: "coruja", label: "Coruja" },
];
const npcTypeOptions = ["Aluno", "Professor", "Criatura", "Visitante", "Outro"];
const relationOptions = ["Amigo", "Inimigo", "Suspeito", "Conhecido", "Mistério"];
const wandWoodOptions = [
   { value: "teixo", label: "Teixo" },
   { value: "azevinho", label: "Azevinho" },
];
const wandCoreOptions = [
   { value: "corda de coração de dragão", label: "Corda de coração de dragão" },
   { value: "pelo de unicórnio", label: "Pelo de unicórnio" },
   { value: "pena de fênix", label: "Pena de fênix" },
];
const wandAttributeOptions = [
   { value: "ataque", label: "Ataque" },
   { value: "proteção", label: "Proteção" },
   { value: "precisão", label: "Precisão" },
   { value: "controle", label: "Controle" },
   { value: "magia", label: "Magia" },
];

const CreateCharacter = () => {
   const navigate = useNavigate();

   const [form, setForm] = useState({
      character_type: "player",
      name: "",
      image_url: "",
      casa: "Corvinal",
      ano: "1",
      tipo: "mestiço",
      nascimento: "",
      animal: "coruja",
      varinha: {
         madeira: "azevinho",
         miolo: "pena de fênix",
         atributo: "magia",
      },
      atributos: atributosIniciais,
      npc_tipo: "Aluno",
      npc_tipo_outro: "",
      detalhes: "",
      relacao: "Conhecido",
      confianca: "0",
      amizade: "0",
      caracteristicas: "",
      personalidade: "",
      relacionado: "",
   });

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [imageError, setImageError] = useState(false);

   const isNpc = form.character_type === "npc";
   const totalPontos = Object.values(form.atributos).reduce((total, valor) => total + Number(valor), 0);
   const pontosRestantes = 15 - totalPontos;

   const inputClass = "w-full border border-white/10 bg-[#1b0024] px-4 py-3 text-white outline-none transition focus:border-yellow-400";
   const labelClass = "mb-2 block text-sm text-gray-300";
   const sectionClass = "border border-white/10 bg-white/[0.04] p-5 shadow-lg";

   const handleChange = (field, value) => {
      if (field === "image_url") setImageError(false);
      setForm((current) => ({ ...current, [field]: value }));
   };

   const handleWandChange = (field, value) => {
      setForm((current) => ({
         ...current,
         varinha: { ...current.varinha, [field]: value },
      }));
   };

   const handleAttributeChange = (attribute, value) => {
      const numericValue = Number(value);
      if (numericValue < 0 || numericValue > 10) return;

      if (!isNpc) {
         const currentValue = Number(form.atributos[attribute]);
         const nextTotal = totalPontos - currentValue + numericValue;
         if (numericValue > 5 || nextTotal > 15) return;
      }

      setForm((current) => ({
         ...current,
         atributos: { ...current.atributos, [attribute]: numericValue },
      }));
   };

   const handleNumberChange = (field, value) => {
      if (!/^\d*$/.test(value)) return;
      const numberValue = Number(value || 0);
      if (numberValue < 0 || numberValue > 10) return;
      handleChange(field, value);
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      setError("");

      if (!form.name.trim()) {
         setError("Informe o nome do personagem.");
         return;
      }

      if (!isNpc && totalPontos !== 15) {
         setError("Você precisa distribuir exatamente 15 pontos.");
         return;
      }

      const user = auth.currentUser;

      if (!user) {
         setError("Você precisa estar logada para criar um personagem.");
         return;
      }

      const npcTipo = form.npc_tipo === "Outro" ? form.npc_tipo_outro : form.npc_tipo;

      const character = isNpc
         ? {
              user_id: user.uid,
              character_type: "npc",
              name: form.name,
              image_url: form.image_url,
              ano: Number(form.ano),
              tipo: npcTipo,
              casa: form.casa,
              atributos: form.atributos,
              detalhes: form.detalhes,
              relacao: form.relacao,
              confianca: Number(form.confianca || 0),
              amizade: Number(form.amizade || 0),
              caracteristicas: form.caracteristicas,
              personalidade: form.personalidade,
              relacionado: form.relacionado,
           }
         : {
              user_id: user.uid,
              character_type: "player",
              name: form.name,
              casa: form.casa,
              ano: Number(form.ano),
              tipo: form.tipo,
              nascimento: form.nascimento,
              animal: form.animal,
              varinha: form.varinha,
              atributos: form.atributos,
              dinheiro: dinheiroPorCasa[form.casa],
              image_url: form.image_url,
           };

      try {
         setLoading(true);
         await createCharacter({ user_id: user.uid, character });
         navigate("/rpg/sheet");
      } catch (error) {
         console.error(error);
         setError("Não foi possível criar o personagem.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="mx-auto max-w-6xl">
         <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">Nova ficha</p>
            <h2 className="mt-2 text-3xl font-bold">Criar personagem</h2>
            <p className="mt-2 text-gray-300">
               Monte a base inicial da ficha. O progresso, XP, campanhas e relações serão atualizados durante o RPG.
            </p>
         </div>

         <form onSubmit={handleSubmit} className="grid gap-6">
            <section className={sectionClass}>
               <h3 className="mb-5 text-xl font-semibold text-yellow-400">Tipo de ficha</h3>

               <div className="grid gap-4 md:grid-cols-2">
                  <button
                     type="button"
                     onClick={() => handleChange("character_type", "player")}
                     className={`border px-4 py-4 text-left transition ${
                        !isNpc ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "border-white/10 bg-[#1b0024] text-white/70"
                     }`}
                  >
                     Jogador
                  </button>

                  <button
                     type="button"
                     onClick={() => handleChange("character_type", "npc")}
                     className={`border px-4 py-4 text-left transition ${
                        isNpc ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "border-white/10 bg-[#1b0024] text-white/70"
                     }`}
                  >
                     NPC
                  </button>
               </div>
            </section>

            <section className={sectionClass}>
               <h3 className="mb-5 text-xl font-semibold text-yellow-400">Identidade</h3>

               <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
                  <div className="border border-white/10 bg-[#1b0024] p-3">
                     <div className="h-[265px] border border-white/10 bg-[#0e0014]">
                        {form.image_url && !imageError ? (
                           <img
                              src={form.image_url}
                              alt="Preview do personagem"
                              className="h-full w-full object-cover"
                              onError={() => setImageError(true)}
                           />
                        ) : (
                           <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
                              {form.image_url ? "Não foi possível carregar essa imagem." : "Cole uma URL de imagem para visualizar o personagem."}
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                     <div className="md:col-span-2">
                        <label className={labelClass}>URL da imagem</label>
                        <input
                           type="url"
                           value={form.image_url}
                           onChange={(event) => handleChange("image_url", event.target.value)}
                           placeholder="https://..."
                           className={inputClass}
                        />
                     </div>

                     <div>
                        <label className={labelClass}>Nome</label>
                        <input
                           value={form.name}
                           onChange={(event) => handleChange("name", event.target.value)}
                           placeholder={isNpc ? "Alya Carter" : "Tomas Finch"}
                           className={inputClass}
                           required
                        />
                     </div>

                     <div>
                        <label className={labelClass}>Ano</label>
                        <CustomSelect value={form.ano} options={yearOptions} onChange={(value) => handleChange("ano", value)} />
                     </div>

                     {isNpc ? (
                        <>
                           <div>
                              <label className={labelClass}>Tipo</label>
                              <CustomSelect value={form.npc_tipo} options={npcTypeOptions} onChange={(value) => handleChange("npc_tipo", value)} />
                           </div>

                           {form.npc_tipo === "Outro" ? (
                              <div>
                                 <label className={labelClass}>Tipo personalizado</label>
                                 <input
                                    value={form.npc_tipo_outro}
                                    onChange={(event) => handleChange("npc_tipo_outro", event.target.value)}
                                    placeholder="Ex: Fantasma, Retrato..."
                                    className={inputClass}
                                 />
                              </div>
                           ) : null}

                           <div>
                              <label className={labelClass}>Casa</label>
                              <CustomSelect value={form.casa} options={["", ...houseOptions].map((house) => ({ value: house, label: house || "Sem casa" }))} onChange={(value) => handleChange("casa", value)} />
                           </div>
                        </>
                     ) : (
                        <>
                           <div>
                              <label className={labelClass}>Nascimento</label>
                              <input
                                 type="date"
                                 value={form.nascimento}
                                 onChange={(event) => handleChange("nascimento", event.target.value)}
                                 className={inputClass}
                                 required
                              />
                           </div>

                           <div>
                              <label className={labelClass}>Casa</label>
                              <CustomSelect value={form.casa} options={houseOptions} onChange={(value) => handleChange("casa", value)} />
                           </div>

                           <div>
                              <label className={labelClass}>Tipo</label>
                              <CustomSelect value={form.tipo} options={playerTypeOptions} onChange={(value) => handleChange("tipo", value)} />
                           </div>

                           <div>
                              <label className={labelClass}>Animal</label>
                              <CustomSelect value={form.animal} options={animalOptions} onChange={(value) => handleChange("animal", value)} />
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </section>

            {isNpc ? (
               <section className={sectionClass}>
                  <h3 className="mb-5 text-xl font-semibold text-yellow-400">Relação</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                     <div>
                        <label className={labelClass}>Relação</label>
                        <CustomSelect value={form.relacao} options={relationOptions} onChange={(value) => handleChange("relacao", value)} />
                     </div>

                     <div>
                        <label className={labelClass}>Relacionado ao character_id</label>
                        <input
                           value={form.relacionado}
                           onChange={(event) => handleChange("relacionado", event.target.value)}
                           placeholder="ID do personagem relacionado"
                           className={inputClass}
                        />
                     </div>

                     <div>
                        <label className={labelClass}>Confiança: {form.confianca}/10</label>
                        <input
                           type="number"
                           min="0"
                           max="10"
                           value={form.confianca}
                           onChange={(event) => handleNumberChange("confianca", event.target.value)}
                           className={inputClass}
                        />
                     </div>

                     <div>
                        <label className={labelClass}>Amizade: {form.amizade}/10</label>
                        <input
                           type="number"
                           min="0"
                           max="10"
                           value={form.amizade}
                           onChange={(event) => handleNumberChange("amizade", event.target.value)}
                           className={inputClass}
                        />
                     </div>

                     <div className="md:col-span-2">
                        <label className={labelClass}>Características</label>
                        <textarea
                           value={form.caracteristicas}
                           onChange={(event) => handleChange("caracteristicas", event.target.value)}
                           rows={3}
                           placeholder="Características físicas, marcas, estilo, aparência..."
                           className={`${inputClass} resize-none`}
                        />
                     </div>

                     <div className="md:col-span-2">
                        <label className={labelClass}>Personalidade</label>
                        <textarea
                           value={form.personalidade}
                           onChange={(event) => handleChange("personalidade", event.target.value)}
                           rows={3}
                           placeholder="Como age, como fala, traços marcantes..."
                           className={`${inputClass} resize-none`}
                        />
                     </div>

                     <div className="md:col-span-2">
                        <label className={labelClass}>Detalhes</label>
                        <textarea
                           value={form.detalhes}
                           onChange={(event) => handleChange("detalhes", event.target.value)}
                           rows={4}
                           placeholder="História, observações, relação com mistérios, informações importantes..."
                           className={`${inputClass} resize-none`}
                        />
                     </div>
                  </div>
               </section>
            ) : (
               <section className={sectionClass}>
                  <h3 className="mb-5 text-xl font-semibold text-yellow-400">Varinha</h3>

                  <div className="grid gap-4 md:grid-cols-3">
                     <div>
                        <label className={labelClass}>Madeira</label>
                        <CustomSelect value={form.varinha.madeira} options={wandWoodOptions} onChange={(value) => handleWandChange("madeira", value)} />
                     </div>

                     <div>
                        <label className={labelClass}>Miolo</label>
                        <CustomSelect value={form.varinha.miolo} options={wandCoreOptions} onChange={(value) => handleWandChange("miolo", value)} />
                     </div>

                     <div>
                        <label className={labelClass}>Atributo da varinha</label>
                        <CustomSelect value={form.varinha.atributo} options={wandAttributeOptions} onChange={(value) => handleWandChange("atributo", value)} />
                     </div>
                  </div>
               </section>
            )}

            <section className={sectionClass}>
               <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                     <h3 className="text-xl font-semibold text-yellow-400">Atributos</h3>
                     <p className="mt-1 text-sm text-gray-400">
                        {isNpc ? "Defina os atributos do NPC. Máximo de 10 por atributo." : "Distribua 15 pontos. Máximo de 5 por atributo."}
                     </p>
                  </div>

                  {!isNpc ? (
                     <div className="text-right">
                        <p className={totalPontos === 15 ? "text-sm font-bold text-green-300" : "text-sm font-bold text-yellow-400"}>
                           {totalPontos}/15 pontos
                        </p>
                        <p className="text-xs text-gray-400">Restam {pontosRestantes} ponto(s)</p>
                     </div>
                  ) : null}
               </div>

               <div className="grid gap-3 md:grid-cols-3">
                  {Object.keys(form.atributos).map((attribute) => (
                     <label key={attribute} className="flex items-center justify-between border border-white/10 bg-[#1b0024] px-4 py-3">
                        <span className="text-sm">{attribute}</span>

                        <input
                           type="number"
                           min="0"
                           max={isNpc ? "10" : "5"}
                           value={form.atributos[attribute]}
                           onChange={(event) => handleAttributeChange(attribute, event.target.value)}
                           className="w-16 border border-white/10 bg-[#0e0014] px-2 py-1 text-center outline-none focus:border-yellow-400"
                        />
                     </label>
                  ))}
               </div>
            </section>

            {error ? (
               <p className="border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-300">
                  {error}
               </p>
            ) : null}

            <div className="flex justify-end gap-3">
               <button
                  type="button"
                  onClick={() => navigate("/rpg/sheet")}
                  className="border border-white/15 px-6 py-3 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
               >
                  Cancelar
               </button>

               <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 px-6 py-3 font-bold text-[#2b0038] hover:bg-yellow-300 disabled:opacity-60"
               >
                  {loading ? "Criando..." : isNpc ? "Criar NPC" : "Criar personagem"}
               </button>
            </div>
         </form>
      </div>
   );
};

export default CreateCharacter;