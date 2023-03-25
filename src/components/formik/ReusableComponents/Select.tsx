import { ErrorMessage, Field } from "formik";
import React from "react";
import TextError from "./TextError";

const Select = ({ name, options, label, showLabel, ...rest }: any) => {
  React.useEffect(() => {
    console.log(options);
  }, []);

  return (
    <div>
      {showLabel === true && <label htmlFor={name}>{label}</label>}
      <Field className={`w-full`} as="select" name={name} id={name} {...rest}>
        {options.map((option: any, index: any) => {
          return (
            <option key={index} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default Select;
