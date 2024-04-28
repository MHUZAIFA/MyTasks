import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { DateRange } from 'src/app/models/DateRange';
import { TaskFilter } from 'src/app/models/TaskFilter';
import { TaskListService } from 'src/app/services/task-list.service';
import { CreateTaskComponent } from '../../create-task/create-task.component';
import { CATEGORY } from '../../models/task';

@Component({
  selector: 'app-task-list-header',
  templateUrl: './task-list-header.component.html',
  styleUrls: ['./task-list-header.component.sass']
})
export class TaskListHeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() searchModeActive: boolean = false;

  categories = [CATEGORY.ALL, CATEGORY.WORK, CATEGORY.PERSONAL, CATEGORY.WISHLIST, CATEGORY.BIRTHDAY, CATEGORY.PROJECTS];
  selectedCategory = CATEGORY.ALL;

  constructor(
    public systemSettingsService: SystemSettingsService,
    private m_router: Router,
    private _bottomSheet: MatBottomSheet,
    public taskListService: TaskListService) { }

  ngOnInit(): void {
    this.taskListService.tasks$.subscribe(() => {
      const selectedCategory = this.taskListService.filter.category;
      this.selectedCategory = selectedCategory.length === 0 ? CATEGORY.ALL : selectedCategory[0];
    });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.searchModeActive) {
        const el = document.getElementById('tasksSearchText');
        if (el) { el.focus() }
      }
    }, 10);
  }

  ngOnDestroy(): void {
    this.taskListService.searchTerm = '';
  }

  openBottomSheet(): void {
    this._bottomSheet.open(CreateTaskComponent, { panelClass: 'custom_bottom_sheet' });
  }

  showTasks(item: CATEGORY) {
    this.selectedCategory = item;
    if (item === CATEGORY.ALL) {
      this.taskListService.filter = new TaskFilter();
    } else {
      this.taskListService.filter = new TaskFilter({ completed: null, category: [item], createdDate: new DateRange(null, null) });
    }
  }

  searchInFocus() {
    if (this.systemSettingsService.isMobileDevice && !this.searchModeActive) {
      this.m_router.navigate(['tasks/search']);
    }
  }
}
