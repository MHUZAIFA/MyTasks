import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RemindAT, Reminder } from '../models/task';
@Component({

  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.sass']
})
export class ReminderComponent implements OnInit {

  reminder: Reminder = new Reminder(false, RemindAT.FiveMinBefore);
  color: ThemePalette = 'primary';
  disabled = false;
  remindAT: RemindAT[] = [RemindAT.FiveMinBefore, RemindAT.TenMinBefore, RemindAT.FifteenMinBefore, RemindAT.ThirtyMinBefore];

  constructor(public dialogRef: MatDialogRef<ReminderComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.reminder.isReminderOn = this.data.m_reminder.isReminderOn;
    this.reminder.remindAt = this.data.m_reminder.remindAt;
  }

  onCanelClicked(): void {
    this.dialogRef.close();
  }

}
