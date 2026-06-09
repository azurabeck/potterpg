export const converterTextoParaJson = (texto) => {
   const textoLimpo = texto
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

   return JSON.parse(textoLimpo);
};