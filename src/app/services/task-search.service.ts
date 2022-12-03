import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { DateRange } from '../models/DateRange';
import { TaskFilter } from '../models/TaskFilter';
import { CATEGORY, Task } from '../task-wrapper/models/task';
import { State } from './state.service';
import { TaskDataService } from './task-data.service';
import * as moment from 'moment';

export class SearchResult {
  tasks: Task[];
  total: number;

  constructor(tasks: Task[], total: number) {
    this.tasks = tasks;
    this.total = total;
  }
}

@Injectable({
  providedIn: 'root',
})
export abstract class TaskSearchService {
  private _search$ = new Subject<void>();

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _error$ = new BehaviorSubject<Error | null>(null);
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _searchLoading$ = new BehaviorSubject<boolean>(true);

  private _state: State = new State();
  private _defaultFilter$ = new BehaviorSubject<TaskFilter>(new TaskFilter());

  get loading$() { return this._loading$.asObservable(); }
  get error$() { return this._error$.asObservable(); }
  get tasks$() { return this._tasks$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get defaultFilter$(): Observable<TaskFilter> { return this._defaultFilter$.asObservable(); }


  get tasks() { return this._tasks$.getValue(); }
  get searchTerm() { return this._state.searchTerm; }
  get filter() { return this._state.filter; }

  get noTasks(): boolean { return this._taskDataService.tasks.length === 0; }

  set searchTerm(searchTerm: string) {
    if (searchTerm.trim().length === 1) {
      return;
    }
    this._set({ searchTerm });
  }

  set filter(filter: TaskFilter) {
    this._set({ filter });
  }

  get isSearchMode(): boolean {
    return (
      this.searchTerm.trim().length > 1 ||
      !this._state.filter.equal(this._defaultFilter$.getValue())
    );
  }

  private subscriptions: Subscription[] = [];

  protected constructor(protected _taskDataService: TaskDataService) {
    // Loading is set to true if the call to API is being made or the search is performed
    const loadingSub = combineLatest(
      this._searchLoading$,
      this._taskDataService.loading$
    ).subscribe(([searchLoading, rolesLoading]) =>
      this._loading$.next(searchLoading || rolesLoading)
    );

    this._search$
      .pipe(
        debounceTime(400),
        tap(() => this._searchLoading$.next(true)),
        switchMap(() => this.search())
      )
      .subscribe(
        (result) => {
          this._tasks$.next(result.tasks);
          this._total$.next(result.total);
          this._error$.next(null);
          this._searchLoading$.next(false);
        },
        (error) => {
          this._error$.next(error);
          this._searchLoading$.next(false);
        }
      );

    const taskSub = this._taskDataService.tasks$.subscribe(
      (_) => this._search$.next(),
      (error) => this._search$.error(error)
    );

    this.subscriptions.push(loadingSub, taskSub);
  }

  static dateInRange(date: Date, dateRange: DateRange): boolean {
    if (date == null && (dateRange.begin != null || dateRange.end != null)) {
      return false;
    }

    return (
      (date == null && dateRange.begin == null && dateRange.end == null) ||
      ((dateRange.begin == null ||
        moment(moment(date).format('L')).isSameOrAfter(
          moment(dateRange.begin)
        )) &&
        (dateRange.end == null ||
          moment(moment(date).format('L')).isSameOrBefore(
            moment(dateRange.end)
          )))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private search(): Observable<SearchResult> {
    // 1. Search
    let tasks: Task[] = this._taskDataService.tasks.filter((t) => this.matchesSearchTerm(t));

    // 2. Filter
    tasks = tasks.filter((t) => this.matchesFilter(t));

    // 3. Sort
    tasks = tasks.sort((a, b) => {
      const aStartDate = new Date(a.dueDate ? a.dueDate : a.createdDate);
      const bStartDate = new Date(b.dueDate ? b.dueDate : b.createdDate);
      if (a.completed === b.completed) {
        const acompletionDate = a.completedDate ? new Date(a.completedDate) : null;
        const bcompletionDate = b.completedDate ? new Date(b.completedDate) : null;

        return a.completed ? (acompletionDate && bcompletionDate && (acompletionDate >= bcompletionDate) ? -1 : 1) : (aStartDate >= bStartDate ? 1 : -1);
      } else {
        return a.completed ? 1 : -1;
      }
    });

    const total = tasks.length;

    return of(new SearchResult(tasks, total));
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  public reload() { this._taskDataService.loadTasks(); }
  public reset() { this.filter = this._defaultFilter$.getValue().clone(); }

  private matchesFilter(task: Task): boolean {
    if (this.filter.completed !== null && task.completed === this.filter.completed) { return false; }
    if (this.filter.category.length > 0 && !this.filter.category.includes(task.category as CATEGORY)) { return false; }
    return TaskSearchService.dateInRange(new Date(task.createdDate), this.filter.createdDate);
  }

  abstract matchesSearchTerm(task: Task): boolean;
}
