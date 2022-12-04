import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SystemSettingsService } from '../auth/services/system-settings.service';


@Component({
  selector: 'app-task-wrapper',
  templateUrl: './task-wrapper.component.html',
  styleUrls: ['./task-wrapper.component.sass'],
  providers: [DatePipe]
})
export class TaskWrapperComponent implements OnInit {

  constructor(private m_systemSettingsService: SystemSettingsService) { }

  ngOnInit(): void {
    // this.m_systemSettingsService.isRegistrationMode = false;
  }
}
