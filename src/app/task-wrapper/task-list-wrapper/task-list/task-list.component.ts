import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { DeviceType, SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { PanelService, DetailsPanelActions } from 'src/app/services/panel.service';
import { SnackbarMessages } from 'src/app/services/snackbar.service';
import { TaskListService } from 'src/app/services/task-list.service';
import { TasksService } from 'src/app/services/tasks.service';
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

  constructor(public taskService: TasksService, private _bottomSheet: MatBottomSheet, private m_taskListService: TaskListService, private m_panelService: PanelService, private _systemSettingsService: SystemSettingsService, private router: Router, private m_authService: AuthenticationService) {
    // taskService.instance.tasksListUpdatedAvailable().subscribe(updateAvailable => {
    //   if (updateAvailable !== null && !_systemSettingsService.isSameDevice) {
    //     this.m_taskListService.reload();
    //   }
    // });
  }

  async ngOnInit() {
    this._systemSettingsService.isOnline$().subscribe(async (isOnline) => {
      if (isOnline && !this.m_authService.loggedInUser.isGuest) {
        this._systemSettingsService.isOfflineMode = false;
        await this.taskService.synchronize();
      }
      if (!isOnline) {
        this._systemSettingsService.isOfflineMode = true;
      }
    });
    await this.taskService.synchronize();
    this.m_taskListService.reload();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(CreateTaskComponent, { panelClass: 'custom_bottom_sheet' });
  }

  deleteTask(taskId: string) {
    const task = this.m_taskListService.tasks.find(t => t.taskId === taskId);
    if (task) {
      this._systemSettingsService.isSameDevice = true;
      this.taskService.deletetask(task)
        .then(() => {
          this.m_taskListService.reload()
          if (this._systemSettingsService.deviceType === DeviceType.Desktop) {
            this.router.navigateByUrl(this._systemSettingsService.basePath + '/(sidepanel:default)');
          }
        })
        .catch((error) => console.error(error))
        .finally(() => this._systemSettingsService.isSameDevice = false);
    }
  }

  toggleTask(taskId: string) {
    const task = this.m_taskListService.tasks.find(t => t.taskId === taskId);
    if (task) {
      if (this.m_panelService.id === taskId) {
        const action: DetailsPanelActions = task.completed ? DetailsPanelActions.Reopen : DetailsPanelActions.MarkAsDone;
        this.m_panelService.performAction(action);
      } else {
        task.completed = !task.completed;
        task.completedDate = task.completed ? new Date() : null;
        const message = task.completed ? SnackbarMessages.TaskCompleted : SnackbarMessages.TaskRestored;
        this._systemSettingsService.isSameDevice = true;
        this.taskService.updatetask(task, message, task.completed)
          .then(() => {
            this.m_taskListService.reload();
          })
          .catch((error) => console.error(error))
          .finally(() => this._systemSettingsService.isSameDevice = false);
      }
    }

  }

}
