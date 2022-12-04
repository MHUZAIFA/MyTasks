import { Injectable } from '@angular/core';
import { AuthenticationService } from '../auth/services/authentication.service';
import { SystemSettingsService } from '../auth/services/system-settings.service';
import { Task } from '../task-wrapper/models/task';
import { User } from '../task-wrapper/models/user';
import { UTILITY } from '../task-wrapper/utilities/utility';
import { LocalTaskService } from './local.task.service';
import { SnackbarMessages, SnackbarService } from './snackbar.service';
import { ACTION, IActionQueueItem, TasksQueueService } from './tasks-queue.service';
import { TasksFirestoreService } from './tasks.firestore.service';
import { VibrationService } from './vibration.service';


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

  async synchronize() {
    if (this.isOnline) {
      // get latest tasks
      let tasks: Task[] = [];
      tasks = await this.getTasksFromCloud();
      if (!this.m_taskQueueService.isQueueEmpty) {
        // check items in queue
        this.m_taskQueueService.synchronizeActionQueue(tasks);
        // after syncing perform remaining actions in the queue
        this.m_taskQueueService.processQueueItem();
        // get latest after update
        tasks = await this.getTasksFromCloud();
      }
      this.m_localTaskService.updateLocalStorage(tasks);
      this._allTasks = tasks;
      this.m_taskQueueService.tasks = tasks;
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
    if (this._allTasks, length > 0) {
      task = this._allTasks.find(t => t.taskId === id);
    } else {
      task = await this.m_localTaskService.getTaskById(id);
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
    const actionQueueItem: IActionQueueItem = { id: task.taskId, task: task, action: ACTION.CREATE }
    if (this.isOnline && !this.loggedInUser.isGuest) {
      const response = await this.m_taskQueueService.performAction(actionQueueItem);
      task.id = response.id;
    } else {
      this.m_taskQueueService.addActionItem(actionQueueItem);
    }
    await this.m_localTaskService.createTask(actionQueueItem.task, false);
    this.m_taskQueueService.tasks = await this.m_localTaskService.getTasks();
    return new Promise((resolve) => {
      resolve(task.taskId);
    });
  }

  async updatetask(task: Task, message: SnackbarMessages = SnackbarMessages.TaskUpdated, vibrate: boolean): Promise<void> {
    task = this.sanitizeTask(task);
    task.updatedDate = new Date();
    task.uid = this.loggedInUser.uid;
    console.log('id: ',task.id, 'taskid: ', task.taskId)
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
