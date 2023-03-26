import { ErrorMessage, Field } from "formik";
import React from "react";
import TextError from "./TextError";

const TextArea = ({ name, label, ...rest }: any) => {
  return (
    <div>
      <label className={`w-full`} htmlFor={name}>
        {label}
      </label>
      <Field
        className={`w-full`}
        id={name}
        name={name}
        {...rest}
        as={`textarea`}
      />
      <ErrorMessage className={`w-full`} name={name} component={TextError} />
    </div>
  );
};

export default TextArea;
