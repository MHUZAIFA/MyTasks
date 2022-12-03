import { CATEGORY } from "../task-wrapper/models/task";
import { DateRange } from "./DateRange";

export class TaskFilter {

  completed: boolean | null;
  category: CATEGORY[];
  createdDate: DateRange;

  constructor(filter?: {
    completed: boolean | null;
    category: CATEGORY[];
    createdDate: DateRange;
  }) {
    if (!filter) {
      // Default constructor
      this.completed = null;
      this.category = [];
      this.createdDate = new DateRange(null, null);
    } else {
      this.completed = filter.completed;
      this.category = filter.category;
      this.createdDate = new DateRange(null, null);
    }
  }

  public equal(filter: TaskFilter): boolean {
    return this.completed === filter.completed &&
      this.arraysEqual(this.category, filter.category) &&
      this.createdDate.equal(filter.createdDate);
  }

  public clone(): TaskFilter {
    const newFilter = new TaskFilter();
    newFilter.completed = this.completed;
    newFilter.category = [...this.category];
    newFilter.createdDate = new DateRange(this.createdDate.begin, this.createdDate.end);
    return newFilter;
  }

  private arraysEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
