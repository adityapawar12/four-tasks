import { ErrorMessage, Field } from "formik";
import React from "react";
import TextError from "./TextError";

const Input = ({ label, name, showLabel, ...rest }: any) => {
  return (
    <div className="form-control">
      {showLabel === true && (
        <label className={`w-full`} htmlFor={name}>
          {label}
        </label>
      )}
      <Field className={`w-full`} name={name} {...rest} />
      <ErrorMessage className={`w-full`} name={name} component={TextError} />
    </div>
  );
};

export default Input;
