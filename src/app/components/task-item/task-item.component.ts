import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [NgClass, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Input({ required: true }) index!: number;

  @Output() toggleCompleted = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();

  // Signal for local expanded state
  protected expanded = signal(false);

  protected readonly TaskStatus = TaskStatus;

  onToggleCompleted(): void {
    this.toggleCompleted.emit(this.task);
  }

  onEditTask(): void {
    this.editTask.emit(this.task);
  }

  onToggleExpanded(): void {
    this.expanded.update((current) => !current);
  }

  get isExpanded(): boolean {
    return this.expanded();
  }
}
