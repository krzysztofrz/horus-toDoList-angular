import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

enum TaskStatus {
  Completed = 'Completed',
  Pending = 'Pending',
  Planned = 'Planned',
}
interface Task {
  name: string;
  status: TaskStatus;
  date: string; // ISO yyyy-mm-dd
  description: string;
  expanded: boolean;
}
interface TaskFilters {
  name: string;
  dateFrom?: string;
  dateTo?: string;
  status?: TaskStatus | 'All';
}

@Component({
  selector: 'app-root',
  imports: [NgClass, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  readonly title: string = 'junior-frontend-developer-task';

  // expose enum to template
  protected readonly TaskStatus = TaskStatus;

  // Modal: add new task
  protected isAddModalOpen: boolean = false;
  protected hasAttemptedSubmit: boolean = false;
  protected newTask: {
    name: string;
    date: string; // ISO yyyy-mm-dd
    description: string;
    status: TaskStatus;
  } = {
    name: '',
    date: '',
    description: '',
    status: TaskStatus.Planned,
  };

  // Modal: edit task
  protected isEditModalOpen: boolean = false;
  protected hasAttemptedEditSubmit: boolean = false;
  protected editingTask: Task | null = null;
  protected editTaskForm: {
    name: string;
    date: string; // ISO yyyy-mm-dd
    description: string;
    status: TaskStatus;
  } = {
    name: '',
    date: '',
    description: '',
    status: TaskStatus.Planned,
  };

  protected tasks: Task[] = [
    {
      name: 'Zrobić zakupy spożywcze',
      status: TaskStatus.Completed,
      date: '2025-10-01',
      description: 'Muszę kupić mleko, mąkę i jajka.',
      expanded: false,
    },
    {
      name: 'Opłacić rachunki',
      status: TaskStatus.Pending,
      date: '2025-10-19',
      description: 'Rachunek PGNiG na Gmailu 20.10.2025',
      expanded: false,
    },
    {
      name: 'Urodziny mamy',
      status: TaskStatus.Planned,
      date: '2025-10-28',
      description: 'Kupić kwiaty i tort.',
      expanded: false,
    },
  ];

  protected filters: TaskFilters = {
    name: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: 'All',
  };

  // Derived: today in ISO yyyy-mm-dd
  get todayISO(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  get filteredTasks(): Task[] {
    const nameQuery: string = this.filters.name.trim().toLowerCase();
    const from: Date | undefined = this.filters.dateFrom
      ? this.parseDateStrict(this.filters.dateFrom) || undefined
      : undefined;
    const to: Date | undefined = this.filters.dateTo
      ? this.parseDateStrict(this.filters.dateTo) || undefined
      : undefined;
    const status =
      this.filters.status && this.filters.status !== 'All'
        ? this.filters.status
        : undefined;

    return this.tasks.filter((task) => {
      const matchesName = nameQuery
        ? task.name.toLowerCase().includes(nameQuery) ||
          task.description.toLowerCase().includes(nameQuery)
        : true;

      const taskDate = this.parseDateStrict(task.date);
      const matchesFrom = from ? !!taskDate && taskDate >= from : true;
      const matchesTo = to ? !!taskDate && taskDate <= to : true;

      const matchesStatus = status ? task.status === status : true;

      return matchesName && matchesFrom && matchesTo && matchesStatus;
    });
  }

  // data validation
  get isDateRangeInvalid(): boolean {
    if (!this.filters.dateFrom || !this.filters.dateTo) {
      return false;
    }
    const from = this.parseDateStrict(this.filters.dateFrom);
    const to = this.parseDateStrict(this.filters.dateTo);
    if (!from || !to) {
      return false;
    }
    return to < from;
  }

  // validation for add task form
  get isNewTaskNameInvalid(): boolean {
    return this.hasAttemptedSubmit && this.newTask.name.trim().length === 0;
  }

  get isNewTaskDateInvalid(): boolean {
    if (!this.hasAttemptedSubmit) return false;
    if (!this.newTask.date) return true;
    const picked = this.parseDateStrict(this.newTask.date);
    const today = this.parseDateStrict(this.todayISO);
    if (!picked || !today) return true;
    // date cannot be in the past
    return picked < today;
  }

  // validation for edit task form
  get isEditTaskNameInvalid(): boolean {
    return (
      this.hasAttemptedEditSubmit && this.editTaskForm.name.trim().length === 0
    );
  }

  get isEditTaskDateInvalid(): boolean {
    if (!this.hasAttemptedEditSubmit) return false;
    if (!this.editTaskForm.date) return true;
    const picked = this.parseDateStrict(this.editTaskForm.date);
    const today = this.parseDateStrict(this.todayISO);
    if (!picked || !today) return true;
    // date cannot be in the past
    return picked < today;
  }

  get canSubmitNewTask(): boolean {
    // Button is always enabled, validation happens on submit
    return true;
  }

  get canSubmitEditTask(): boolean {
    // Button is always enabled, validation happens on submit
    return true;
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.hasAttemptedSubmit = false;
    // reset form to defaults
    this.newTask = {
      name: '',
      date: '',
      description: '',
      status: TaskStatus.Planned,
    };
  }

  openEditModal(task: Task): void {
    this.editingTask = task;
    this.isEditModalOpen = true;
    this.hasAttemptedEditSubmit = false;
    // populate form with task data
    this.editTaskForm = {
      name: task.name,
      date: task.date,
      description: task.description,
      status: task.status,
    };
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.hasAttemptedEditSubmit = false;
    this.editingTask = null;
    // reset form
    this.editTaskForm = {
      name: '',
      date: '',
      description: '',
      status: TaskStatus.Planned,
    };
  }

  submitNewTask(): void {
    this.hasAttemptedSubmit = true;

    // Check if form is valid before proceeding
    const isNameValid = this.newTask.name.trim().length > 0;
    const isDateValid = !!this.newTask.date && !this.isNewTaskDateInvalid;

    if (!isNameValid || !isDateValid) {
      return; // Don't submit if validation fails
    }

    const created: Task = {
      name: this.newTask.name.trim(),
      date: this.newTask.date,
      description: this.newTask.description.trim(),
      status: this.newTask.status,
      expanded: false,
    };
    // Add newest on top for visibility
    this.tasks = [created, ...this.tasks];
    this.closeAddModal();
  }

  submitEditTask(): void {
    this.hasAttemptedEditSubmit = true;

    // Check if form is valid before proceeding
    const isNameValid = this.editTaskForm.name.trim().length > 0;
    const isDateValid = !!this.editTaskForm.date && !this.isEditTaskDateInvalid;

    if (!isNameValid || !isDateValid || !this.editingTask) {
      return; // Don't submit if validation fails
    }

    // Update the task
    this.editingTask.name = this.editTaskForm.name.trim();
    this.editingTask.date = this.editTaskForm.date;
    this.editingTask.description = this.editTaskForm.description.trim();
    this.editingTask.status = this.editTaskForm.status;

    this.closeEditModal();
  }

  toggleCompleted(task: Task): void {
    task.status =
      task.status === TaskStatus.Completed
        ? TaskStatus.Planned
        : TaskStatus.Completed;
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      dateFrom: undefined,
      dateTo: undefined,
      status: 'All',
    };
  }

  // Helper: safely parses ISO date string (returns null if invalid)
  private parseDateStrict(value: string): Date | null {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  // Helper: Polish pluralization for "zadanie"
  protected getTaskPluralForm(count: number): string {
    if (count === 0) return 'zadań';
    if (count === 1) return 'zadanie';
    if (count >= 2 && count <= 4) return 'zadania';
    return 'zadań';
  }
}
