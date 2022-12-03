import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { TaskMetadataModalsService } from 'src/app/services/task-metadata-modals.service';
import { INTERVAL, RemindAT, Reminder, RepeatedTask, TaskMetaData } from '../models/task';

@Component({
  selector: 'app-task-metadata',
  templateUrl: './task-metadata.component.html',
  styleUrls: ['./task-metadata.component.sass']
})
export class TaskMetadataComponent implements OnInit {

  metadata: TaskMetaData = new TaskMetaData(null, null, new Reminder(false, RemindAT.FiveMinBefore), new RepeatedTask(false, INTERVAL.DAILY));
  selectedDate: Date | null = new Date();
  selectedJumpTo: DateOptions = DateOptions.NODATE;
  DateOptions: DateOptions[] = [DateOptions.NODATE, DateOptions.TODAY, DateOptions.TOMORROW, DateOptions.THREEDAYSLATER, DateOptions.THISSUNDAY];

  constructor(
    public dialog: MatDialog,
    public systemSettingsService: SystemSettingsService,
    public taskMetadataModalService: TaskMetadataModalsService,
    public dialogRef: MatDialogRef<TaskMetadataComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.metadata.dueDate = this.data.metadata.dueDate ? new Date(this.data.metadata.dueDate) : this.data.metadata.dueDate;
    this.metadata.time = this.data.metadata.time ? new Date(this.data.metadata.time) : this.data.metadata.time;
    this.metadata.reminder = this.data.metadata.reminder;
    this.metadata.repeatedTask = this.data.metadata.repeatedTask;
    this.selectedDate = this.metadata.dueDate;
    this.setJumpTo(this.selectedDate);
  }

  onCanelClicked(): void {
    this.dialogRef.close();
  }

  dueDateUpdate() {
    this.metadata.dueDate = this.selectedDate ? new Date(this.selectedDate) : new Date();
  }

  jumpToDate(option: DateOptions) {
    this.selectedJumpTo = option;
    const date = new Date();
    switch (option) {
      case DateOptions.NODATE:
        this.selectedDate = null;
        this.metadata.time = null;
        break;
      case DateOptions.TODAY:
        this.selectedDate = date;
        break;
      case DateOptions.TOMORROW:
        this.selectedDate = new Date(date.setDate(date.getDate() + 1));
        break;
      case DateOptions.THREEDAYSLATER:
        this.selectedDate = new Date(date.setDate(date.getDate() + 3));
        break;
      case DateOptions.THISSUNDAY:
        this.selectedDate = new Date(date.setDate(date.getDate() + (1 + 6 - date.getDay()) % 7));
        break;
    }
    this.metadata.dueDate = this.selectedDate;
  }

  updateTime(timeString: string) {
    this.metadata.time = new Date(timeString);
  }

  openReminderModal() {
    this.taskMetadataModalService.reminderModal(this.metadata).subscribe((result: Reminder) => {
      if (result) {
        this.metadata.reminder = new Reminder(result.isReminderOn, result.remindAt);
      }
    });
  }

  openRepeatModal() {
    this.taskMetadataModalService.repeatedModal(this.metadata).subscribe((result: RepeatedTask) => {
      if (result) {
        this.metadata.repeatedTask = new RepeatedTask(result.isRepeated, result.interval);
      }
    });
  }

  private setJumpTo(value: Date | null) {
    if (!value) {
      this.selectedJumpTo = DateOptions.None;
    } else {
      const date = this.withoutTime(value);
      const today = this.withoutTime(new Date());

      if (+date === today.setDate(today.getDate())) {
        this.selectedJumpTo = DateOptions.TODAY;
      } else if (+date === today.setDate(today.getDate() + 1)) {
        this.selectedJumpTo = DateOptions.TOMORROW;
      } else if (+date === today.setDate(today.getDate() + 1)) {
        this.selectedJumpTo = DateOptions.THREEDAYSLATER;
      }
      if (date.getDay() === 0) {
        this.selectedJumpTo = DateOptions.THISSUNDAY;
      }
    }

  }

  private withoutTime(date: Date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}


export enum DateOptions {
  None = 'None',
  NODATE = 'No Date',
  TODAY = 'Today',
  TOMORROW = 'Tomorrow',
  THREEDAYSLATER = '3 Days Later',
  THISSUNDAY = 'This Sunday'
}
