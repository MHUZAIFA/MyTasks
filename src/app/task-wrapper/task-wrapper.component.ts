import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-task-wrapper',
  templateUrl: './task-wrapper.component.html',
  styleUrls: ['./task-wrapper.component.sass'],
  providers: [DatePipe]
})
export class TaskWrapperComponent { }
