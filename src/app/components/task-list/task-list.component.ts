import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] = [];

  @Output() toggleCompleted = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();

  onToggleCompleted(task: Task): void {
    this.toggleCompleted.emit(task);
  }

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }

  trackByTask(index: number, task: Task): string {
    return task.name + task.date;
  }

  getTaskPluralForm(count: number): string {
    if (count === 0) return 'zadań';
    if (count === 1) return 'zadanie';
    if (count >= 2 && count <= 4) return 'zadania';
    return 'zadań';
  }
}
