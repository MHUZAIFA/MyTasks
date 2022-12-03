import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-metadata-unit',
  templateUrl: './metadata-unit.component.html',
  styleUrls: ['./metadata-unit.component.sass']
})
export class MetadataUnitComponent implements OnInit {

  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() isDisabled: boolean = false;
  @Input() hideBorder: boolean = false;
  @Input() disableTitle: string = '';

  @Output() clicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  sectionClicked() {
    this.clicked.emit();
  }

}
