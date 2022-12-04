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
    if (index !== -1) {
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

  registrationModeUpdateUUID(uuid: string) {
    console.log('Queue: ', this.m_actionQueue)
    if (this.m_actionQueue.length > 0) {
      this.m_actionQueue.forEach(i => i.task.uid = uuid);
    }
  }

  clearQueue() { this.m_actionQueue = []; }

  async processQueueItem() {
    let list: IActionQueueItem[] = [];
    const queue: IActionQueueItem[] = this.m_actionQueue;
    console.log('Syncing...', queue);
    // perform create operations at first
    const createActions = queue.filter(q => q.action === ACTION.CREATE);
    list = this.sortQueueItemsByDate(createActions);
    console.log('sorted list', list);
    if (list.length > 0) {
      await Promise.all(list.map(async (i) => {
        const response = await this.performAction(i);
        queue.forEach(q => q.id === i.id ? q.task.id = response.id : '');
      }))
        .then(_ => {
          const updateActions = queue.filter(q => q.action === ACTION.UPDATE);
          list = this.sortQueueItemsByDate(updateActions);
          console.log('sorted list', list);
          if (list.length > 0) {
            list.forEach(async (i) => await this.performAction(i));
          }
          const deleteActions = queue.filter(q => q.action === ACTION.DELETE);
          list = this.sortQueueItemsByDate(deleteActions);
          console.log('sorted list', list);
          if (list.length > 0) {
            list.forEach(async (i) => await this.performAction(i));
          }
        })
        .catch(err => console.error(err));
    }
  }

  async performAction(item: IActionQueueItem): Promise<any> {
    switch (item.action) {
      case ACTION.CREATE:
        return await this.m_taskFirestoreService.createTask(item.task);
      case ACTION.UPDATE:
      case ACTION.DELETE:
        return await this.m_taskFirestoreService.updateTask(item.task);
    }
  }

  private sortQueueItemsByDate(arr: IActionQueueItem[]): IActionQueueItem[] {
    return arr.sort((a, b) => {
      const aDate = new Date(a.task.updatedDate);
      const bDate = new Date(b.task.updatedDate);
      return (aDate.getTime() / 1000) - (bDate.getTime() / 1000);
    });
  }

}
