export type TaskStatus = 'UNASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export class Task {
  id!: string;
  title!: string;
  description!: string;
  due_date!: Date;
  status!: TaskStatus;
  create_at!: Date;
  updated_at!: Date;
}
