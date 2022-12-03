import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseTask } from '../../base-task';

@Component({
  selector: 'app-task-notes',
  templateUrl: './task-notes.component.html',
  styleUrls: ['./task-notes.component.sass']
})
export class TaskNotesComponent extends BaseTask {

  constructor(public dialogRef: MatDialogRef<TaskNotesComponent>) {
    super()
  }

  onDoneClicked(): void {
    this.dialogRef.close();
  }

  onCanelClicked(): void {
    this.notes = this.original.notes;
    this.dialogRef.close();
  }

}
