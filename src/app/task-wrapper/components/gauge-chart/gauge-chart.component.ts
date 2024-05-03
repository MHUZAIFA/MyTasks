import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { CATEGORY } from '../../models/task';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.sass'],
})
export class GaugeChartComponent implements OnInit, AfterViewInit {

  @Input() container: any = undefined;
  @Input() max: number = 0;
  @Input() chartTile: string = '';
  @Output() selectedEvent = new EventEmitter();
  @Input() chartData: any = [];

  private m_canReset: boolean = false;
  public get canReset(): boolean { return this.m_canReset; }

  view: [number, number] = [0, 0];
  legend: boolean = true;
  legentTitle: string = '';
  legendPosition: LegendPosition = LegendPosition.Below;

  colorScheme: Color = {
    name: 'Custom_gauge_color_scheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#833AB4', '#3b5998', '#FF0000', '#1DA1F2', '#3d464d', '#fff'],
  };

  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.onResize(); }, 100);
  }

  onSelect(data: any): void {
    const selectedCategory: CATEGORY = JSON.parse(JSON.stringify(data)) as CATEGORY;
    this.m_canReset = !!selectedCategory;
    this.selectedEvent.emit(selectedCategory);

  }

  onActivate(data: any): void { }

  onDeactivate(data: any): void { }

  axisFormat(val: any) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }

  onResize() {
    const containerHeight = this.container?.clientHeight;
    const containerWidth = this.container?.clientWidth;
    if (containerHeight && containerWidth) {
      this.view = [containerWidth + 10, containerHeight];
    }
    setTimeout(() => {
      const chartEl = document.getElementById('chart');
      if(chartEl) {
        const textEl = chartEl.getElementsByTagName('tspan')[0].parentElement;
        if (textEl) {
          textEl.style.fontSize = '3rem';
          textEl.style.transform = 'none';
        }
      }
    }, 500);
  }

  getBigSegments(): number {
    const max = this.max;
    if (max % 2 === 0) {
      return max / 2;
    } else if (max % 3 === 0) {
      console.log(max)
      return max / 3;
    } else if (max % 5 === 0) {
      return max / 5;
    } else {
      return max;
    }
  }

}
