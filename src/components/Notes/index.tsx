// import SharedComponents from "../SharedComponents";

// const Notes = () => {
//   return (
//     <>
//       <SharedComponents
//         showHeader={true}
//         showSideNav={true}
//         showAddTask={false}
//         showAddNote={true}
//         showFooter={false}
//       />
//     </>
//   );
// };

// export default Notes;
import { useState, useEffect } from "react";

import { useAuth } from "../../context/Auth";
import { supabase } from "../../supabaseClient";
import { NoteInterface } from "../../models/Note";
import { useNote } from "../../context/AddEditNote";
import SharedComponents from "../SharedComponents";
import { useSideNav } from "../../context/SideNav";

import dayjs from "dayjs";
import Modal from "react-modal";
import { FaCheck, FaClock, FaInfoCircle, FaTimes } from "react-icons/fa";

type NoteFilter = {
  time: timeEnum;
};

enum timeEnum {
  ALL = "ALL",
  TODAY = "TODAY",
}

Modal.setAppElement("#root");
const Notes = () => {
  const [notesList, setNotesList] = useState<Map<
    string,
    Array<NoteInterface>
  > | null>(null);
  const [notesDatesList, setNotesDatesList] = useState<any>(null);
  const [selectedNoteInfo, setSelectedNoteInfo] =
    useState<NoteInterface | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [noteFilter, setNoteFilter] = useState<NoteFilter>({
    time: timeEnum.TODAY,
  });

  const authContext = useAuth();

  const getNotesDB = async () => {
    setNotesDatesList([]);
    if (noteFilter.time === "TODAY") {
      let { data } = await supabase
        .from(`notes`)
        .select(`*`)
        .eq("user_id", authContext?.user?.id)
        .gte("inserted_at", dayjs().format("YYYY-MM-DD"))
        .lte("inserted_at", dayjs().add(1, "day").format("YYYY-MM-DD"))
        .order("id", { ascending: false })
        .order("inserted_at", { ascending: false });

      if (data) {
        let dataByDate = new Map();

        for (let index = 0; index < data.length; index++) {
          if (
            dataByDate.get(
              dayjs(data[index].inserted_at).format("DD MMM, YYYY")
            )
          ) {
            dataByDate.set(
              dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
              [
                ...dataByDate.get(
                  dayjs(data[index].inserted_at).format("DD MMM, YYYY")
                ),
                data[index],
              ]
            );
          } else {
            dataByDate.set(
              dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
              [data[index]]
            );
            setNotesDatesList((prevNoteDatesList: any) => {
              if (prevNoteDatesList && data) {
                if (
                  prevNoteDatesList.includes(
                    dayjs(data[index].inserted_at).format("DD MMM, YYYY")
                  )
                ) {
                  return [...prevNoteDatesList];
                } else {
                  return [
                    ...prevNoteDatesList,
                    dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
                  ];
                }
              } else if (data) {
                return [dayjs(data[index].inserted_at).format("DD MMM, YYYY")];
              }
            });
          }
        }
        let sendData: Map<string, Array<NoteInterface>> = dataByDate;
        return dataByDate;
      }
    }

    let { data } = await supabase
      .from(`notes`)
      .select(`*`)
      .eq("user_id", authContext?.user?.id)
      .order("id", { ascending: false })
      .order("inserted_at", { ascending: false });

    if (data) {
      let dataByDate = new Map();

      for (let index = 0; index < data.length; index++) {
        if (
          dataByDate.get(dayjs(data[index].inserted_at).format("DD MMM, YYYY"))
        ) {
          dataByDate.set(
            dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
            [
              ...dataByDate.get(
                dayjs(data[index].inserted_at).format("DD MMM, YYYY")
              ),
              data[index],
            ]
          );
        } else {
          dataByDate.set(
            dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
            [data[index]]
          );
          setNotesDatesList((prevNoteDatesList: any) => {
            if (prevNoteDatesList && data) {
              if (
                prevNoteDatesList.includes(
                  dayjs(data[index].inserted_at).format("DD MMM, YYYY")
                )
              ) {
                return [...prevNoteDatesList];
              } else {
                return [
                  ...prevNoteDatesList,
                  dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
                ];
              }
            } else if (data) {
              return [dayjs(data[index].inserted_at).format("DD MMM, YYYY")];
            }
          });
        }
      }
      let sendData: Map<string, Array<NoteInterface>> = dataByDate;
      return dataByDate;
    }
  };

  const noteContext = useNote();
  const sideNavContext = useSideNav();

  const getNoteToEdit = (note: NoteInterface) => {
    noteContext?.setEditNote(note);
    noteContext?.toggleIsEditingNote();
  };

  useEffect(() => {
    getNotesDB()
      .then((data: any) => {
        setNotesList(data);
      })
      .catch((err: any) => {});

    return () => {
      setNotesList(null);
    };
  }, []);

  useEffect(() => {
    if (!noteContext?.isEditingNoteDone || noteContext?.isNoteAdded) {
      getNotesDB()
        .then((data: any) => {
          setNotesList(data);
        })
        .catch((err: any) => {});
    }
  }, [noteContext]);

  const customStylesInput = {
    overlay: {
      background: `rgba(255, 255, 255, 0)`,
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
    getNotesDB()
      .then((data: any) => {
        setNotesList(data);
      })
      .catch((err: any) => {});

    return () => {
      setNotesList(null);
    };
  }, [noteFilter]);

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
        className={`mt-24 ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
        }  `}
      >
        <div
          className={`flex flex-col sm:flex-row justify-center align-middle items-center`}
        >
          <div className={`basis-auto flex flex-row my-1`}>
            <div
              onClick={() =>
                setNoteFilter((prevNoteFilter) => {
                  return { ...prevNoteFilter, time: timeEnum.TODAY };
                })
              }
              className={`basis-1/2 m-0 px-4 border-2 text-center ${
                noteFilter.time === "TODAY"
                  ? "border-violet-700 text-violet-700 bg-white hover:border-2"
                  : "border-violet-700 text-white bg-violet-700 hover:border-violet-700 hover:text-violet-700 hover:bg-white hover:border-2"
              } rounded-l-2xl`}
            >
              TODAY
            </div>
            <div
              onClick={() =>
                setNoteFilter((prevNoteFilter) => {
                  return { ...prevNoteFilter, time: timeEnum.ALL };
                })
              }
              className={`basis-1/2 m-0 px-4 border-2 text-center ${
                noteFilter.time === "ALL"
                  ? "border-violet-700 text-violet-700 bg-white hover:border-2"
                  : "border-violet-700 text-white bg-violet-700 hover:border-violet-700 hover:text-violet-700 hover:bg-white hover:border-2"
              } rounded-r-2xl`}
            >
              ALL
            </div>
          </div>
        </div>
        <ul>
          {notesDatesList &&
            notesDatesList.map((noteDate: string) => (
              <li key={noteDate}>
                <h2 className={`mx-2 text-left text-xl font-bold`}>
                  {noteDate}
                </h2>
                <ul>
                  {notesList && notesList?.get(noteDate)
                    ? notesList?.get(noteDate)?.map((note: NoteInterface) => (
                        <li
                          key={note.id}
                          className={`my-3 mx-2 p-4 rounded-xl bg-violet-800 text-slate-100 border-zinc-200 border`}
                        >
                          <div className={`flex flex-row`}>
                            <div
                              className={`basis-3/4`}
                              onClick={() => {
                                getNoteToEdit(note);
                              }}
                            >
                              <h1 className={`text-2xl font-bold`}>
                                {note.title}
                              </h1>
                              <p className={`text-lg font-normal`}>
                                {note.description}
                              </p>
                            </div>
                            <div
                              className={`basis-1/4 flex flex-col justify-between`}
                            >
                              <div
                                className={`relative basis-auto flex flex-row justify-end`}
                              >
                                <FaInfoCircle
                                  className={`text-xl text-right`}
                                  onClick={() => {
                                    setSelectedNoteInfo(note);
                                    setIsInfoModalOpen(true);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    : "not ok"}
                </ul>
              </li>
            ))}
        </ul>
      </div>

      <Modal
        isOpen={isInfoModalOpen}
        onRequestClose={() => {
          setIsInfoModalOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-4`}>
          <div className={`basis-auto w-auto text-center`}>
            <span className={`text-xl font-bold`}>Note Details</span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Note Title : </span>
            <span className={`text-md font-normal`}>
              {selectedNoteInfo?.title}
            </span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Note Description : </span>
            <span className={`text-md font-normal`}>
              {selectedNoteInfo?.description}
            </span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Created Date: </span>
            <span className={`text-md font-normal`}>
              {dayjs(selectedNoteInfo?.inserted_at).format(
                "DD MM YYYY HH:mm A"
              )}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Notes;
