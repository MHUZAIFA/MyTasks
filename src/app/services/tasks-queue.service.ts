import { Injectable } from '@angular/core';
import { Task } from '../task-wrapper/models/task';
import { TasksFirestoreService } from './tasks.firestore.service';

export enum ACTION {
  CREATE,
  UPDATE,
  DELETE
}

export interface IActionQueueItem {
  id: string, // taskId not id
  task: Task,
  action: ACTION,
}

@Injectable({
  providedIn: 'root'
})
export class TasksQueueService {

  private m_actionQueue: IActionQueueItem[] = [];
  private m_tasks: Task[] = [];
  public get actionQueue(): IActionQueueItem[] { return this.m_actionQueue; }
  public get isQueueEmpty(): boolean { return this.m_actionQueue.length === 0; }
  public get tasks(): Task[] { return this.m_tasks; }
  public set tasks(tasks: Task[]) { this.m_tasks = tasks; }

  constructor(private m_taskFirestoreService: TasksFirestoreService) { }

  addActionItem(item: IActionQueueItem) {
    this.m_actionQueue.push(item);
  }

  updateActionItem(item: IActionQueueItem) {
    const index = this.m_actionQueue.findIndex(q => q.id === item.id && q.action === item.action);
    if (index) {
      this.m_actionQueue[index] = item;
    }
  }

  removeActionItem(item: IActionQueueItem) {
    const index = this.m_actionQueue.findIndex(q => q.id === item.id && q.action === item.action);
    if (index) {
      this.m_actionQueue = this.m_actionQueue.splice(index, 1);
    }
  }

  removeAllActionItemById(id: string) {
    const items = this.m_actionQueue.filter(q => q.id = id);
    items.forEach(i => this.removeActionItem(i));
  }

  synchronizeActionQueue(tasks: Task[]) {
    tasks.forEach(t => {
      const conflictingTask = this.m_actionQueue.find(q => q.id === t.taskId);
      if (conflictingTask) {
        // check timestamp of both retrieved task and task in queue
        const retrievedTimestamp = new Date(t.updatedDate);
        const localTimeStamp = conflictingTask.task.updatedDate;
        // if item in queue has past timestamp discard it else do nothing as all actions in queue performed later.
        if (localTimeStamp < retrievedTimestamp) {
          this.removeAllActionItemById(conflictingTask.id);
        }
      }
    });
  }

  async processQueueItem() {
    console.log('Syncing...', this.m_actionQueue);
    // perform create operations at first
    const createActions = this.m_actionQueue.filter(q => q.action === ACTION.CREATE);
    if (createActions.length > 0) {
      createActions.forEach(async (i) => await this.performAction(i));
    }
    const response = await this.m_taskFirestoreService.getTasks();
      if (response.docs) {
        this.m_tasks = response.docs.map(d => {
          const data = d.data() as Task;
          data.id = d.id;
          return data;
        });
      }
    const updateActions = this.m_actionQueue.filter(q => q.action === ACTION.UPDATE);
    if (updateActions.length > 0) {
      updateActions.forEach(async (i) => await this.performAction(i));
    }
    const deleteActions = this.m_actionQueue.filter(q => q.action === ACTION.DELETE);
    if (deleteActions.length > 0) {
      deleteActions.forEach(async (i) => await this.performAction(i));
    }
    this.m_actionQueue = [];
  }

  async performAction(item: IActionQueueItem): Promise<any> {
    let result: any;
    switch(item.action) {
      case ACTION.CREATE:
        return await this.m_taskFirestoreService.createTask(item.task);
      case ACTION.UPDATE:
        return await this.m_taskFirestoreService.updateTask(item.task);
      case ACTION.DELETE:
        return await this.m_taskFirestoreService.updateTask(item.task);
    }
  }

}
