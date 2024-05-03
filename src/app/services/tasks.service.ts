import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { SystemSettingsService } from '../auth/services/system-settings.service';
import { Task } from '../task-wrapper/models/task';
import { User } from '../task-wrapper/models/user';
import { LocalTaskService } from './local.task.service';
import { SnackbarMessages } from './snackbar.service';
import { ACTION, IActionQueueItem, TasksQueueService } from './tasks-queue.service';
import { TasksFirestoreService } from './tasks.firestore.service';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  get loggedInUser(): User { return this.m_authService.loggedInUser; }
  public get isOnline(): boolean { return !this.m_systemSettingsService.isOfflineMode; }
  private _allTasks: Task[] = [];
  get allTasks(): Task[] { return this._allTasks; }

  constructor(
    private m_authService: AuthenticationService,
    private m_taskFirestoreService: TasksFirestoreService,
    private m_taskQueueService: TasksQueueService,
    private m_localTaskService: LocalTaskService,
    private m_systemSettingsService: SystemSettingsService) { }

  public tasksListUpdatedAvailable(): Observable<any> {
    if (this.isOnline && !this.loggedInUser.isGuest) {
      return this.m_taskFirestoreService.tasksListUpdatedAvailable();
    } else {
      return of(null);
    }
  }

  public taskUpdatedAvailable(taskId: string): Observable<any> {
    const task = this._allTasks.find(t => t.taskId === taskId);
    if (task && this.isOnline && !this.loggedInUser.isGuest) {
      return this.m_taskFirestoreService.taskUpdatedAvailable(task.id)
    } else {
      return of(null);
    }
  }

  async synchronize() {
    if (this.isOnline && !this.loggedInUser.isGuest) {
      if (this.m_systemSettingsService.isRegistrationMode) {
        this.m_taskQueueService.registrationModeUpdateUUID(this.loggedInUser.uid);
        this.m_systemSettingsService.isRegistrationMode = false;
      }

      // get latest tasks
      let tasks: Task[] = [];
      tasks = await this.getTasksFromCloud();
      if (!this.m_taskQueueService.isQueueEmpty) {
        // check items in queue
        this.m_taskQueueService.synchronizeActionQueue(tasks);
        // after syncing perform remaining actions in the queue
        this.m_taskQueueService.processQueueItem();
        this.m_taskQueueService.clearQueue();
        // get latest after update
        tasks = await this.getTasksFromCloud();
      }
      this.m_localTaskService.updateLocalStorage(tasks);
      this._allTasks = tasks;
    }
  }

  async getTasks(): Promise<Task[]> {
    let tasks = await this.m_localTaskService.getTasks();
    tasks = tasks.filter(t => !t.isDeleted);
    return new Promise((resolve) => {
      resolve(tasks);
    });
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    let task: Task | undefined;
    task = await this.m_localTaskService.getTaskById(id);
    return new Promise((resolve) => {
      resolve(task);
    });
  }

  async createTask(task: Task, suppressNotification: boolean): Promise<string> {
    task = this.sanitizeTask(task);
    const timeStamp = new Date();
    task.uid = this.loggedInUser.uid;
    task.createdDate = timeStamp;
    task.updatedDate = timeStamp;
    const actionQueueItem: IActionQueueItem = { id: task.taskId, task: task, action: ACTION.CREATE }
    if (this.isOnline && !this.loggedInUser.isGuest) {
      const response = await this.m_taskQueueService.performAction(actionQueueItem);
      task.id = response.id;
    } else {
      this.m_taskQueueService.addActionItem(actionQueueItem);
    }
    await this.m_localTaskService.createTask(actionQueueItem.task, suppressNotification);
    this.m_taskQueueService.tasks = await this.m_localTaskService.getTasks();
    return new Promise((resolve) => {
      resolve(task.taskId);
    });
  }

  async updatetask(task: Task, message: SnackbarMessages = SnackbarMessages.TaskUpdated, vibrate: boolean): Promise<void> {
    task = this.sanitizeTask(task);
    task.updatedDate = new Date();
    task.uid = this.loggedInUser.uid;
    const actionQueueItem: IActionQueueItem = { id: task.taskId, task: task, action: ACTION.UPDATE }
    if (this.isOnline && !this.loggedInUser.isGuest) {
      await this.m_taskQueueService.performAction(actionQueueItem);
    } else {
      const index = this.m_taskQueueService.actionQueue.findIndex(i => i.id === task.taskId && i.action === actionQueueItem.action);
      if (index === -1) {
        this.m_taskQueueService.addActionItem(actionQueueItem);
      } else {
        this.m_taskQueueService.updateActionItem(actionQueueItem);
      }

    }
    await this.m_localTaskService.updatetask(actionQueueItem.task, message, vibrate, false);
    this.m_taskQueueService.tasks = await this.m_localTaskService.getTasks();
    return new Promise((resolve) => {
      resolve();
    });
  }

  async deletetask(task: Task): Promise<void> {
    task.isDeleted = true;
    const actionQueueItem: IActionQueueItem = { id: task.taskId, task: task, action: ACTION.DELETE }
    if (this.isOnline && !this.loggedInUser.isGuest) {
      this.m_taskQueueService.performAction(actionQueueItem);
    } else {
      const index = this.m_taskQueueService.actionQueue.findIndex(i => i.id === task.taskId && i.action === actionQueueItem.action);
      if (index === -1) {
        this.m_taskQueueService.addActionItem(actionQueueItem);
      } else {
      this.m_taskQueueService.updateActionItem(actionQueueItem);
      }
    }
    await this.m_localTaskService.deletetask(task, false);
    this.m_taskQueueService.tasks = await this.m_localTaskService.getTasks();
    return new Promise((resolve) => {
      resolve();
    });
  }

  private sanitizeTask(task: Task): Task {
    task.title = task.title.trim();
    task.subtasks.forEach(s => s.subtitle = s.subtitle.trim());
    task.notes = task.notes.trim();
    return task;
  }

  private async getTasksFromCloud(): Promise<Task[]> {
    let tasks: Task[] = [];
    if (this.isOnline) {
      const response = await this.m_taskFirestoreService.getTasks();
      if (response.docs) {
        tasks = response.docs.map(d => {
          const data = d.data() as Task;
          data.id = d.id;
          return data;
        });
      }
    }

    return new Promise((resolve) => {
      resolve(tasks);
    });

  }

}
