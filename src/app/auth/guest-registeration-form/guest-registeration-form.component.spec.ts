import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRegisterationFormComponent } from './guest-registeration-form.component';

describe('GuestRegisterationFormComponent', () => {
  let component: GuestRegisterationFormComponent;
  let fixture: ComponentFixture<GuestRegisterationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestRegisterationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestRegisterationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
