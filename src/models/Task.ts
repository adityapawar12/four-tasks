export interface TaskInterface {
  id?: number;
  title: string;
  description: string;
  user_id: number;
  seq_no?: number;
  is_archived?: boolean;
  is_pinned?: boolean;
  pinned_id?: number;
  is_important: boolean;
  is_urgent: boolean;
  status: TaskStatusEnum;
  inserted_at?: Date;
  updated_at?: Date;
}

export enum TaskStatusEnum {
  ALL = "ALL",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TasksViewEnum {
  LIST = "LIST",
  GRID = "GRID",
}
