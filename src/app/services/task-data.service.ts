import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../task-wrapper/models/task';
import { GeneralTaskService } from './general.task..service';

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

  constructor(private _taskService: GeneralTaskService) { }

  public loadTasks() {
    this._loading$.next(true);
    this._taskService.instance
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
