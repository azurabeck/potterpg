const CharacterImage = ({ character }) => {
   return (
      <aside className="relative col-span-3 h-full min-h-0 overflow-hidden bg-[#21002b]">
         <img
            src={character.image_url || "https://placehold.co/520x700"}
            alt={character.name}
            className="h-full w-full object-cover"
         />

         <div className="absolute inset-0 bg-gradient-to-t from-[#30003f] via-[#30003f]/35 to-transparent" />

         <div className="absolute bottom-6 left-6 right-6 text-center">
            <h2 className="text-2xl font-semibold">{character.name}</h2>

            <p className="mt-1 text-sm text-[#736868]">
               {character.casa} • {character.ano}º Ano • Sangue {character.tipo}
            </p>
         </div>
      </aside>
   );
};

export default CharacterImage;