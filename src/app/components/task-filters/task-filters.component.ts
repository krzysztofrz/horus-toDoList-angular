import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFilters, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-filters',
  imports: [FormsModule],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFiltersComponent {
  // Use input signals for reactive updates
  filters = input.required<TaskFilters>();
  isDateRangeInvalid = input.required<boolean>();

  @Output() filtersChange = new EventEmitter<TaskFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  protected readonly TaskStatus = TaskStatus;

  onNameChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newFilters = { ...this.filters(), name: target.value };
    this.filtersChange.emit(newFilters);
  }

  onDateFromChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newFilters = {
      ...this.filters(),
      dateFrom: target.value || undefined,
    };
    this.filtersChange.emit(newFilters);
  }

  onDateToChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newFilters = { ...this.filters(), dateTo: target.value || undefined };
    this.filtersChange.emit(newFilters);
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newFilters = {
      ...this.filters(),
      status: target.value as TaskStatus | 'All',
    };
    this.filtersChange.emit(newFilters);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  get hasActiveFilters(): boolean {
    const filtersData = this.filters();
    return !!(
      filtersData.name ||
      filtersData.dateFrom ||
      filtersData.dateTo ||
      filtersData.status !== 'All'
    );
  }
}
