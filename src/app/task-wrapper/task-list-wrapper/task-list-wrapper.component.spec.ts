import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListWrapperComponent } from './task-list-wrapper.component';

describe('TaskListWrapperComponent', () => {
  let component: TaskListWrapperComponent;
  let fixture: ComponentFixture<TaskListWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
