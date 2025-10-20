import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import {
  Task,
  TaskStatus,
  TaskFilters,
  TaskFormData,
} from './models/task.model';
import { TaskFiltersComponent } from './components/task-filters/task-filters.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskModalComponent } from './components/add-task-modal/add-task-modal.component';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-root',
  imports: [
    TaskFiltersComponent,
    TaskListComponent,
    AddTaskModalComponent,
    EditTaskModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly title: string = 'junior-frontend-developer-task';

  // Signals for reactive state management
  protected tasks = signal<Task[]>([
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
  ]);

  protected filters = signal<TaskFilters>({
    name: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: 'All',
  });

  // Modal states
  protected isAddModalOpen = signal(false);
  protected isEditModalOpen = signal(false);
  protected editingTask = signal<Task | null>(null);

  // Form data
  protected newTaskForm = signal<TaskFormData>({
    name: '',
    date: '',
    description: '',
    status: TaskStatus.Planned,
  });

  protected editTaskForm = signal<TaskFormData>({
    name: '',
    date: '',
    description: '',
    status: TaskStatus.Planned,
  });

  // Computed filtered tasks
  protected filteredTasks = computed(() => {
    const tasksList = this.tasks();
    const filtersData = this.filters();

    const nameQuery: string = filtersData.name.trim().toLowerCase();
    const from: Date | undefined = filtersData.dateFrom
      ? this.parseDateStrict(filtersData.dateFrom) || undefined
      : undefined;
    const to: Date | undefined = filtersData.dateTo
      ? this.parseDateStrict(filtersData.dateTo) || undefined
      : undefined;
    const status =
      filtersData.status && filtersData.status !== 'All'
        ? filtersData.status
        : undefined;

    return tasksList.filter((task) => {
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
  });

  // Computed date range validation
  protected isDateRangeInvalid = computed(() => {
    const filtersData = this.filters();
    if (!filtersData.dateFrom || !filtersData.dateTo) {
      return false;
    }
    const from = this.parseDateStrict(filtersData.dateFrom);
    const to = this.parseDateStrict(filtersData.dateTo);
    if (!from || !to) {
      return false;
    }
    return to < from;
  });

  // Filter handlers
  onFiltersChange(newFilters: TaskFilters): void {
    this.filters.set(newFilters);
  }

  onClearFilters(): void {
    this.filters.set({
      name: '',
      dateFrom: undefined,
      dateTo: undefined,
      status: 'All',
    });
  }

  // Task handlers
  onToggleCompleted(task: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((t) =>
        t === task
          ? {
              ...t,
              status:
                t.status === TaskStatus.Completed
                  ? TaskStatus.Planned
                  : TaskStatus.Completed,
            }
          : t
      )
    );
  }

  onEditTask(task: Task): void {
    this.editingTask.set(task);
    this.editTaskForm.set({
      name: task.name,
      date: task.date,
      description: task.description,
      status: task.status,
    });
    this.isEditModalOpen.set(true);
  }

  // Modal handlers
  onOpenAddModal(): void {
    this.newTaskForm.set({
      name: '',
      date: '',
      description: '',
      status: TaskStatus.Planned,
    });
    this.isAddModalOpen.set(true);
  }

  onCloseAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  onCloseEditModal(): void {
    this.isEditModalOpen.set(false);
    this.editingTask.set(null);
  }

  onAddTask(formData: TaskFormData): void {
    const newTask: Task = {
      name: formData.name.trim(),
      date: formData.date,
      description: formData.description.trim(),
      status: formData.status,
      expanded: false,
    };

    this.tasks.update((tasks) => [newTask, ...tasks]);
    this.isAddModalOpen.set(false);
  }

  onEditTaskSubmit(formData: TaskFormData): void {
    const task = this.editingTask();
    if (!task) return;

    this.tasks.update((tasks) =>
      tasks.map((t) =>
        t === task
          ? {
              ...t,
              name: formData.name.trim(),
              date: formData.date,
              description: formData.description.trim(),
              status: formData.status,
            }
          : t
      )
    );

    this.isEditModalOpen.set(false);
    this.editingTask.set(null);
  }

  // Helper method
  private parseDateStrict(value: string): Date | null {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}
