import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { DeviceType, SystemSettingsService } from '../../auth/services/system-settings.service';
import { PanelService } from '../../services/panel.service';
import { TaskListService } from '../../services/task-list.service';
import { TaskMetadataModalsService } from '../../services/task-metadata-modals.service';
import { BaseTask } from '../base-task';
import { CATEGORY, Task, TaskMetaData } from '../models/task';
import { UTILITY } from '../utilities/utility';
import { MatDialog } from '@angular/material/dialog';
import { DocumentUploaderComponent } from '../components/document-uploader/document-uploader.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.sass']
})
export class CreateTaskComponent extends BaseTask implements AfterViewInit, OnDestroy {

  categories: CATEGORY[] = [CATEGORY.NOCATEGORY, CATEGORY.WORK, CATEGORY.PERSONAL, CATEGORY.WISHLIST, CATEGORY.BIRTHDAY,CATEGORY.PROJECTS];
  subscription: Subscription | null = null;

  public get isCreateDisabled(): boolean {
    return !this.title;
  }

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<CreateTaskComponent>,
    private systemSettingsService: SystemSettingsService,
    private router: Router,
    private panelService: PanelService,
    public taskMetadataModalService: TaskMetadataModalsService,
    private m_taskService: TasksService,
    private m_taskListService: TaskListService,
    private dialog: MatDialog,
    override m_storage: AngularFireStorage,
    override sanitizer: DomSanitizer,
    override m_authServie: AuthenticationService,) {
    super(m_storage, sanitizer, m_authServie);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.focusCreateTask();
      const selectedCategories = this.m_taskListService.filter.category;
      if (selectedCategories.length > 0) {
        this.category = selectedCategories[0];
      }
    }, 10);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  create() {
    const task: Task = this.getTaskInstance();
    task.taskId = UTILITY.GenerateUUID();
    this.systemSettingsService.isSameDevice = true;
    this.m_taskService.createTask(task)
      .then((id: string) => {
        this.m_taskListService.reload();
        if (this.systemSettingsService.deviceType === DeviceType.Desktop && !this.panelService.editMode) {
          setTimeout(() => {
            this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: task.taskId } }]);
          }, 200);
        }
      })
      .catch(error => console.error(error))
      .finally(() => {
        this.systemSettingsService.isSameDevice = false;
        this._bottomSheetRef.dismiss();
      });
  }

  setMetadata() {
    this.subscription = this.taskMetadataModalService.metadataModal(this.getMetadataInstance()).subscribe((result: TaskMetaData) => {
      if (result) { this.updateMetadata(result); }
      console.log('The metada dialog was closed', result);
    });
  }

  focusCreateTask() {
    const el = document.getElementById('input_create');
    if (el) { el.focus(); }
  }

  selectAttachment() {
    // TODO: Add alogic to display a modal
    // where user can select, delete and preview files

    /*  Steps:
    1. Open dialog (pass current attachements as input and read updated attachments on close)
    */

    this.openDialog();

  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(DocumentUploaderComponent, {
      data: {attachments: this.attachments},
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      
      // this.attachments = result;
    });
  }

}
