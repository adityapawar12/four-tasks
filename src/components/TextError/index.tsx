const TextError = (props: any) => {
  return (
    <>
      <div className="flex justify-center align-baseline">
        <div className="text-white text-center w-1/2 text-xs bg-red-600 p-0.5 rounded-md">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default TextError;
