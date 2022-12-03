import { TaskFilter } from "../models/TaskFilter";

export class State {
  searchTerm: string;
  filter: TaskFilter;

  constructor() {
    this.searchTerm = '';
    this.filter = new TaskFilter();
  }
}
