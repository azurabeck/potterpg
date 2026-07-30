// Heroicons (o único set de ícones deste projeto) não tem espada — ícone
// próprio, desenhado no mesmo estilo outline (stroke 1.5, viewBox 24x24)
// pra combinar com PencilSquareIcon/TrashIcon usados ao lado dele.
const SwordIcon = (props) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
   >
      <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M14.5 3.5 20.5 9.5M14.5 3.5 4 14v3.5H7.5L18 7M14.5 3.5 18 7M4 20l3-3"
      />
   </svg>
);

export default SwordIcon;
