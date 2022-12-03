import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubTask } from '../models/task';

@Component({
  selector: 'app-subtask-unit',
  templateUrl: './subtask-unit.component.html',
  styleUrls: ['./subtask-unit.component.sass']
})
export class SubtaskUnitComponent {

  @Input() subTask: SubTask | null = null;
  @Input() isDisabled: boolean = false;
  @Input() last: boolean = false;
  @Output() remove = new EventEmitter();
  @Output() addSubtaskEvent = new EventEmitter();

  addSubtask() { this.addSubtaskEvent.emit(); }
  delete() { this.remove.emit(); }

}
