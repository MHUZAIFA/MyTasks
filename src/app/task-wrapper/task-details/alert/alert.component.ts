import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.sass']
})
export class AlertComponent {

  alertTitle: string = 'You have unsaved changes';
  alertDescription: string = 'Are you sure you want to discard you changes?';
  alertPrimaryActionText: string = 'Discard';
  color = 'warn';

  constructor(public dialogRef: MatDialogRef<AlertComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
