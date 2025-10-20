import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

type TaskStatus = 'Completed' | 'Pending' | 'Planned';
interface Task {
  name: string;
  status: TaskStatus;
  date: string; // ISO yyyy-mm-dd
  description: string;
  expanded: boolean;
}

@Component({
  selector: 'app-root',
  imports: [NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'junior-frontend-developer-task';

  protected tasks: Task[] = [
    {
      name: 'Zrobić zakupy spożywcze',
      status: 'Completed',
      date: '2025-05-01',
      description: 'Muszę kupić mleko, mąkę i jajka.',
      expanded: false,
    },
    {
      name: 'Opłacić rachunki',
      status: 'Pending',
      date: '2025-05-10',
      description: 'Rachunek PGNiG na Gmailu 20.10.2025',
      expanded: false,
    },
    {
      name: 'Urodziny mamy',
      status: 'Planned',
      date: '2025-05-15',
      description: 'Kupić kwiaty i tort.',
      expanded: false,
    },
  ];

  toggleCompleted(task: Task) {
    task.status = task.status === 'Completed' ? 'Planned' : 'Completed';
  }
}
