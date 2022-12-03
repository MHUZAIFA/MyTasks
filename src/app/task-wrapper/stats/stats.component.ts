import { Component, OnInit } from '@angular/core';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { TaskListService } from 'src/app/services/task-list.service';
import { Task } from '../models/task';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.sass']
})
export class StatsComponent implements OnInit {

  private m_total: number = 0;
  private m_completed: number = 0;
  private m_taskPerDay: number = 0;

  public get completed(): number { return this.m_completed; }
  public get taskPerDay(): number { return Math.floor(this.m_taskPerDay); }
  public get total(): number { return Math.round(this.m_total); }

  constructor(private m_taskListService: TaskListService, public systemSettingsService: SystemSettingsService) { }

  ngOnInit(): void {
    this.m_taskListService.tasks$.subscribe(tasks => {
      this.m_total = tasks.length;
      this.m_completed = tasks.filter(t => t.completed).length;
      this.m_taskPerDay = this.computeTaskPerDay(tasks);
    });
  }

  private computeTaskPerDay(tasks: Task[]): number {
    let completedCount = tasks.filter(t => t.completed).length;
    const uniqueDates: number[] = [];
    tasks.filter(t => {
      if (t.completedDate) {
        const date = new Date(t.completedDate).setHours(0, 0, 0, 0);
        if (!uniqueDates.includes(date)) {
          uniqueDates.push(date);
        }
      }
    });
    let uniqueDatesCount = uniqueDates.length;
    uniqueDatesCount = uniqueDatesCount > 0 ? uniqueDatesCount : 1;
    return completedCount/uniqueDatesCount;
  }

  private computeProductivity(tasks: Task[]): number {
    let productivity = 0;
    const dates = tasks.map(t => new Date(t.createdDate));
    dates.forEach(d => {
      const tasksOnDate = tasks.filter(t => new Date(t.createdDate).setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0));
      const completedTasks = tasksOnDate.filter(t => t.completed).length;
      productivity = productivity + (completedTasks / tasks.length);
    });

    return dates.length > 0 ? (productivity / dates.length) * 100 : 0;
  }

}
