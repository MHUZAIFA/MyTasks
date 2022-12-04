import { Component, OnInit } from '@angular/core';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';

@Component({
  selector: 'app-task-details-default',
  templateUrl: './task-details-default.component.html',
  styleUrls: ['./task-details-default.component.sass']
})
export class TaskDetailsDefaultComponent implements OnInit {

  constructor(public systemSettingsService: SystemSettingsService) { }

  ngOnInit(): void {
  }

}
