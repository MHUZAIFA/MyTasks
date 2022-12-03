import { Component, Input, OnInit } from '@angular/core';
import { TaskListService } from 'src/app/services/task-list.service';
import { CATEGORY } from '../models/task';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.sass']
})
export class ProgressComponent implements OnInit {

  private m_progress: number = 0;
  public get progress(): number { return Math.round(this.m_progress); }
  private m_selectedCategory: CATEGORY | null = null;
  public get selectedCateory(): CATEGORY | null { return this.m_selectedCategory; }

  completedCount: number = 0;
  totalCount: number = 0;

  constructor(private m_taskListService: TaskListService) { }

  ngOnInit(): void {
    this.m_taskListService.tasks$.subscribe(tasks => {
      const completedCount = tasks.filter(t => t.completed).length;
      const totalCount = tasks.length > 0 ? tasks.length : 1;
      this.totalCount = tasks.length;
      this.completedCount = completedCount;
      this.m_progress = (completedCount / totalCount) * 100;
      this.m_selectedCategory = this.m_taskListService.filter.category[0];
    });
  }

}
