const EmptyContent = ({ children }) => {
   return (
      <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-purple-200/70">
         {children}
      </div>
   );
};

export default EmptyContent;
