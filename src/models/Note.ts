export interface NoteInterface {
  id?: number;
  title: string;
  description: string;
  user_id: number;
  seq_no?: number;
  is_archived?: boolean;
  is_pinned?: boolean;
  pinned_id?: number;
  inserted_at?: Date;
  updated_at?: Date;
}

export enum NotesViewEnum {
  LIST = "LIST",
  GRID = "GRID",
}
