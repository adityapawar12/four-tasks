import { NoteInterface } from "../../models/Note";

const Note = (props: any) => {
  const noteData: NoteInterface = props.note;
  return (
    <div
      className={`text-base font-medium border-[1px] border-gray-200 shadow-none hover:shadow-md hover:shadow-slate-300 hover:border-gray-400 rounded-xl break-inside-avoid-column p-4`}
    >
      <div>
        {noteData?.title && noteData?.title.length > 100
          ? `${noteData?.title && noteData?.title.substring(0, 100)}...`
          : noteData?.title && noteData?.title}
      </div>
      <div className={`text-sm font-normal`}>
        {noteData?.description && noteData?.description.length > 500
          ? `${
              noteData?.description && noteData?.description.substring(0, 500)
            }...`
          : noteData?.description && noteData?.description}
      </div>
    </div>
  );
};

export default Note;
