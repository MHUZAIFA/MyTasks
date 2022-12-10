import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../task-wrapper/models/task';
import { TasksService } from './tasks.service';

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _tasks$ = new BehaviorSubject<Task[]>([]);

  get tasks(): Task[] {
    return this._tasks$.getValue();
  }
  get loading(): boolean {
    return this._loading$.getValue();
  }
  get tasks$() {
    return this._tasks$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }

  constructor(private _taskService: TasksService) { }

  public loadTasks() {
    this._loading$.next(true);
    this._taskService
      .getTasks()
      .then((data) => {
        this._tasks$.next(data);
      })
      .catch((error) => this._tasks$.error(error))
      .finally(() =>
        setTimeout(() => {
          this._loading$.next(false);
        }, 1000)
      );
  }
}
