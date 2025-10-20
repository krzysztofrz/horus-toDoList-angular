export enum TaskStatus {
  Completed = 'Completed',
  Pending = 'Pending',
  Planned = 'Planned',
}

export interface Task {
  name: string;
  status: TaskStatus;
  date: string; // ISO yyyy-mm-dd
  description: string;
  expanded: boolean;
}

export interface TaskFilters {
  name: string;
  dateFrom?: string;
  dateTo?: string;
  status?: TaskStatus | 'All';
}

export interface TaskFormData {
  name: string;
  date: string; // ISO yyyy-mm-dd
  description: string;
  status: TaskStatus;
}
