import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Task } from '../task-wrapper/models/task';
import { User } from '../task-wrapper/models/user';
import { HttpService } from './http.service';
import { ITaskService } from './ITaskService';
import { SnackbarMessages, SnackbarService } from './snackbar.service';
import { TasksFirestoreService } from './tasks.firestore.service';
import { VibrationService } from './vibration.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends HttpService implements ITaskService {

  get loggedInUser(): User { return this.authService.loggedInUser; }
  private key: string = 'taskStore';
  private _allTasks: Task[] = [];
  get allTasks(): Task[] { return this._allTasks; }

  constructor(_http: HttpClient, private _snackbarService: SnackbarService, private _vibrationService: VibrationService, private authService: AuthenticationService, private _firestoreService: TasksFirestoreService) {
    super(_http);
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  public tasksListUpdatedAvailable(): Observable<any> { return this._firestoreService.tasksListUpdatedAvailable(); }
  public taskUpdatedAvailable(taskId: string): Observable<any> {  return taskId ? this._firestoreService.taskUpdatedAvailable(taskId) : of(null); }

  async getTasks(): Promise<Task[]> {
    let tasks: Task[] = [];
    const response = await this._firestoreService.getTasks();
    if (response.docs) {
      tasks = response.docs.map(d => {
        const data = d.data() as Task;
        data.id = d.id;
        return data;
      });
    }

    // TODO: caching logic

    this._allTasks = tasks;

    return new Promise((resolve) => {
      resolve(tasks);
    });
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    let task: Task | undefined;
    if (this._allTasks, length > 0) {
      task = this._allTasks.find(t => t.id === id);
    } else {
      const response = await this._firestoreService.getTasks();
      if (response.docs) {
        const tasks = response.docs.map(d => {
          const data = d.data() as Task;
          data.id = d.id;
          return data;
        });
        task = tasks.find(t => t.id === id);
      }
    }
    return new Promise((resolve) => {
      resolve(task);
    });
  }

  async createTask(task: Task): Promise<string> {
    task = this.sanitizeTask(task);
    const timeStamp = new Date();
    task.uid = this.loggedInUser.uid;
    task.createdDate = timeStamp;
    task.updatedDate = timeStamp;
    const response = await this._firestoreService.createTask(task);
    this._vibrationService.vibrateOnce();
    this._snackbarService.openSnackBar(SnackbarMessages.TaskCreated);
    return new Promise((resolve) => {
      resolve(response.id);
    });
  }

  async updatetask(taskId: string, task: Task, message: SnackbarMessages = SnackbarMessages.TaskUpdated, vibrate: boolean): Promise<void> {
    task = this.sanitizeTask(task);
    task.updatedDate = new Date();
    task.uid = this.loggedInUser.uid;
    const response = await this._firestoreService.updateTask(task);
    this._snackbarService.openSnackBar(message);
    if (vibrate) {
      this._vibrationService.vibrateinPattern();
    }
    return new Promise((resolve) => {
      resolve(response);
    });
  }

  async deletetask(taskId: string): Promise<void> {
    const response = await this._firestoreService.deleteTask(taskId);
    this._vibrationService.vibrateOnce();
    this._snackbarService.openSnackBar(SnackbarMessages.TaskDeleted);
    return new Promise((resolve) => {
      resolve(response);
    });
  }

  private sanitizeTask(task: Task): Task {
    task.title = task.title.trim();
    task.subtasks.forEach(s => s.subtitle = s.subtitle.trim());
    task.notes = task.notes.trim();
    return task;
  }

}
