import { useNavigate } from "react-router";

import TextError from "../TextError";
import { supabase } from "../../supabaseClient";
import { AuthUserInterface, useAuth } from "../../context/Auth";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import styles from "./index.module.css";

const Login = () => {
  const navigate = useNavigate();

  const userCont = useAuth();

  const getData = async (user: AuthUserInterface) => {
    let { data } = await supabase
      .from(`users`)
      .select(`*`)
      .eq(`email`, user.email);
    return data;
  };

  let initialValues: AuthUserInterface = {
    email: ``,
    password: ``,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(`Invalid Email Format!`)
      .required(`Email is required!`),
    password: Yup.string().required(`Password is required!`),
  });

  const onSubmit = (values: AuthUserInterface, onSubmitProps: any) => {
    getData(values)
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
          localStorage.setItem(`userLoginInfo`, JSON.stringify(userLoginInfo));
          onSubmitProps.setSubmitting(false);
          onSubmitProps.resetForm();
          userCont?.login(userLoginInfo);
          navigate(`/home`);
        }
      })
      .catch((err) => {});
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
              <h4 className={`font-semibold py-2 text-2xl`}>Login</h4>
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
                              <label htmlFor={`email`}>Email</label>
                            </div>
                            <div className={`basis-auto text-start px-7`}>
                              <Field
                                type={`email`}
                                className={`border-2 w-full p-2 rounded-sm`}
                                id={`email`}
                                name={`email`}
                                placeholder={`Email`}
                              />
                            </div>
                            <div className={`basis-auto text-start`}>
                              <ErrorMessage
                                name={`email`}
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

export default Login;
