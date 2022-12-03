import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUnitComponent } from './settings-unit.component';

describe('SettingsUnitComponent', () => {
  let component: SettingsUnitComponent;
  let fixture: ComponentFixture<SettingsUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
