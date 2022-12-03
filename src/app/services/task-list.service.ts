import { Injectable } from '@angular/core';
import { Task } from '../task-wrapper/models/task';
import { TaskDataService } from './task-data.service';
import { TaskSearchService } from './task-search.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListService extends TaskSearchService {

  constructor(protected _tasksDataService: TaskDataService) {
    super(_tasksDataService);
  }

  matchesSearchTerm(task: Task): boolean {
    const searchTerm = this.searchTerm.trim().toLocaleLowerCase();
    return task.title.toLocaleLowerCase().includes(searchTerm);
  }
}
