import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum DetailsPanelActions {
  Close = 'Close',
  MarkAsDone = 'Mark as Done',
  Delete = 'Delete',
  Duplicate = 'Duplicate Task',
  Reopen = 'Reopen Task',
  Refresh = 'Refresh',
  Save = 'Save',
  Discard = 'Discard',
  None = 'None'
}

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  public id: string = '';

  private m_editMode: boolean = false;
  public get editMode(): boolean { return this.m_editMode; }
  public set editMode(editMode: boolean) { this.m_editMode = editMode; }

  // perform action in details panel
  private _action = new BehaviorSubject<DetailsPanelActions>(DetailsPanelActions.None);
  public get getAction(): string { return this._action.getValue(); }
  public performActionEvent$() { return this._action.asObservable(); }
  public performAction(action: DetailsPanelActions) { this._action.next(action); }

}
