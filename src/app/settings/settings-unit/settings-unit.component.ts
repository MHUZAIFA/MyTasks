import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-unit',
  templateUrl: './settings-unit.component.html',
  styleUrls: ['./settings-unit.component.sass']
})
export class SettingsUnitComponent implements OnInit {


  @Input() icon: string = '';
  @Input() text: string = '';
  @Input() hideBorder: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
