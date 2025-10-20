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
}
