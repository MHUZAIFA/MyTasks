import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.sass']
})
export class AreaChartComponent implements OnInit {

  @Input() container: any = undefined;
  @Input() chartData: any = [];
  curve = shape.curveCardinal.tension(0.3);
  view: [number, number] = [0, 0];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  timeline: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;
  colorScheme: Color = {
    name: 'Custom_pie_color_scheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0a173b', '#17236a', '#204864', '#71788f', '#eaf0f7'],
  };

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.onResize(); }, 100);
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onResize() {
    const containerHeight = this.container?.clientHeight;
    const containerWidth = this.container?.clientWidth;
    if (containerHeight && containerWidth) {
      this.view = [containerWidth + 10, containerHeight - 100];
    }
  }

}
