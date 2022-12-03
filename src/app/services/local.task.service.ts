import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Task } from '../task-wrapper/models/task';
import { User } from '../task-wrapper/models/user';
import { UTILITY } from '../task-wrapper/utilities/utility';
import { HttpService } from './http.service';
import { ITaskService } from './ITaskService';
import { SnackbarMessages, SnackbarService } from './snackbar.service';
import { TasksFirestoreService } from './tasks.firestore.service';
import { VibrationService } from './vibration.service';

@Injectable({
  providedIn: 'root'
})
export class LocalTaskService extends HttpService implements ITaskService {

  get loggedInUser(): User { return this._authService.loggedInUser; }
  private key: string = 'taskStore';
  private _allTasks: Task[] = [];
  get allTasks(): Task[] { return this._allTasks; }

  constructor(_http: HttpClient, private _snackbarService: SnackbarService, private _vibrationService: VibrationService, private _authService: AuthenticationService, private _firestoreService: TasksFirestoreService) {
    super(_http);
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  public tasksListUpdatedAvailable(): Observable<any> { return of(null); }
  public taskUpdatedAvailable(taskId: string): Observable<any> { return of(null); }

  async getTasks(): Promise<Task[]> {

    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];

    this._allTasks = taskStore.filter((t) => t.uid === this.loggedInUser.uid);

    return new Promise((resolve) => {
      resolve(this.allTasks);
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const data = taskStore.find((t) => t.id === id) as Task;
    return new Promise((resolve) => {
      resolve(data);
    });
  }

  async createTask(task: Task): Promise<string> {
    const timestamp = new Date();
    task.id = UTILITY.GenerateUUID();
    task.createdDate = timestamp;
    task.updatedDate = timestamp;
    task.uid = this.loggedInUser.uid;
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    taskStore.push(task);
    localStorage.setItem(this.key, JSON.stringify(taskStore));
    this._snackbarService.openSnackBar(SnackbarMessages.TaskCreated);
    this._vibrationService.vibrateOnce();
    return new Promise((resolve) => {
      resolve(task.id);
    });
  }

  async updatetask(id: string, task: Task, message: SnackbarMessages = SnackbarMessages.TaskUpdated, vibrate: boolean): Promise<void> {
    task.updatedDate = new Date();
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const index = taskStore.findIndex((t) => t.id === id);
    taskStore.splice(index, 1);
    taskStore.push(task);
    localStorage.setItem(this.key, JSON.stringify(taskStore));
    this._snackbarService.openSnackBar(message);
    if (vibrate) {
      this._vibrationService.vibrateinPattern();
    }
    return new Promise((resolve) => {
      resolve();
    });
  }

  async deletetask(id: string): Promise<any> {
    const taskStore = JSON.parse(
      localStorage.getItem(this.key) as string
    ) as Task[];
    const index = taskStore.findIndex((t) => t.id === id);
    taskStore.splice(index, 1);
    localStorage.setItem(this.key, JSON.stringify(taskStore));
    this._vibrationService.vibrateOnce();
    this._snackbarService.openSnackBar(SnackbarMessages.TaskDeleted);
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  private sanitizeTask(task: Task): Task {
    task.title = task.title.trim();
    task.subtasks.forEach(s => s.subtitle = s.subtitle.trim());
    task.notes = task.notes.trim();
    return task;
  }

}
