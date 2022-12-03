import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BaseTask } from '../base-task';
import { CATEGORY, Reminder, RepeatedTask, Task, TaskMetaData } from '../models/task';
import { PanelService, DetailsPanelActions } from '../../services/panel.service';
import { TaskMetadataModalsService } from 'src/app/services/task-metadata-modals.service';
import { TaskListService } from 'src/app/services/task-list.service';
import { SnackbarMessages, SnackbarService } from 'src/app/services/snackbar.service';
import { UTILITY } from '../utilities/utility';
import { TaskDataService } from 'src/app/services/task-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { GeneralTaskService } from 'src/app/services/general.task..service';
import { AlertComponent } from './alert/alert.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.sass']
})
export class TaskDetailsComponent extends BaseTask implements OnDestroy {

  private m_isNotFound: boolean = false;
  public get isNotFound(): boolean { return this.m_isNotFound; }
  private m_loading: boolean = true;
  public get loading(): boolean { return this.m_loading; }
  categories = [CATEGORY.NOCATEGORY, CATEGORY.WORK, CATEGORY.PERSONAL, CATEGORY.WISHLIST, CATEGORY.BIRTHDAY];
  subscriptions: Subscription[] = [];
  DetailsPanelActions = DetailsPanelActions;

  public get selectedDate(): Date | null { return this.dueDate; }

  private m_isUpdateAvailable: boolean = false;
  public get isReadonly(): boolean { return this.completed || this.m_isUpdateAvailable; }
  public get isCompleted(): boolean { return this.completed; }
  public get menuOptions(): DetailsPanelActions[] {
    return this.isReadonly ? [DetailsPanelActions.Duplicate, DetailsPanelActions.Reopen] : [DetailsPanelActions.MarkAsDone, DetailsPanelActions.Duplicate, DetailsPanelActions.Delete];
  }
  public get canSave(): boolean {
    this.m_panelService.editMode = !this.isEqual(this.original);
    const result = !this.isEqual(this.original) && !this.m_isUpdateAvailable;
    return result;
  }

  get isUpdateAvailable(): boolean {
    return this.m_isUpdateAvailable;
  }

  constructor(
    private m_panelService: PanelService,
    private m_taskService: GeneralTaskService,
    private m_taskListService: TaskListService,
    private route: ActivatedRoute,
    private router: Router,
    public taskDataService: TaskDataService,
    private m_snackbarService: SnackbarService,
    public dialog: MatDialog,
    public systemSettingsService: SystemSettingsService,
    public taskMetadataModalService: TaskMetadataModalsService) {
    super();
    const detailsPanelActionsSub = this.m_panelService.performActionEvent$().subscribe(action => this.performAction(action));
    this.subscriptions.push(detailsPanelActionsSub);
  }

  ngOnInit(): void {
    const routeSub = this.route.params.subscribe(params => {
      const taskId = params['id'];
      if (!!taskId) {
        this.id = taskId;
        this.original.id = this.id;
        this.loadTask(this.id);
      }
    });

    if (this.systemSettingsService.isMobileDevice && this.m_taskListService.searchTerm.length > 0) {
      this.m_taskListService.searchTerm = '';
    }

    const updateAvailableSub = this.m_taskService.instance.taskUpdatedAvailable(this.id)
      .subscribe((updatedTaskAvailabe) => {
        if (updatedTaskAvailabe !== null && !this.systemSettingsService.isSameDevice) {
          if (!this.canSave) {
            this.loadTask(this.id);
          } else {
            const dialogRef = this.dialog.open(AlertComponent);
            dialogRef.componentInstance.alertTitle = 'Task details updated';
            dialogRef.componentInstance.alertDescription = 'This task details has been update. Click refresh to get latest details or cancel to keep viewing the task details in read-only mode.';
            dialogRef.componentInstance.color = 'primary';
            dialogRef.componentInstance.alertPrimaryActionText = 'Refresh';
            dialogRef.afterClosed().subscribe((result: boolean) => {
              if (result) {
                this.loadTask(this.id);
              } else {
                this.m_isUpdateAvailable = true;
              }
            });
          }
        }
      });

    this.subscriptions = [routeSub, updateAvailableSub];

  }

