import TextError from "./TextError";
import { ErrorMessage, Field } from "formik";
import React from "react";

const CheckBoxGroup = ({ label, name, options, showLabel, ...rest }: any) => {
  return (
    <div>
      {showLabel === true && <label htmlFor={name}>{label}</label>}
      <Field name={name} id={name} {...rest}>
        {({ field }: any) => {
          return options.map((option: any) => {
            return (
              <React.Fragment key={option.key}>
                <input
                  type="checkbox"
                  id={option.value}
                  {...field}
                  value={option.value}
                  checked={field.value.includes(option.value)}
                ></input>
                <label htmlFor={option.value}>{option.key}</label>
              </React.Fragment>
            );
          });
        }}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default CheckBoxGroup;
