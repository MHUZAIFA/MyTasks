import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemSettingsService } from '../../auth/services/system-settings.service';
import { DateRange } from '../../models/DateRange';
import { TaskFilter } from '../../models/TaskFilter';
import { TaskDataService } from '../../services/task-data.service';
import { TaskListService } from '../../services/task-list.service';
import { CATEGORY, Task } from '../models/task';

export class AreaChartModel {
  name: string = '';
  series: ChartSeries[] = [];
}

export class ChartSeries {
  name: string | undefined = '';
  value: number = 0;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  chartCategories: CATEGORY[] = [CATEGORY.NOCATEGORY, CATEGORY.WORK, CATEGORY.PERSONAL, CATEGORY.WISHLIST, CATEGORY.BIRTHDAY];
  private m_areaChartData: AreaChartModel[] = [];
  public get areaChartData(): AreaChartModel[] { return this.m_areaChartData; }

  private m_gaugeChartData: ChartSeries[] = [];
  public get gaugeChartData(): ChartSeries[] { return this.m_gaugeChartData; }

  private m_gaugeChartMax: number = 0;
  public get gaugeChartMax(): number { return this.m_gaugeChartMax; }

  public get noTasks(): boolean { return this.m_taskDataService.tasks.length === 0; }

  get noSearchResult(): boolean { return this.m_taskListService.isSearchMode && this.m_taskListService.tasks.length === 0; }

  constructor(
    public systemSettingsService: SystemSettingsService,
    private m_taskListService: TaskListService,
    private m_taskDataService: TaskDataService,
    private router: Router,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.systemSettingsService.createOnline$().subscribe(isOnline => {
      if (isOnline) {
        this.m_taskDataService.loadTasks();
      } else {
        this.router.navigate(['offline']);
      }
    });
    this.m_taskListService.tasks$.subscribe(tasks => {
      this.m_gaugeChartData = this.computeGaugeChartData(tasks);
    });
  }

  filterList(category: CATEGORY) {
    const selectedCategory = category ? [category] : [];
    this.m_taskListService.filter = new TaskFilter({ completed: null, category: selectedCategory, createdDate: new DateRange(null, null) })
  }

  private computeGaugeChartData(tasks: Task[]): ChartSeries[] {
    const chartData: ChartSeries[] = [];
    this.m_gaugeChartMax = 0;
    this.chartCategories.forEach(category => {
      const series: ChartSeries = new ChartSeries();

      const taskWithCategory = tasks.filter(t => t.category === category);
      const completedTaskWithCategory = taskWithCategory.filter(t => t.completed === true);
      const totalTasksInCategory = taskWithCategory.length;
      this.m_gaugeChartMax = totalTasksInCategory > this.gaugeChartMax ? totalTasksInCategory : this.gaugeChartMax;
      series.name = category;
      series.value = completedTaskWithCategory.length;
      chartData.push(series);
    });
    return chartData;
  }

  private computeAreaChartData(tasks: Task[]): AreaChartModel[] {
    const uniqueDates = [...new Set(tasks.map(t => new Date(t.createdDate).setHours(0, 0, 0, 0)))];

    uniqueDates.sort(function (a, b) {
      return +new Date(a) - +new Date(b);
    });

    const length = uniqueDates.length;
    const lastSevenDates = length > 7 ? uniqueDates.slice(-7, length) : uniqueDates.slice(0, 7);

    const chartData: AreaChartModel[] = [];

    this.chartCategories.forEach(category => {
      const chartModel: AreaChartModel = new AreaChartModel();
      chartModel.name = category;
      chartModel.series = [];
      lastSevenDates.forEach(date => {
        const tasksOntheDate = tasks.filter(t => new Date(t.createdDate).setHours(0, 0, 0, 0) === date);
        const seriesItem: ChartSeries = new ChartSeries();
        seriesItem.name = this.datePipe.transform(new Date(date), 'mediumDate')?.toString();
        seriesItem.value = tasksOntheDate.filter(t => t.category === category).length;
        chartModel.series.push(seriesItem);
      });
      chartData.push(chartModel);
    });
    return chartData;
  }

}