  ngOnDestroy(): void {
    this.reset();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setMetadata() {
    const metaDataSub = this.taskMetadataModalService.metadataModal(this.getMetadataInstance()).subscribe((result: TaskMetaData) => {
      if (result) {
        this.updateMetadata(result);
      }
    });
    this.subscriptions.push(metaDataSub);
  }

  loadTask(id: string) {
    this.m_loading = true;
    this.m_taskService.instance.getTaskById(id)
      .then((task: Task | undefined) => {
        if (!!task) {
          this.reset();
          this.setTask(task);
          this.m_isUpdateAvailable = false;
          this.m_isNotFound = false;
        } else {
          this.m_isNotFound = true;
          console.error('Task not found for id: ' + id)
        }
        this.m_loading = false;
      });
  }

  updateTime(timeString: string) {
    this.dueDate = new Date(timeString);
  }

  openReminderModal() {
    this.taskMetadataModalService.reminderModal(this.metadata).subscribe((result: Reminder) => {
      if (result) {
        this.reminder = new Reminder(result.isReminderOn, result.remindAt);
      }
    });
  }

  openRepeatModal() {
    this.taskMetadataModalService.repeatedModal(this.metadata).subscribe((result: RepeatedTask) => {
      if (result) {
        this.repeatedTask = new RepeatedTask(result.isRepeated, result.interval);
      }
    });
  }


  performAction(action: DetailsPanelActions) {
    switch (action) {
      case DetailsPanelActions.Close:
        this.close();
        break;
      case DetailsPanelActions.Refresh:
        this.loadTask(this.id);
        break;
      case DetailsPanelActions.MarkAsDone:
      case DetailsPanelActions.Reopen:
        this.toggleTask();
        break;
      case DetailsPanelActions.Duplicate:
        if (!this.isEqual(this.original) && this.isValidTitle()) {
          const message = 'Unsaved changes! \nKindly save or discard your changes before duplicating a task.';
          this.m_snackbarService.openSnackBar(message, 5, 'right', 'top');
        } else {
          this.createDuplicateTask();
        }
        break;
      case DetailsPanelActions.Save:
        if (this.isValidTitle()) {
          this.systemSettingsService.isSameDevice = true;
          this.m_taskService.instance.updatetask(this.id, this.getTaskInstance(), SnackbarMessages.TaskUpdated, false)
            .then(() => {
              this.m_taskListService.reload();
              this.setTask(this.getTaskInstance());
            })
            .catch(error => console.error(error))
            .finally(() => this.systemSettingsService.isSameDevice = false);
        }
        break;
      case DetailsPanelActions.Discard:
        this.setTask(this.original);
        break;
      case DetailsPanelActions.Delete:
        this.deleteTask(this.id);
        break;
    }
  }

  private createDuplicateTask() {
    this.taskId = UTILITY.GenerateUUID();
    this.completed = false;
    this.createdDate = new Date();
    this.title = this.title.trim() + ' - copy';
    this.systemSettingsService.isSameDevice = true;
    this.m_taskService.instance.createTask(this.getTaskInstance())
      .then((newTaskId) => {
        this.id = newTaskId;
        this.m_taskListService.reload();
        this.setTask(this.getTaskInstance());
        this.m_snackbarService.openSnackBar(SnackbarMessages.DuplicateCreated)
        if (this.systemSettingsService.isMobileDevice) {
          this.router.navigate([this.systemSettingsService.basePath, this.id]);
        } else {
          this.router.navigateByUrl(`${this.systemSettingsService.basePath}/(sidepanel:${this.id})`);
        }
      })
      .catch(error => console.error(error))
      .finally(() => this.systemSettingsService.isSameDevice = false);
  }

  private close() {
    if (this.systemSettingsService.isMobileDevice) {
      this.router.navigate([this.systemSettingsService.basePath]);
    } else {
      this.router.navigateByUrl(this.systemSettingsService.basePath + '/(sidepanel:default)');
    }
  }

  private isValidTitle(): boolean {
    if (this.id && !this.title) {
      const message = 'Invalid title! \nKindly add a title.';
      this.m_snackbarService.openSnackBar(message, 10, 'right', 'top');
      return false;
    }
    return true;
  }

  private deleteTask(id: string) {
    this.systemSettingsService.isSameDevice = true;
    this.m_taskService.instance.deletetask(id)
      .then(() => this.m_taskListService.reload())
      .catch((error) => console.error(error))
      .finally(() => {
        this.systemSettingsService.isSameDevice = false;
        this.close();
      });
  }

  private toggleTask() {
    if (this.isValidTitle()) {
      this.completed = !this.completed;
      this.completedDate = this.completed ? new Date() : null;
      this.original = this.getTaskInstance();
      const message = this.completed ? SnackbarMessages.TaskCompleted : SnackbarMessages.TaskRestored;
      this.systemSettingsService.isSameDevice = true;
      this.m_taskService.instance.updatetask(this.id, this.getTaskInstance(), message, this.completed)
        .then(() => {
          this.m_taskListService.reload();
          this.setTask(this.getTaskInstance());
        })
        .catch((error) => console.error(error))
        .finally(() => this.systemSettingsService.isSameDevice = false);
    }
  }

}
