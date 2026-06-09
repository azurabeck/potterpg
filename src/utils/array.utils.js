// src/utils/array.utils.js

export const dividirEmLotes = (
   lista,
   tamanhoLote
) => {
    // Divide uma lista em múltiplos lotes de tamanho definido.
    // Motivo: evitar processamentos muito grandes de uma só vez.
   const lotes = [];

   for (
      let indice = 0;
      indice < lista.length;
      indice += tamanhoLote
   ) {
      lotes.push(
         lista.slice(
            indice,
            indice + tamanhoLote
         )
      );
   }

   return lotes;
};