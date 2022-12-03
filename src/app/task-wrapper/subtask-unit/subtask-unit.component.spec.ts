import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskUnitComponent } from './subtask-unit.component';

describe('SubtaskUnitComponent', () => {
  let component: SubtaskUnitComponent;
  let fixture: ComponentFixture<SubtaskUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtaskUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtaskUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
