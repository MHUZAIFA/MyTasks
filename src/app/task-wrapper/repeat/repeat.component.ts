import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { INTERVAL, RepeatedTask } from '../models/task';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.sass']
})
export class RepeatComponent {

  repeatedTask: RepeatedTask = new RepeatedTask(false, INTERVAL.DAILY)

  color: ThemePalette = 'primary';
  disabled = false;
  intervals: INTERVAL[] = [INTERVAL.NONE, INTERVAL.HOURLY, INTERVAL.DAILY, INTERVAL.WEEKLY, INTERVAL.MONTHLY, INTERVAL.YEARLY];

  constructor(public dialogRef: MatDialogRef<RepeatComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {

  }

  setRepeatInterval(interval: INTERVAL) {
    this.repeatedTask.isRepeated = true;
    this.repeatedTask.interval = interval;
  }

  ngOnInit(): void {
    this.repeatedTask.isRepeated = this.data.m_repeatedTask.isRepeated;
    this.repeatedTask.interval = this.data.m_repeatedTask.interval;
  }

  onCanelClicked(): void {
    this.dialogRef.close();
  }

}
