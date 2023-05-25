import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import SharedComponents from "../SharedComponents";
import Note from "../Note";
import { useSideNav } from "../../context/SideNav";
import { FaThList, FaTh, FaFilter } from "react-icons/fa";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import FormikControls from "../formik/ReusableComponents/FormikControls";
import { NoteInterface, NotesViewEnum } from "../../models/Note";

type NotesFilterType = {
  fromdate: string | null;
  todate: string | null;
  searchtext: string | null;
};

const NotesList = () => {
  const [notesList, setNotesList] = useState<Map<
    string,
    Array<NoteInterface>
  > | null>(null);
  const [notesListView, setNotesListView] = useState<NotesViewEnum>(
    NotesViewEnum.GRID
  );

  const [showNoteFilterPopup, setShowNoteFilterPopup] =
    useState<boolean>(false);
  let noteFilterFormInitialValues: NotesFilterType = {
    fromdate: "",
    todate: "",
    searchtext: "",
  };
  const [noteFilterFormValues, setNoteFilterFormValues] =
    useState<NotesFilterType | null>(noteFilterFormInitialValues);
  const noteFilterValidationSchema = Yup.object({
    fromdate: Yup.string().nullable(),
    todate: Yup.string().nullable(),
    searchtext: Yup.string().nullable(),
  });

  const sideNavContext = useSideNav();

  const getNotesListDB = async ({
    fromdate,
    todate,
    searchtext,
  }: NotesFilterType) => {
    if (fromdate === "") {
      fromdate = null;
    }
    if (todate === "") {
      todate = null;
    }
    if (searchtext === "") {
      searchtext = null;
    }
    const { data, error } = await supabase.rpc("np_get_notes", {
      fromdate,
      todate,
      searchtext,
    });
    if (error) {
      console.error(error);
      return [];
    }
    return data;
  };

  useEffect(() => {
    getNotesListDB(noteFilterFormInitialValues)
      .then((data: any) => {
        console.log(data);
        setNotesList(data);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return (
    <>
      <SharedComponents
        showHeader={true}
        showSideNav={true}
        showAddTask={true}
        showAddNote={false}
        showFooter={false}
      />
      <div
        className={`flex sm:flex-row flex-col mt-24 ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-72" : "sm:ml-20"
        }`}
      >
        <div
          className={`basis-1/2 ${
            sideNavContext?.sideNav.isOpen
              ? "mx-1 sm:mx-10"
              : "mx-1 sm:mx-20 md:mx-24 lg:mx-40"
          } sm:basis-full flex flex-row justify-self-stretch align-middle items-start`}
        >
          <div className={`basis-1/2 flex flex-row justify-start mx-2`}>
            <h1 className={`text-2xl font-semibold`}>Notes</h1>
          </div>
          <div className={`basis-1/2 flex flex-row justify-end mx-2`}>
            <div
              className={`${
                notesListView === NotesViewEnum.GRID
                  ? "bg-violet-700 text-white border-2 border-violet-700"
                  : "bg-white text-violet-400 border-2 border-violet-700"
              } flex flex-row p-2 rounded-l-lg transition-all duration-500`}
              onClick={() => setNotesListView(NotesViewEnum.GRID)}
            >
              <div className={`mx-2`}>
                <FaTh />
              </div>
            </div>
            <div
              className={`${
                notesListView === NotesViewEnum.LIST
                  ? "bg-violet-700 text-white border-2 border-violet-700"
                  : "bg-white text-violet-400 border-2 border-violet-700"
              } flex flex-row p-2 rounded-r-lg transition-all duration-500`}
              onClick={() => setNotesListView(NotesViewEnum.LIST)}
            >
              <div className={`mx-2`}>
                <FaThList />
              </div>
            </div>
            <div
              className={`${
                showNoteFilterPopup === true
                  ? "bg-violet-700 text-white border-2 border-violet-700"
                  : "bg-white text-violet-400 border-2 border-violet-700"
              } flex flex-row p-2 rounded-lg ml-2 transition-all duration-500`}
              onClick={() =>
                setShowNoteFilterPopup(
                  (prevShowNoteFilterPopup) => !prevShowNoteFilterPopup
                )
              }
            >
              <div id="clickable" className={`mx-2`}>
                <FaFilter />
              </div>
            </div>
            <Tooltip
              anchorSelect="#clickable"
              place={"bottom"}
              isOpen={showNoteFilterPopup}
              clickable
              offset={20}
              style={{
                backgroundColor: "rgb(109 40 217)",
                color: "rgb(34, 34, 34)",
                opacity: "100",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <Formik
                initialValues={
                  noteFilterFormValues || noteFilterFormInitialValues
                }
                onSubmit={(values: NotesFilterType) => {
                  setNoteFilterFormValues(values);
                  if (values !== null) {
                    getNotesListDB(values)
                      .then((data: any) => {
                        setNotesList(data);
                        setShowNoteFilterPopup(false);
                      })
                      .catch((error) => {
                        throw error;
                      });
                  }
                }}
                validationSchema={noteFilterValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div className={`w-64`}>
                      <Form>
                        <div className={`flex flex-col w-full text-black mb-2`}>
                          <div className={`basis-auto text-start`}>
                            <label
                              htmlFor="searchtext"
                              className={`text-white`}
                            >
                              Search Text
                            </label>
                            <FormikControls
                              control={"input"}
                              name={"searchtext"}
                              type={"text"}
                              label={"Enter Email"}
                              showLabel={false}
                              className={`w-full py-1 px-2 rounded-sm`}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-2`}>
                          <div className={`basis-auto text-start`}>
                            <label
                              htmlFor="searchtext"
                              className={`text-white`}
                            >
                              From
                            </label>
                            <FormikControls
                              control={"date"}
                              name={"fromdate"}
                              label={"Enter fromdate"}
                              showLabel={false}
                              className={`w-full py-1 px-2 rounded-sm`}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-2`}>
                          <div className={`basis-auto text-start`}>
                            <label
                              htmlFor="searchtext"
                              className={`text-white`}
                            >
                              To
                            </label>
                            <FormikControls
                              control={"date"}
                              name={"todate"}
                              label={"Enter todate"}
                              showLabel={false}
                              className={`w-full py-1 px-2 rounded-sm`}
                            />
                          </div>
                        </div>
                        <div
                          className={`flex flex-row w-full justify-end text-black mb-2`}
                        >
                          <button
                            className={`basis-auto bg-white text-violet-700 py-1 px-2 mx-1 rounded-sm`}
                            type={`submit`}
                          >
                            Filter
                          </button>
                          <button
                            className={`basis-auto bg-white text-violet-700 py-1 px-2 ml-1 rounded-sm`}
                            type={`reset`}
                            onClick={() => {
                              setNoteFilterFormValues(
                                noteFilterFormInitialValues
                              );
                              if (noteFilterFormInitialValues !== null) {
                                getNotesListDB(noteFilterFormInitialValues)
                                  .then((data: any) => {
                                    setNotesList(data);
                                    setShowNoteFilterPopup(false);
                                  })
                                  .catch((error) => {
                                    throw error;
                                  });
                              }
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </Tooltip>
          </div>
        </div>
      </div>

      {notesListView === NotesViewEnum.GRID && (
        <div
          className={`flex sm:flex-row flex-col mt-2 ${
            sideNavContext?.sideNav.isOpen ? "sm:ml-72" : "sm:ml-20"
          }`}
        >
          <div
            className={`basis-1/2 ${
              sideNavContext?.sideNav.isOpen
                ? "mx-auto sm:mx-10"
                : "mx-auto sm:mx-20 md:mx-24 lg:mx-40"
            } sm:basis-full flex flex-row justify-start align-middle items-start`}
          >
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3 lg:gap-4 mx-2">
              {notesList &&
                Array.from(notesList!.entries()).map(([key, value]: any) => (
                  <div className={`mb-3`} key={value.id}>
                    <Note note={value} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {notesListView === NotesViewEnum.LIST && (
        <div
          className={`flex sm:flex-row flex-col mt-2 ${
            sideNavContext?.sideNav.isOpen ? "sm:ml-72" : "sm:ml-20"
          }`}
        >
          <div
            className={`basis-full ${
              sideNavContext?.sideNav.isOpen
                ? "mx-auto sm:mx-10"
                : "mx-auto sm:mx-20 md:mx-24 lg:mx-40"
            }`}
          >
            <div className="mx-2">
              {notesList &&
                Array.from(notesList!.entries()).map(([key, value]: any) => (
                  <div className={`mb-3`} key={value.id}>
                    <Note note={value} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesList;
