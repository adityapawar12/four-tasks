import { ErrorMessage, Field } from "formik";
import React from "react";
import TextError from "./TextError";

const Input = ({ label, name, showLabel, ...rest }: any) => {
  return (
    <div className="form-control">
      {showLabel === true && <label htmlFor={name}>{label}</label>}
      <Field name={name} />
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default Input;
