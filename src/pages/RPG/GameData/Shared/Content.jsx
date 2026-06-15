import CharacterImage from "./CharacterImage";

const Content = ({ children, character }) => {
   return (
      <div className="mt-5 min-h-0 flex-1 border-t border-white/20 pt-4">
         <div className="grid h-full min-h-0 w-full grid-cols-1 md:grid-cols-12">
            <CharacterImage character={character} />

            <main className="col-span-1 min-h-0 px-4 py-6 pt-4 md:col-span-9 md:h-full md:overflow-y-auto md:px-12 md:pt-0">
               {children}
            </main>
         </div>
      </div>
   );
};

export default Content;