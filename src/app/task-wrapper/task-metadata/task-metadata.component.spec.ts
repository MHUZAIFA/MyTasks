import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMetadataComponent } from './task-metadata.component';

describe('TaskMetadataComponent', () => {
  let component: TaskMetadataComponent;
  let fixture: ComponentFixture<TaskMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
