import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, fromEvent } from 'rxjs';
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
import { AlertComponent } from './alert/alert.component';
import { TasksService } from 'src/app/services/tasks.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.sass']
})
export class TaskDetailsComponent extends BaseTask implements OnDestroy {

  private m_isNotFound: boolean = false;
  private onDestroy$: Subject<void> = new Subject<void>();
  private m_loading: boolean = true;
  private m_isUpdateAvailable: boolean = false;

  public categories = [CATEGORY.NOCATEGORY, CATEGORY.WORK, CATEGORY.PERSONAL, CATEGORY.WISHLIST, CATEGORY.BIRTHDAY, CATEGORY.PROJECTS];
  public subscriptions: Subscription[] = [];
  public DetailsPanelActions = DetailsPanelActions;

  public get isNotFound(): boolean { return this.m_isNotFound; }
  public get loading(): boolean { return this.m_loading; }
  public get selectedDate(): Date | null { return this.dueDate; }
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

  public get isUpdateAvailable(): boolean { return this.m_isUpdateAvailable; }
  public get isGuestUser(): boolean { return this.m_authService.loggedInUser.isGuest; }

  constructor(
    private m_panelService: PanelService,
    private m_taskService: TasksService,
    private m_taskListService: TaskListService,
    override m_authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    override m_storage: AngularFireStorage,
    override sanitizer: DomSanitizer,
    public taskDataService: TaskDataService,
    private m_snackbarService: SnackbarService,
    public dialog: MatDialog,
    public systemSettingsService: SystemSettingsService,
    public taskMetadataModalService: TaskMetadataModalsService) {
    super(m_storage, sanitizer, m_authService);
    const detailsPanelActionsSub = this.m_panelService.performActionEvent$().subscribe(action => this.performAction(action));
    this.subscriptions.push(detailsPanelActionsSub);
  }

  ngOnInit(): void {
    const routeSub = this.route.params.subscribe(params => {
      const taskId = params['id'];
      if (!!taskId) {
        this.taskId = taskId;
        this.m_panelService.id = this.taskId;
        this.original.taskId = this.taskId;
        this.loadTask(this.taskId);
        if (this.id) {
          this.setupRealTimeSubscription();
        }
      }
    });

    if (this.systemSettingsService.isMobileDevice && this.m_taskListService.searchTerm.length > 0) {
      this.m_taskListService.searchTerm = '';
    }

    this.subscriptions = [routeSub];

    this.listenToKeyboardEvents().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(event => {
      this.handleKeyboardEvent(event as KeyboardEvent);
    });

  }

  ngOnDestroy(): void {
    this.reset();
    this.subscriptions.forEach(s => s.unsubscribe());
    this.onDestroy$.next();
    this.onDestroy$.complete();
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
    this.m_taskService.getTaskById(id)
      .then((task: Task | undefined) => {
        if (!!task) {
          this.reset();
          this.setTask(task);
          this.m_isUpdateAvailable = false;
          this.m_isNotFound = false;
          console.log(task)
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
          this.uploadAttachments().then(() => {
            this.removeAttachmentsFromFirebase(this.attachmentsToRemove).then(() => {
              this.attachmentsToRemove = [];
              this.m_taskService.updatetask(this.getTaskInstance(), SnackbarMessages.TaskUpdated, false)
              .then(() => {
                this.m_taskListService.reload();
                this.setTask(this.getTaskInstance());
              })
              .catch(error => console.error(error))
              .finally(() => this.systemSettingsService.isSameDevice = false);
            });
          });
        }
        break;
      case DetailsPanelActions.Discard:
        this.setTask(this.original);
        this.attachmentsToRemove = [];
        break;
      case DetailsPanelActions.Delete:
        this.deleteTask(this.taskId);
        break;
    }
  }

  onFileChanged(event: any) {
    const files = event.target.files;
    if (files.length === 0) return;
    console.log(files);
    // this.uploadAttachments(files);
    this.previewFiles(files);

    const inputEl = document.getElementById("uploadImage") as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // Clear the input element
    }
  }

