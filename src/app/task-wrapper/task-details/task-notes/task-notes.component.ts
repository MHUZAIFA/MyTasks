import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseTask } from '../../base-task';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';

@Component({
  selector: 'app-task-notes',
  templateUrl: './task-notes.component.html',
  styleUrls: ['./task-notes.component.sass']
})
export class TaskNotesComponent extends BaseTask {

  constructor(
    public dialogRef: MatDialogRef<TaskNotesComponent>,
    public override m_storage: AngularFireStorage,
    public override sanitizer: DomSanitizer,
    public override m_authServie: AuthenticationService
  ) {
    super(m_storage, sanitizer, m_authServie);
  }

  onDoneClicked(): void {
    this.dialogRef.close();
  }

  onCanelClicked(): void {
    this.notes = this.original.notes;
    this.dialogRef.close();
  }

}
