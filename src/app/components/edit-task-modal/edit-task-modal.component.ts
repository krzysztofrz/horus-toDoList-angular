import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskFormData } from '../../models/task.model';

@Component({
  selector: 'app-edit-task-modal',
  imports: [FormsModule],
  templateUrl: './edit-task-modal.component.html',
  styleUrl: './edit-task-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTaskModalComponent {
  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) task!: Task | null;
  @Input({ required: true }) formData!: TaskFormData;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<TaskFormData>();

  // Signal for form validation state
  protected hasAttemptedSubmit = signal(false);

  protected readonly TaskStatus = TaskStatus;

  get todayISO(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  get isNameInvalid(): boolean {
    return this.hasAttemptedSubmit() && this.formData.name.trim().length === 0;
  }

  get isDateInvalid(): boolean {
    if (!this.hasAttemptedSubmit()) return false;
    if (!this.formData.date) return true;
    const picked = this.parseDateStrict(this.formData.date);
    const today = this.parseDateStrict(this.todayISO);
    if (!picked || !today) return true;
    return picked < today;
  }

  get canSubmit(): boolean {
    return (
      this.formData.name.trim().length > 0 &&
      !!this.formData.date &&
      !this.isDateInvalid
    );
  }

  onClose(): void {
    this.hasAttemptedSubmit.set(false);
    this.close.emit();
  }

  onSubmit(): void {
    this.hasAttemptedSubmit.set(true);

    const isNameValid = this.formData.name.trim().length > 0;
    const isDateValid = !!this.formData.date && !this.isDateInvalid;

    if (!isNameValid || !isDateValid || !this.task) {
      return;
    }

    this.submit.emit(this.formData);
  }

  private parseDateStrict(value: string): Date | null {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}
