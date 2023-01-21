import TextError from "../TextError";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/Auth";
import { supabase } from "../../supabaseClient";
import { AuthLoginUserInterface, AuthUserInterface } from "../../models/Auth";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const userCont = useAuth();
  const [isEmailAlreadyExists, setIsEmailAlreadyExists] =
    useState<boolean>(false);

  const getDataDB = async (user: AuthUserInterface) => {
    let { data } = await supabase
      .from(`users`)
      .select(`*`)
      .eq(`email`, user.email);
    return data;
  };

  let initialValues: AuthUserInterface = {
    name: ``,
    email: ``,
    phone: ``,
    password: ``,
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object({
    name: Yup.string().required(`Name is required!`),
    email: Yup.string()
      .email(`Invalid Email Format!`)
      .required(`Email is required!`),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required(`Phone is required!`),
    password: Yup.string().required(`Password is required!`),
  });

  const onSubmit = (values: AuthUserInterface, onSubmitProps: any) => {
    getDataDB(values)
      .then(async (res: Array<AuthUserInterface> | null) => {
        if (res && res[0] && res[0].email === values.email) {
          setIsEmailAlreadyExists(true);
          return;
        }

        const { data, error } = await supabase.from("users").insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            password: values.password,
          },
        ]);
        if (!error) {
          getDataDB(values)
            .then((res: any) => {
              if (res && res.length < 1) {
                return;
              }
              if (
                res[0].email === values.email &&
                res[0].password === values.password
              ) {
                let userLoginInfo = res[0];
                delete userLoginInfo.password;
                localStorage.setItem(
                  `userLoginInfo`,
                  JSON.stringify(userLoginInfo)
                );
                onSubmitProps.setSubmitting(false);
                onSubmitProps.resetForm();
                userCont?.login(userLoginInfo);
                navigate(`/home`);
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err: any) => {});
  };

  return (
    <>
      <div
        className={`${styles.mainSvgPattern} flex flex-col sm:flex-row items-center justify-end h-screen`}
      >
        <div
          className={`${styles.mainSvgPatternOpp} text-center shadow-lg shadow-black text-slate-600 h-4/5 w-full sm:w-1/2 sm:h-screen`}
        >
          <div
            className={`flex flex-col justify-start sm:justify-center items-stretch h-full`}
          >
            <div className={`basis-auto mb-2`}>
              <h4 className={`font-semibold py-2 text-2xl`}>
                Create An Account
              </h4>
            </div>
            <div className={`basis-auto w-auto`}>
              <div>
                <Formik
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                  enableReinitialize
                >
                  {(formik) => {
                    return (
                      <div>
                        <Form>
                          <div className={`flex flex-col mb-3 w-full`}>
                            <div className={`basis-auto text-start px-7`}>
                              <label htmlFor={`name`}>Name</label>
                            </div>
                            <div className={`basis-auto text-start px-7`}>
                              <Field
                                type={`name`}
                                autoComplete={`off`}
                                className={`border-2 w-full p-2 rounded-sm`}
                                id={`name`}
                                name={`name`}
                                placeholder={`Name`}
                              />
                            </div>
                            <div className={`basis-auto text-start`}>
                              <ErrorMessage
                                name={`name`}
                                component={TextError}
                              />
                            </div>
                          </div>

                          <div className={`flex flex-col mb-3 w-full`}>
                            <div className={`basis-auto text-start px-7`}>
                              <label htmlFor={`email`}>Email</label>
                            </div>
                            <div className={`basis-auto text-start px-7`}>
                              <Field
                                type={`email`}
                                autoComplete={`off`}
                                className={`border-2 w-full p-2 rounded-sm`}
                                id={`email`}
                                onKeyUp={() => setIsEmailAlreadyExists(false)}
                                name={`email`}
                                placeholder={`Email`}
                              />
                            </div>
                            <div className={`basis-auto text-start`}>
                              <ErrorMessage
                                name={`email`}
                                component={TextError}
                              />
                              {isEmailAlreadyExists ? (
                                <div
                                  className={`flex justify-center align-baseline`}
                                >
                                  <div
                                    className={`text-white text-center w-11/12 text-xs bg-red-600 p-1 mt-2 rounded-2xl`}
                                  >
                                    Email already exists.
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className={`flex flex-col mb-3 w-full`}>
                            <div className={`basis-auto text-start px-7`}>
                              <label htmlFor={`phone`}>Phone</label>
                            </div>
                            <div className={`basis-auto text-start px-7`}>
                              <Field
                                type={`text`}
                                autoComplete={`off`}
                                className={`border-2 w-full p-2 rounded-sm`}
                                id={`phone`}
                                name={`phone`}
                                placeholder={`Phone`}
                              />
                            </div>
                            <div className={`basis-auto text-start`}>
                              <ErrorMessage
                                name={`phone`}
                                component={TextError}
                              />
                            </div>
                          </div>

                          <div className={`flex flex-col mb-3`}>
                            <div className={`basis-auto text-start px-7`}>
                              <label htmlFor={`password`}>Password</label>
                            </div>
                            <div className={`basis-auto text-start px-7`}>
                              <Field
                                type={`password`}
                                autoComplete={`off`}
                                className={`border-2 w-full p-2 rounded-sm`}
                                id={`password`}
                                name={`password`}
                                placeholder={`Password`}
                              />
                            </div>
                            <div className={`basis-auto text-start`}>
                              <ErrorMessage
                                name={`password`}
                                component={TextError}
                              />
                            </div>
                          </div>

                          <div className={`flex flex-row justify-center my-2`}>
                            <p className={`text-black`}>
                              Already have an account,
                              <span className={`text-violet-700 underline`}>
                                <Link to={"/login"}>Login</Link>
                              </span>
                            </p>
                          </div>

                          <div className={`flex flex-row justify-center my-2`}>
                            <button
                              className={`bg-cyan-500 text-white p-2 rounded-sm`}
                              type={`submit`}
                              disabled={
                                !formik.dirty &&
                                !formik.isValid &&
                                formik.isSubmitting
                              }
                            >
                              Submit
                            </button>
                          </div>
                        </Form>
                      </div>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
