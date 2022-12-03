import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListUnitComponent } from './task-list-unit.component';

describe('TaskListUnitComponent', () => {
  let component: TaskListUnitComponent;
  let fixture: ComponentFixture<TaskListUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
