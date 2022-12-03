import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceType, SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { FormService } from 'src/app/services/form.service';
import { GeneralTaskService } from 'src/app/services/general.task..service';
import { PanelService } from 'src/app/services/panel.service';
import { TaskListService } from 'src/app/services/task-list.service';
import { TaskMetadataModalsService } from 'src/app/services/task-metadata-modals.service';
import { BaseTask } from '../base-task';
import { CATEGORY, Task, TaskMetaData } from '../models/task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.sass']
})
export class CreateTaskComponent extends BaseTask implements AfterViewInit, OnDestroy {

  categories: CATEGORY[] = [CATEGORY.NOCATEGORY, CATEGORY.WORK, CATEGORY.PERSONAL, CATEGORY.WISHLIST, CATEGORY.BIRTHDAY];
  subscription: Subscription | null = null;

  public get isCreateDisabled(): boolean {
    return !this.title;
  }

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<CreateTaskComponent>,
    public formService: FormService,
    private systemSettingsService: SystemSettingsService,
    private router: Router,
    private panelService: PanelService,
    public taskMetadataModalService: TaskMetadataModalsService,
    private m_taskService: GeneralTaskService, private m_taskListService: TaskListService) {
    super();
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
    this.systemSettingsService.isSameDevice = true;
    this.m_taskService.instance.createTask(task)
      .then((id: string) => {
        this.m_taskListService.reload();
        if (this.systemSettingsService.deviceType === DeviceType.Desktop && !this.panelService.editMode) {
          setTimeout(() => {
            this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: id } }]);
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

}