  removeAttachmentById(idToRemove: string): void {
    // Find the index of the attachment with the given ID
    const indexToRemove = this.attachments.findIndex(attachment => attachment.id === idToRemove);
    
    // If the attachment with the given ID is found, remove it from the array
    if (indexToRemove !== -1) {
      // delete on save as user can still discard changes
      this.attachmentsToRemove.push(this.original.attachments[indexToRemove]);
  
      // Remove from local array
      const updatedAttachments = this.attachments.filter(attachment => attachment.id !== idToRemove);
      this.attachments = updatedAttachments;
    }
  }

  private createDuplicateTask() {
    this.id = '';
    this.taskId = UTILITY.GenerateUUID();
    this.completed = false;
    this.createdDate = new Date();
    this.title = this.title.trim() + ' - copy';
    this.systemSettingsService.isSameDevice = true;
    this.m_taskService.createTask(this.getTaskInstance(), true)
      .then((newTaskId) => {
        this.id = newTaskId;
        this.m_taskListService.reload();
        this.setTask(this.getTaskInstance());
        this.m_snackbarService.openSnackBar(SnackbarMessages.DuplicateCreated)
        if (this.systemSettingsService.isMobileDevice) {
          this.router.navigate([this.systemSettingsService.basePath, this.taskId]);
        } else {
          this.router.navigateByUrl(`${this.systemSettingsService.basePath}/(sidepanel:${this.taskId})`);
        }
      })
      .catch(error => console.error(error))
      .finally(() => this.systemSettingsService.isSameDevice = false);
  }

  private close() {
    this.m_panelService.id = '';
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
    const task = this.m_taskListService.tasks.find(t => t.taskId === id);
    if (task) {
    this.systemSettingsService.isSameDevice = true;
    this.m_taskService.deletetask(task)
      .then(() => this.m_taskListService.reload())
      .catch((error) => console.error(error))
      .finally(() => {
        this.systemSettingsService.isSameDevice = false;
        this.close();
      });
    }
  }

  private toggleTask() {
    if (this.isValidTitle()) {
      this.completed = !this.completed;
      this.completedDate = this.completed ? new Date() : null;
      this.original = this.getTaskInstance();
      const message = this.completed ? SnackbarMessages.TaskCompleted : SnackbarMessages.TaskRestored;
      this.systemSettingsService.isSameDevice = true;
      this.m_taskService.updatetask(this.getTaskInstance(), message, this.completed)
        .then(() => {
          this.m_taskListService.reload();
          this.setTask(this.getTaskInstance());
        })
        .catch((error) => console.error(error))
        .finally(() => this.systemSettingsService.isSameDevice = false);
    }
  }

  private setupRealTimeSubscription() {
    const updateAvailableSub = this.m_taskService.taskUpdatedAvailable(this.taskId)
      .subscribe((updatedTaskAvailabe) => {
        if (updatedTaskAvailabe !== null && !this.systemSettingsService.isSameDevice) {
          if (!this.canSave) {
            this.loadTask(this.taskId);
          } else {
            const dialogRef = this.dialog.open(AlertComponent);
            dialogRef.componentInstance.alertTitle = 'Task details updated';
            dialogRef.componentInstance.alertDescription = 'This task details has been update. Click refresh to get latest details or cancel to keep viewing the task details in read-only mode.';
            dialogRef.componentInstance.color = 'primary';
            dialogRef.componentInstance.alertPrimaryActionText = 'Refresh';
            dialogRef.afterClosed().subscribe((result: boolean) => {
              if (result) {
                this.loadTask(this.taskId);
              } else {
                this.m_isUpdateAvailable = true;
              }
            });
          }
        }
      });
      this.subscriptions.push(updateAvailableSub);
  }

  private listenToKeyboardEvents() {
    return fromEvent(document, 'keydown');
  }

  private handleKeyboardEvent(event: KeyboardEvent) {

    if (event.ctrlKey || event.metaKey) { // Check if Ctrl or Cmd key is pressed
      if (event.key === 's') {
        // Ctrl/Cmd + S
        event.preventDefault();
        this.performAction(DetailsPanelActions.Save)
      } else if (event.key === 'd') {
        // Ctrl/Cmd + D
        event.preventDefault();
        this.performAction(DetailsPanelActions.Discard)
      }
    }

    if (event.key === 'Escape') {
      // Escape key
      if (this.systemSettingsService.isMobileDevice) {
        this.router.navigate([this.systemSettingsService.basePath]);
      } else {
        this.router.navigateByUrl(this.systemSettingsService.basePath + '/(sidepanel:default)');
      }
    }
  }

}
