import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.sass']
})
export class TimePickerComponent implements OnInit {

  @Input() selectedDate: Date | null = null;
  @Input() isDisabled: boolean = false;
  @Input() disableTitle: string = '';
  @Output() timeUpdateEvent = new EventEmitter();
  @Input() set time(time: Date | null) { this.timeString = time ? time.toString() : null }


  timeString: string | null = null;

  constructor() { }

  ngOnInit(): void {
    if (this.timeString)
    this.selectedDate = new Date(this.timeString);
  }

  timeChangeHandler(value: string) {
    if (value && this.timeString) {
      this.selectedDate = new Date(value);
      this.timeString = new Date(value).toString();
      this.timeUpdateEvent.emit(this.timeString);
    }
  }

}
