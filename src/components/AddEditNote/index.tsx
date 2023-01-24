import { ChangeEvent, useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import { Formik, Form, Field, FormikFormProps } from "formik";

import { supabase } from "../../supabaseClient";
import { useNote } from "../../context/AddEditNote";
import { NoteInterface } from "../../models/Note";

Modal.setAppElement("#root");
const AddEditNote = () => {
  const noteContext = useNote();

  const [isAddNoteFormOpen, setIsAddNoteFormOpen] = useState<boolean>(false);
  const [addNoteFormValues, setAddNoteFormValues] =
    useState<NoteInterface | null>(null);
  let addNoteInitialValues: NoteInterface = {
    title: ``,
    description: ``,
    user_id: 0,
  };
  const addNoteValidationSchema = Yup.object({
    title: Yup.string(),
    description: Yup.string(),
  });
  const addNoteDB = async (note: NoteInterface | null) => {
    if (!note) {
      return;
    }

    if (!note.user_id) {
      note.user_id = await JSON.parse(
        localStorage.getItem("userLoginInfo") || ""
      ).id;
    }

    const { data, error } = await supabase.from("notes").insert([
      {
        title: note?.title || "",
        description: note?.description || "",
        user_id: note?.user_id,
      },
    ]);

    noteContext?.toggleIsNoteAdded();
  };

  const [isEditNoteTypePopupOpen, setIsEditNoteTypePopupOpen] =
    useState<boolean>(false);
  const [isEditNoteFormOpen, setIsEditNoteFormOpen] = useState<boolean>(false);
  const [editNoteFormValues, setEditNoteFormValues] =
    useState<NoteInterface | null>(null);
  let editNoteInitialValues: NoteInterface = {
    id: 0,
    title: ``,
    description: ``,
    user_id: 0,
  };
  const editNoteValidationSchema = Yup.object({
    title: Yup.string(),
    description: Yup.string(),
  });
  const editNoteDB = async (note: NoteInterface | null) => {
    const { data, error } = await supabase
      .from("notes")
      .update([
        {
          title: note?.title || "",
          description: note?.description || "",
          user_id: note?.user_id,
        },
      ])
      .eq("id", editNoteFormValues?.id);

    noteContext?.setEditNote(null);
    noteContext?.toggleIsEditingNote();
  };

  const [descriptionHeight, setDescriptionHeight] = useState<
    string | number | any
  >("auto");
  const [descriptionOverflow, setDescriptionOverflow] =
    useState<string>("hidden");

  const customStyles = {
    overlay: {
      background: `rgba(0, 0, 0, 0)`,
    },
    content: {
      top: `50%`,
      left: `50%`,
      right: `auto`,
      bottom: `auto`,
      marginRight: `-50%`,
      padding: `10px`,
      boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
      border: `0`,
      borderRadius: `1.5rem`,
      transform: `translate(-50%, -50%)`,
    },
  };
  const customStylesInput = {
    overlay: {
      background: `rgba(255, 255, 255, 0.2)`,
    },
    content: {
      top: `50%`,
      left: `50%`,
      right: `auto`,
      bottom: `auto`,
      width: `23rem`,
      marginRight: `-50%`,
      padding: `0px 0px`,
      boxShadow: `0 1px 2px 0 rgba(60,64,67,0.302),0 2px 6px 2px rgba(60,64,67,0.149)`,
      border: `0`,
      borderRadius: `1rem`,
      transform: `translate(-50%, -50%)`,
    },
  };

  useEffect(() => {
    if (descriptionHeight > window.innerHeight * 0.75) {
      setDescriptionOverflow("auto");
    } else {
      setDescriptionOverflow("hidden");
    }
  }, [descriptionHeight]);

  useEffect(() => {
    if (noteContext?.note) {
      setIsEditNoteFormOpen(true);
      setEditNoteFormValues(noteContext.note);
    } else {
      setIsEditNoteFormOpen(false);
    }
  }, [noteContext]);

  const onDescriptionChange = (event: ChangeEvent) => {
    setDescriptionHeight(event.target.scrollHeight);
  };

  return (
    <>
      <Modal
        isOpen={isAddNoteFormOpen}
        onRequestClose={() => {
          setIsAddNoteFormOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        onAfterClose={() => {
          addNoteDB(addNoteFormValues);
        }}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-4`}>
          <div className={`basis-auto w-auto`}>
            <div>
              <Formik
                initialValues={addNoteInitialValues}
                onSubmit={() => alert("submit")}
                onChange={(values: NoteInterface) => {
                  setAddNoteFormValues(values);
                }}
                validationSchema={addNoteValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div>
                      <Form>
                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              id={`title`}
                              name={`title`}
                              type={`text`}
                              className={`w-full py-1 outline-none m-0 text-2xl`}
                              placeholder={`Add Title`}
                              onKeyUp={() =>
                                setAddNoteFormValues(formik.values)
                              }
                            />
                          </div>
                        </div>

                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              type={`text`}
                              id={`description`}
                              name={`description`}
                              className={`w-full py-1 outline-none m-0 text-md resize-none max-h-60 overflow-hidden text-lg`}
                              style={{
                                height: descriptionHeight,
                                overflow: descriptionOverflow,
                              }}
                              placeholder={`Add Description`}
                              onKeyUp={(event: ChangeEvent) => {
                                setAddNoteFormValues(formik.values);
                                onDescriptionChange(event);
                              }}
                              as={`textarea`}
                              cols={20}
                              rows={5}
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditNoteFormOpen}
        onRequestClose={() => {
          setIsEditNoteFormOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        onAfterClose={() => {
          editNoteDB(editNoteFormValues);
        }}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-4`}>
          <div className={`basis-auto w-auto`}>
            <div>
              <Formik
                initialValues={editNoteFormValues || editNoteInitialValues}
                onSubmit={() => alert("submit")}
                onChange={(values: NoteInterface) => {
                  setEditNoteFormValues(values);
                }}
                validationSchema={editNoteValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div>
                      <Form>
                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              id={`title`}
                              name={`title`}
                              type={`text`}
                              className={`w-full py-1 outline-none m-0 text-2xl`}
                              placeholder={`Add Title`}
                              onKeyUp={() =>
                                setEditNoteFormValues(formik.values)
                              }
                            />
                          </div>
                        </div>

                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              type={`text`}
                              id={`description`}
                              name={`description`}
                              className={`w-full py-1 outline-none m-0 text-md resize-none max-h-60 overflow-hidden text-lg`}
                              style={{
                                height: descriptionHeight,
                                overflow: descriptionOverflow,
                              }}
                              placeholder={`Add Description`}
                              onKeyUp={(event: ChangeEvent) => {
                                setEditNoteFormValues(formik.values);
                                onDescriptionChange(event);
                              }}
                              as={`textarea`}
                              cols={20}
                              rows={5}
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </Modal>

      {!isAddNoteFormOpen && !isEditNoteFormOpen && !isEditNoteTypePopupOpen ? (
        <FaPlus
          onClick={() => {
            setIsAddNoteFormOpen(true);
          }}
          className={`bg-white hover:bg-violet-700 z-50  text-violet-700 hover:text-white shadow-2xl shadow-slate-700 text-6xl p-3 rounded-2xl fixed bottom-0 mb-4 right-4`}
        />
      ) : null}
    </>
  );
};

export default AddEditNote;
