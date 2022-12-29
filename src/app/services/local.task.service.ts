import { Injectable } from '@angular/core';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Task } from '../task-wrapper/models/task';
import { SnackbarMessages, SnackbarService } from './snackbar.service';
import { VibrationService } from './vibration.service';

@Injectable({
  providedIn: 'root'
})
export class LocalTaskService {

  private key: string = 'taskStore';

  constructor(private _snackbarService: SnackbarService, private _vibrationService: VibrationService) { }

  async getTasks(): Promise<Task[]> {
    const tasks = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    return new Promise((resolve) => {
      resolve(tasks);
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const tasks = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const task = tasks.find((t) => t.taskId === id && t.isDeleted === false) as Task;
    return new Promise((resolve) => {
      resolve(task);
    });
  }

  async createTask(task: Task, suppressNotification: boolean): Promise<string> {
    const tasks = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    tasks.push(task);
    this.updateLocalStorage(tasks);
    if (!suppressNotification) {
      this._snackbarService.openSnackBar(SnackbarMessages.TaskCreated);
      this._vibrationService.vibrateOnce();
    }
    return new Promise((resolve) => {
      resolve(task.taskId);
    });
  }

  async updatetask(task: Task, message: SnackbarMessages = SnackbarMessages.TaskUpdated, vibrate: boolean, suppressNotification: boolean): Promise<void> {
    const tasks = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const index = tasks.findIndex((t) => t.taskId === task.taskId);
    tasks.splice(index, 1);
    tasks.push(task);
    this.updateLocalStorage(tasks);
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
    const tasks = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const index = tasks.findIndex((t) => t.taskId === task.taskId);
    tasks.splice(index, 1);
    tasks.push(task);
    this.updateLocalStorage(tasks);
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
