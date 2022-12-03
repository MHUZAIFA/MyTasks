import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/task-wrapper/models/task';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list-unit',
  templateUrl: './task-list-unit.component.html',
  styleUrls: ['./task-list-unit.component.sass']
})
export class TaskListUnitComponent implements OnInit {

  @Input() task: Task | null = null;
  @Output() deleteEvent = new EventEmitter();
  @Output() toggleEvent = new EventEmitter();

  currentDate: Date = new Date();
  public get displayMetaData(): boolean {
    return !!this.task && (this.task.repeatedTask.isRepeated || this.task.dueDate === this.currentDate || this.task.subtasks.length > 0 || !!this.task.notes || this.task.attachments.length > 0);
  }

  constructor(public systemSettingsService: SystemSettingsService, private router: Router) { }

  ngOnInit(): void {
  }

  taskDetails() {
    if (this.task) {
      if (this.systemSettingsService.isMobileDevice) {
        this.router.navigate(['tasks', this.task.id]);
      } else {
        this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: this.task.id } }]);
      }
    }
  }

}
