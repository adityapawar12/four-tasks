import Input from "./Input";
import React from "react";
import TextArea from "./TextArea";
import Select from "./Select";
import RadioButtons from "./RadioButtons";
import CheckBoxGroup from "./CheckBoxGroup";
import DatePicker from "./DatePicker";
// import ChakraInput from "../ChakraInput";

const FormikControls = (props: any) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;

    case "textarea":
      return <TextArea {...rest} />;

    case "select":
      return <Select {...rest} />;

    case "radio":
      return <RadioButtons {...rest} />;

    case "checkbox":
      return <CheckBoxGroup {...rest} />;

    case "date":
      return <DatePicker {...rest} />;

    // case "chakrainput":
    //   return <ChakraInput {...rest} />;

    default:
      return null;
  }
};

export default FormikControls;
