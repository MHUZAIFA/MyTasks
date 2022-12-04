import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Task } from '../task-wrapper/models/task';
import { User } from '../task-wrapper/models/user';
import { UTILITY } from '../task-wrapper/utilities/utility';
import { ITaskService } from './ITaskService';
import { SnackbarMessages, SnackbarService } from './snackbar.service';
import { VibrationService } from './vibration.service';

@Injectable({
  providedIn: 'root'
})
export class LocalTaskService {

  get loggedInUser(): User { return this._authService.loggedInUser; }
  private key: string = 'taskStore';
  private _allTasks: Task[] = [];
  get allTasks(): Task[] { return this._allTasks; }

  constructor(private _snackbarService: SnackbarService, private _vibrationService: VibrationService, private _authService: AuthenticationService) { }

  public tasksListUpdatedAvailable(): Observable<any> { return of(null); }
  public taskUpdatedAvailable(taskId: string): Observable<any> { return of(null); }

  async getTasks(): Promise<Task[]> {
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    this._allTasks = taskStore;
    return new Promise((resolve) => {
      resolve(this._allTasks);
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const data = taskStore.find((t) => t.taskId === id) as Task;
    return new Promise((resolve) => {
      resolve(data);
    });
  }

  async createTask(task: Task, suppressNotification: boolean): Promise<string> {
    const timestamp = new Date();
    task.createdDate = timestamp;
    task.updatedDate = timestamp;
    task.uid = this.loggedInUser.uid;
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    taskStore.push(task);
    localStorage.setItem(this.key, JSON.stringify(taskStore));
    if (!suppressNotification) {
      this._snackbarService.openSnackBar(SnackbarMessages.TaskCreated);
      this._vibrationService.vibrateOnce();
    }
    return new Promise((resolve) => {
      resolve(task.id);
    });
  }

  async updatetask(task: Task, message: SnackbarMessages = SnackbarMessages.TaskUpdated, vibrate: boolean, suppressNotification: boolean): Promise<void> {
    task.updatedDate = new Date();
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const index = taskStore.findIndex((t) => t.taskId === task.taskId);
    taskStore.splice(index, 1);
    taskStore.push(task);
    localStorage.setItem(this.key, JSON.stringify(taskStore));
    this._snackbarService.openSnackBar(message);
    if (!suppressNotification) {
      this._snackbarService.openSnackBar(message);
      if (vibrate) {
        this._vibrationService.vibrateinPattern();
      }
    }
    return new Promise((resolve) => {
      resolve();
    });
  }

  async deletetask(task: Task, suppressNotification: boolean): Promise<any> {
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const index = taskStore.findIndex((t) => t.taskId === task.taskId);
    taskStore.splice(index, 1);
    taskStore.push(task);
    localStorage.setItem(this.key, JSON.stringify(taskStore));
    if (!suppressNotification) {
      this._vibrationService.vibrateOnce();
      this._snackbarService.openSnackBar(SnackbarMessages.TaskDeleted);
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  updateLocalStorage(tasks: Task[]) {
    localStorage.setItem(this.key, JSON.stringify(tasks));
  }

}
