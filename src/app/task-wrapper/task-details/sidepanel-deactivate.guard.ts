import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertComponent } from './alert/alert.component';
import { TaskDetailsComponent } from './task-details.component';

@Injectable({
  providedIn: 'root'
})
export class SidepanelDeactivateGuard implements CanDeactivate<TaskDetailsComponent> {

  constructor(public dialog: MatDialog) { }

  canDeactivate(
    component: TaskDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (component.canSave && !component.isUpdateAvailable) {
      return this.openDialog();
    } else {
      return true;
    }

  }

  private openDialog(): Observable<any> {
    const dialogRef = this.dialog.open(AlertComponent);
    return dialogRef.afterClosed();
  }

}
