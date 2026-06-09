export const obterCache = (chave) => {
    // Recupera e converte um valor armazenado no localStorage pela chave informada.
    // Motivo: Reutilizar dados já processados sem novas requisições.
   const valor = localStorage.getItem(chave);

   return valor ? JSON.parse(valor) : null;
};

export const salvarCache = (
   chave,
   valor
) => {
    // Salva um valor no localStorage convertendo-o para JSON.
    // Motivo: Reduzir chamadas futuras a APIs e melhorar o desempenho.
   localStorage.setItem(
      chave,
      JSON.stringify(valor)
   );
};

export const removerCache = (chave) => {
    // Remove um valor armazenado no localStorage pela chave informada.
    // Motivo: Permitir a atualização ou reinicialização dos dados em cache.
   localStorage.removeItem(chave);
};