const TextError = (props: any) => {
  return (
    <>
      <div className="flex justify-center align-baseline">
        <div className="text-white text-center w-11/12 text-xs bg-red-600 p-1 mt-2 rounded-xl">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default TextError;
