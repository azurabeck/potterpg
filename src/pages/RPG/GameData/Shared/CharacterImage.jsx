const CharacterImage = ({ character }) => {
   return (
      <aside className="relative col-span-1 h-[190px] min-h-0 overflow-hidden bg-[#21002b] md:col-span-3 md:h-full">
         <img
            src={character.image_url || "https://placehold.co/520x700"}
            alt={character.name}
            className="h-full w-full object-cover object-top"
         />

         <div className="absolute inset-0 bg-gradient-to-t from-[#30003f] via-[#30003f]/35 to-transparent" />

         <div className="absolute bottom-4 left-4 right-4 text-center md:bottom-6 md:left-6 md:right-6">
            <h2 className="text-xl font-semibold md:text-2xl">{character.name}</h2>

            <p className="mt-1 text-xs text-[#9a7f7f] md:text-sm md:text-[#736868]">
               {character.casa} • {character.ano}º Ano • Sangue {character.tipo}
            </p>
         </div>
      </aside>
   );
};

export default CharacterImage;
