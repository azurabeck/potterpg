import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../../services/firebase";
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

const CreateCharacter = () => {
   const navigate = useNavigate();

   const [form, setForm] = useState({
      name: "",
      image_url: "",
      casa: "Corvinal",
      ano: "1",
      tipo: "mestiço",
      nascimento: "",
      animal: "coruja",
      varinha: {
         madeira: "azevinho",
         miolo: "pena de fenix",
         atributo: "magia",
      },
      atributos: atributosIniciais,
   });

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [imageError, setImageError] = useState(false);

   const totalPontos = Object.values(form.atributos).reduce(
      (total, valor) => total + Number(valor),
      0
   );

   const pontosRestantes = 15 - totalPontos;

   const inputClass =
      "w-full border border-white/10 bg-[#1b0024] px-4 py-3 text-white outline-none transition focus:border-yellow-400";

   const labelClass = "mb-2 block text-sm text-gray-300";

   const sectionClass = "border border-white/10 bg-white/[0.04] p-5 shadow-lg";

   const handleChange = (field, value) => {
      if (field === "image_url") {
         setImageError(false);
      }

      setForm((current) => ({
         ...current,
         [field]: value,
      }));
   };

   const handleWandChange = (field, value) => {
      setForm((current) => ({
         ...current,
         varinha: {
            ...current.varinha,
            [field]: value,
         },
      }));
   };

   const handleAttributeChange = (attribute, value) => {
      const numericValue = Number(value);

      if (numericValue < 0 || numericValue > 5) return;

      const currentValue = Number(form.atributos[attribute]);
      const nextTotal = totalPontos - currentValue + numericValue;

      if (nextTotal > 15) return;

      setForm((current) => ({
         ...current,
         atributos: {
            ...current.atributos,
            [attribute]: numericValue,
         },
      }));
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      setError("");

      if (totalPontos !== 15) {
         setError("Você precisa distribuir exatamente 15 pontos.");
         return;
      }

      const user = auth.currentUser;

      if (!user) {
         setError("Você precisa estar logada para criar um personagem.");
         return;
      }

      try {
         setLoading(true);

         await createCharacter({
            user_id: user.uid,
            character: {
               user_id: user.uid,
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
            },
         });

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
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
               Nova ficha
            </p>

            <h2 className="mt-2 text-3xl font-bold">
               Criar personagem
            </h2>

            <p className="mt-2 text-gray-300">
               Monte a base inicial da ficha. O progresso, XP, campanhas e relações serão atualizados durante o RPG.
            </p>
         </div>

         <form onSubmit={handleSubmit} className="grid gap-6">
            <section className={sectionClass}>
               <h3 className="mb-5 text-xl font-semibold text-yellow-400">
                  Identidade
               </h3>

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
                              {form.image_url
                                 ? "Não foi possível carregar essa imagem."
                                 : "Cole uma URL de imagem para visualizar o personagem."}
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
                           onChange={(event) =>
                              handleChange("image_url", event.target.value)
                           }
                           placeholder="https://..."
                           className={inputClass}
                        />
                     </div>

                     <div>
                        <label className={labelClass}>Nome do personagem</label>
                        <input
                           value={form.name}
                           onChange={(event) =>
                              handleChange("name", event.target.value)
                           }
                           placeholder="Tomas Finch"
                           className={inputClass}
                           required
                        />
                     </div>

                     <div>
                        <label className={labelClass}>Nascimento</label>
                        <input
                           type="date"
                           value={form.nascimento}
                           onChange={(event) =>
                              handleChange("nascimento", event.target.value)
                           }
                           className={inputClass}
                           required
                        />
                     </div>

                     <div>
                        <label className={labelClass}>Casa</label>
                        <select
                           value={form.casa}
                           onChange={(event) =>
                              handleChange("casa", event.target.value)
                           }
                           className={inputClass}
                        >
                           <option>Grifinória</option>
                           <option>Lufa-Lufa</option>
                           <option>Corvinal</option>
                           <option>Sonserina</option>
                        </select>
                     </div>

                     <div>
                        <label className={labelClass}>Ano</label>
                        <select
                           value={form.ano}
                           onChange={(event) =>
                              handleChange("ano", event.target.value)
                           }
                           className={inputClass}
                        >
                           {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                              <option key={year} value={year}>
                                 {year}º ano
                              </option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className={labelClass}>Tipo</label>
                        <select
                           value={form.tipo}
                           onChange={(event) =>
                              handleChange("tipo", event.target.value)
                           }
                           className={inputClass}
                        >
                           <option value="puro">Puro</option>
                           <option value="nascido trouxa">Nascido trouxa</option>
                           <option value="mestiço">Mestiço</option>
                        </select>
                     </div>

                     <div>
                        <label className={labelClass}>Animal</label>
                        <select
                           value={form.animal}
                           onChange={(event) =>
                              handleChange("animal", event.target.value)
                           }
                           className={inputClass}
                        >
                           <option value="sapo">Sapo</option>
                           <option value="gato">Gato</option>
                           <option value="coruja">Coruja</option>
                        </select>
                     </div>
                  </div>
               </div>
            </section>

            <section className={sectionClass}>
               <h3 className="mb-5 text-xl font-semibold text-yellow-400">
                  Varinha
               </h3>

               <div className="grid gap-4 md:grid-cols-3">
                  <div>
                     <label className={labelClass}>Madeira</label>
                     <select
                        value={form.varinha.madeira}
                        onChange={(event) =>
                           handleWandChange("madeira", event.target.value)
                        }
                        className={inputClass}
                     >
                        <option value="teixo">Teixo</option>
                        <option value="azevinho">Azevinho</option>
                     </select>
                  </div>

                  <div>
                     <label className={labelClass}>Miolo</label>
                     <select
                        value={form.varinha.miolo}
                        onChange={(event) =>
                           handleWandChange("miolo", event.target.value)
                        }
                        className={inputClass}
                     >
                        <option value="corda de coração de dragão">
                           Corda de coração de dragão
                        </option>
                        <option value="pelo de unicórnio">
                           Pelo de unicórnio
                        </option>
                        <option value="pena de fênix">Pena de fênix</option>
                     </select>
                  </div>

                  <div>
                     <label className={labelClass}>Atributo da varinha</label>
                     <select
                        value={form.varinha.atributo}
                        onChange={(event) =>
                           handleWandChange("atributo", event.target.value)
                        }
                        className={inputClass}
                     >
                        <option value="ataque">Ataque</option>
                        <option value="proteção">Proteção</option>
                        <option value="precisão">Precisão</option>
                        <option value="controle">Controle</option>
                        <option value="magia">Magia</option>
                     </select>
                  </div>
               </div>
            </section>

            <section className={sectionClass}>
               <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                     <h3 className="text-xl font-semibold text-yellow-400">
                        Atributos
                     </h3>

                     <p className="mt-1 text-sm text-gray-400">
                        Distribua 15 pontos. Máximo de 5 por atributo.
                     </p>
                  </div>

                  <div className="text-right">
                     <p
                        className={
                           totalPontos === 15
                              ? "text-sm font-bold text-green-300"
                              : "text-sm font-bold text-yellow-400"
                        }
                     >
                        {totalPontos}/15 pontos
                     </p>

                     <p className="text-xs text-gray-400">
                        Restam {pontosRestantes} ponto(s)
                     </p>
                  </div>
               </div>

               <div className="grid gap-3 md:grid-cols-3">
                  {Object.keys(form.atributos).map((attribute) => (
                     <label
                        key={attribute}
                        className="flex items-center justify-between border border-white/10 bg-[#1b0024] px-4 py-3"
                     >
                        <span className="text-sm">{attribute}</span>

                        <input
                           type="number"
                           min="0"
                           max="5"
                           value={form.atributos[attribute]}
                           onChange={(event) =>
                              handleAttributeChange(attribute, event.target.value)
                           }
                           className="w-16 border border-white/10 bg-[#0e0014] px-2 py-1 text-center outline-none focus:border-yellow-400"
                        />
                     </label>
                  ))}
               </div>
            </section>

            {error && (
               <p className="border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-300">
                  {error}
               </p>
            )}

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
                  {loading ? "Criando..." : "Criar personagem"}
               </button>
            </div>
         </form>
      </div>
   );
};

export default CreateCharacter;