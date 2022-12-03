import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskWrapperComponent } from './task-wrapper.component';

describe('TaskWrapperComponent', () => {
  let component: TaskWrapperComponent;
  let fixture: ComponentFixture<TaskWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
