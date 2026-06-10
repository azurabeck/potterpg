import { useState } from "react";
import { XMarkIcon, BoltIcon } from "@heroicons/react/24/outline";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   GoogleAuthProvider,
   sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../services/firebase";

const AuthModal = ({ open, onClose }) => {
   const [mode, setMode] = useState("login");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   if (!open) return null;

   const isLogin = mode === "login";
   const isRegister = mode === "register";
   const isRecovery = mode === "recovery";

   const clearMessages = () => {
      setError("");
      setSuccess("");
   };

   const handleChangeMode = (newMode) => {
      setMode(newMode);
      clearMessages();
   };

   const handleSubmit = async (event) => {
      event.preventDefault();

      setLoading(true);
      clearMessages();

      try {
         if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
            onClose();
            return;
         }

         if (isRegister) {
            await createUserWithEmailAndPassword(auth, email, password);
            onClose();
            return;
         }

         if (isRecovery) {
            await sendPasswordResetEmail(auth, email);
            setSuccess("E-mail de recuperação enviado.");
         }
      } catch (error) {
         console.error(error);
         setError("Não foi possível concluir a ação. Verifique os dados.");
      } finally {
         setLoading(false);
      }
   };

   const handleGoogleLogin = async () => {
      setLoading(true);
      clearMessages();

      try {
         const provider = new GoogleAuthProvider();
         await signInWithPopup(auth, provider);
         onClose();
      } catch (error) {
         console.error(error);
         setError("Não foi possível entrar com Google.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[999] bg-[#120018] text-white">
         <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20"
         >
            <XMarkIcon className="h-6 w-6" />
         </button>

         <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <section className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#2b0038] via-[#3d0052] to-[#09000d] p-12">
               <div className="flex items-center gap-3 text-yellow-400">
                  <BoltIcon className="h-8 w-8" />
                  <span className="text-2xl font-semibold">PotterRPG</span>
               </div>

               <div>
                  <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-400">
                     Campanhas mágicas
                  </p>

                  <h1 className="max-w-xl text-5xl font-bold leading-tight">
                     Salve sua ficha, campanhas, mistérios e progresso mágico.
                  </h1>

                  <p className="mt-6 max-w-lg text-gray-300">
                     O mundo canónico continua estático. O Firebase guarda apenas o que muda na sua jornada.
                  </p>
               </div>

               <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300">
                  “Lumos existe no catálogo. O XP do Tomas em Lumos vive no RPG.”
               </div>
            </section>

            <section className="flex items-center justify-center px-6 py-10">
               <div className="w-full max-w-md">
                  <div className="mb-8 lg:hidden flex items-center gap-3 text-yellow-400">
                     <BoltIcon className="h-7 w-7" />
                     <span className="text-2xl font-semibold">PotterRPG</span>
                  </div>

                  <div className="rounded-3xl border border-purple-900/80 bg-[#2b0038]/80 p-8 shadow-2xl backdrop-blur">
                     <p className="mb-2 text-sm text-yellow-400">
                        {isLogin && "Bem-vinda de volta"}
                        {isRegister && "Crie sua conta"}
                        {isRecovery && "Recupere sua senha"}
                     </p>

                     <h2 className="mb-6 text-3xl font-bold">
                        {isLogin && "Entrar no RPG"}
                        {isRegister && "Cadastrar jogador"}
                        {isRecovery && "Recuperar acesso"}
                     </h2>

                     {!isRecovery && (
                        <>
                           <button
                              type="button"
                              onClick={handleGoogleLogin}
                              disabled={loading}
                              className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3 font-semibold text-[#2b0038] hover:bg-gray-100 disabled:opacity-60"
                           >
                              <span className="text-lg">G</span>
                              Entrar com Google
                           </button>

                           <div className="mb-5 flex items-center gap-3 text-xs text-gray-400">
                              <div className="h-px flex-1 bg-white/10" />
                              ou use e-mail
                              <div className="h-px flex-1 bg-white/10" />
                           </div>
                        </>
                     )}

                     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                           <label className="mb-1 block text-sm text-gray-300">
                              E-mail
                           </label>

                           <input
                              type="email"
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              className="w-full rounded-xl border border-purple-800 bg-[#1b0024] px-4 py-3 text-white outline-none focus:border-yellow-400"
                              placeholder="seuemail@email.com"
                              required
                           />
                        </div>

                        {!isRecovery && (
                           <div>
                              <label className="mb-1 block text-sm text-gray-300">
                                 Senha
                              </label>

                              <input
                                 type="password"
                                 value={password}
                                 onChange={(event) => setPassword(event.target.value)}
                                 className="w-full rounded-xl border border-purple-800 bg-[#1b0024] px-4 py-3 text-white outline-none focus:border-yellow-400"
                                 placeholder="••••••••"
                                 required
                              />
                           </div>
                        )}

                        {isLogin && (
                           <button
                              type="button"
                              onClick={() => handleChangeMode("recovery")}
                              className="w-fit text-sm text-gray-300 hover:text-yellow-400"
                           >
                              Esqueci minha senha
                           </button>
                        )}

                        {error && (
                           <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                              {error}
                           </p>
                        )}

                        {success && (
                           <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-300">
                              {success}
                           </p>
                        )}

                        <button
                           type="submit"
                           disabled={loading}
                           className="mt-2 rounded-xl bg-yellow-400 px-4 py-3 font-bold text-[#2b0038] hover:bg-yellow-300 disabled:opacity-60"
                        >
                           {loading && "Carregando..."}
                           {!loading && isLogin && "Entrar"}
                           {!loading && isRegister && "Criar conta"}
                           {!loading && isRecovery && "Enviar recuperação"}
                        </button>
                     </form>

                     <div className="mt-6 flex flex-col gap-2 text-sm text-gray-300">
                        {isLogin && (
                           <button
                              type="button"
                              onClick={() => handleChangeMode("register")}
                              className="text-left hover:text-yellow-400"
                           >
                              Não tenho conta, quero cadastrar
                           </button>
                        )}

                        {isRegister && (
                           <button
                              type="button"
                              onClick={() => handleChangeMode("login")}
                              className="text-left hover:text-yellow-400"
                           >
                              Já tenho conta, quero entrar
                           </button>
                        )}

                        {isRecovery && (
                           <button
                              type="button"
                              onClick={() => handleChangeMode("login")}
                              className="text-left hover:text-yellow-400"
                           >
                              Voltar para login
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </div>
   );
};

export default AuthModal;