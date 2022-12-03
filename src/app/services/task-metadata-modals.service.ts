import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SystemSettingsService } from '../auth/services/system-settings.service';
import { Reminder, RepeatedTask, TaskMetaData } from '../task-wrapper/models/task';
import { ReminderComponent } from '../task-wrapper/reminder/reminder.component';
import { RepeatComponent } from '../task-wrapper/repeat/repeat.component';
import { TaskMetadataComponent } from '../task-wrapper/task-metadata/task-metadata.component';

@Injectable({
  providedIn: 'root'
})
export class TaskMetadataModalsService {

  constructor(public dialog: MatDialog, private systemSettingsService:SystemSettingsService) { }

  metadataModal(metadata: TaskMetaData): Observable<any> {
    const dialogRef = this.dialog.open(TaskMetadataComponent, {
      width: '100%',
      maxWidth:  this.systemSettingsService.isMobileDevice && this.systemSettingsService.isLandscapeMode ? '500px' : '350px',
      panelClass: 'theme_modal',
      data: {
        metadata: metadata
      },
      disableClose: true
    });

    return dialogRef.afterClosed();
  }

  reminderModal(metadata: TaskMetaData): Observable<any> {
    const dialogRef = this.dialog.open(ReminderComponent, {
      minWidth: '380px',
      panelClass: 'theme_modal',
      data: { m_reminder: metadata.reminder },
      disableClose: true
    });

    return dialogRef.afterClosed();
  }

  repeatedModal(metadata: TaskMetaData): Observable<any> {
    const dialogRef = this.dialog.open(RepeatComponent, {
      data: { m_repeatedTask: metadata.repeatedTask },
      panelClass: 'theme_modal',
      disableClose: true
    });

    return dialogRef.afterClosed();
  }
}
