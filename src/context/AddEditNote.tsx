import { createContext, useContext, useState } from "react";
import { NoteInterface } from "../models/Note";

interface NoteContextInterface {
  note: NoteInterface | null;
  isEditingNoteDone: boolean;
  isNoteAdded: boolean;
  setEditNote(note: NoteInterface | null): void;
  toggleIsEditingNote(): void;
  toggleIsNoteAdded(): void;
}

export const NoteContext = createContext<NoteContextInterface | null>(null);

export const NoteProvider = ({ children }: { children: JSX.Element }) => {
  const [note, setNote] = useState<NoteInterface | null>(null);
  const [isEditingNoteDone, setIsEditingNoteDone] = useState<boolean>(false);
  const [isNoteAdded, setIsNoteAdded] = useState<boolean>(false);

  const setEditNote = (note: NoteInterface | null): void => {
    let obj: NoteInterface | null = note;
    setNote(obj);
  };

  const toggleIsEditingNote = (): void => {
    setIsEditingNoteDone((prevIsEditingNoteDone: boolean) => {
      return !prevIsEditingNoteDone;
    });
  };

  const toggleIsNoteAdded = (): void => {
    setIsNoteAdded((prevIsNoteAdded: boolean) => {
      return !prevIsNoteAdded;
    });
  };

  return (
    <NoteContext.Provider
      value={{
        note,
        isEditingNoteDone,
        isNoteAdded,
        setEditNote,
        toggleIsEditingNote,
        toggleIsNoteAdded,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => {
  return useContext(NoteContext);
};
