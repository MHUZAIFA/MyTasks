import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceType, SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { GeneralTaskService } from 'src/app/services/general.task..service';
import { PanelService, DetailsPanelActions } from 'src/app/services/panel.service';
import { SnackbarMessages } from 'src/app/services/snackbar.service';
import { TaskListService } from 'src/app/services/task-list.service';
import { CreateTaskComponent } from '../../create-task/create-task.component';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {

  @Input() searchModeActive: boolean = false;
  public get tasks$(): Observable<Task[]> { return this.m_taskListService.tasks$; }
  public get loading$(): Observable<boolean> { return this.m_taskListService.loading$; }
  public get isSearchMode(): boolean { return this.m_taskListService.isSearchMode; }

  constructor(public taskService: GeneralTaskService, private _bottomSheet: MatBottomSheet, private m_taskListService: TaskListService, private m_panelService: PanelService, private _systemSettingsService: SystemSettingsService, private router: Router) {
    taskService.instance.tasksListUpdatedAvailable().subscribe(updateAvailable => {
      if (updateAvailable !== null && !_systemSettingsService.isSameDevice) {
        this.m_taskListService.reload();
      }
    });
  }

  ngOnInit(): void {
    this.m_taskListService.reload();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(CreateTaskComponent, { panelClass: 'custom_bottom_sheet' });
  }

  deleteTask(id: string) {
    this._systemSettingsService.isSameDevice = true;
    this.taskService.instance.deletetask(id)
      .then(() => {
        this.m_taskListService.reload()
        if (this._systemSettingsService.deviceType === DeviceType.Desktop) {
          this.router.navigateByUrl(this._systemSettingsService.basePath + '/(sidepanel:default)');
        }
      })
      .catch((error) => console.error(error))
      .finally(() => this._systemSettingsService.isSameDevice = false);
  }

  toggleTask(id: string) {
    const task = this.m_taskListService.tasks.find(t => t.id === id);
    if (task) {
      if (this._systemSettingsService.deviceType === DeviceType.Mobile) {
        task.completed = !task.completed;
        task.completedDate = task.completed ? new Date() : null;
        const message = task.completed ? SnackbarMessages.TaskCompleted : SnackbarMessages.TaskRestored;
        this._systemSettingsService.isSameDevice = true;
        this.taskService.instance.updatetask(id, task, message, task.completed)
          .then(() => {
            this.m_taskListService.reload();
          })
          .catch((error) => console.error(error))
          .finally(() => this._systemSettingsService.isSameDevice = false);
      } else {
        const action: DetailsPanelActions = task.completed ? DetailsPanelActions.Reopen : DetailsPanelActions.MarkAsDone;
        this.m_panelService.performAction(action);
      }
    }

  }

}
