const TextError: React.FC<any> = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <div className={`flex justify-center align-baseline`}>
        <div
          className={`text-white text-center w-11/12 text-xs bg-red-600 p-1 mt-2 rounded-2xl`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default TextError;
