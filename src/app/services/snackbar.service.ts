import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

export enum SnackbarMessages {
  NoUser = 'No user found!',
  AuthFailed = 'Incorrect Username or Password!',
  welcomeBack = 'Welcome Back',
  TaskCreated = 'Task Created successfully.',
  DuplicateCreated = 'Duplicate Task Created successfully.',
  TaskUpdated = 'Task Updated successfully.',
  TaskDeleted = 'Task Deleted successfully.',
  TaskCompleted = 'Hurray! Good Work..!!!',
  TaskRestored = 'Task Restored.'
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: SnackbarMessages | string, durationInSeconds: number = 2, horizontalPosition: MatSnackBarHorizontalPosition = 'center', verticalPosition: MatSnackBarVerticalPosition = 'bottom',  ) {
    this._snackBar.open(message, 'dismiss', {
      duration: durationInSeconds * 1000,
      panelClass: ['custom-snackbar'],
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition
    });
  }

}
