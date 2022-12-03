import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsDefaultComponent } from './task-details-default.component';

describe('TaskDetailsDefaultComponent', () => {
  let component: TaskDetailsDefaultComponent;
  let fixture: ComponentFixture<TaskDetailsDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailsDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
