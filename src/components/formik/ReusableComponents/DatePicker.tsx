import { ErrorMessage, Field } from "formik";
import DateView from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextError from "./TextError";
import React from "react";

const DatePicker = ({ name, label, showLabel, ...rest }: any) => {
  return (
    <div>
      {showLabel === true && (
        <label className={`w-full`} htmlFor={name}>
          {label}
        </label>
      )}
      <Field className={`w-full`} name={name}>
        {({ form, field }: any) => {
          const { setFieldValue } = form;
          const { value } = field;
          return (
            <DateView
              className={`w-full`}
              name={name}
              {...field}
              {...rest}
              selected={value}
              onChange={(val: any) => {
                setFieldValue(name, val);
              }}
            />
          );
        }}
      </Field>
      <ErrorMessage className={`w-full`} name={name} component={TextError} />
    </div>
  );
};

export default DatePicker;
