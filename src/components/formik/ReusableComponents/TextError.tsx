import React from "react";

const TextError = (props: any) => {
  return (
    <div className={`w-full`} style={{ color: "red" }}>
      {props.children}
    </div>
  );
};

export default TextError;
