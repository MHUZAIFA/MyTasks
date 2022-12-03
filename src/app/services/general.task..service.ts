import { Injectable } from "@angular/core";
import { SystemSettingsService } from "../auth/services/system-settings.service";
import { ITaskService } from "./ITaskService";
import { LocalTaskService } from "./local.task.service";
import { TaskService } from "./task.service";

@Injectable({
  providedIn: 'root',
})
export class GeneralTaskService {

  constructor (
    private _localTaskService: LocalTaskService,
    private _taskService: TaskService,
    private _systemSettingService: SystemSettingsService
  ) {}

  public get instance(): ITaskService {
    return this._systemSettingService.isGuestMode ? this._localTaskService : this._taskService;
  }
}
