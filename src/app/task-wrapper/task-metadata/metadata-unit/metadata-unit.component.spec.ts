import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataUnitComponent } from './metadata-unit.component';

describe('MetadataUnitComponent', () => {
  let component: MetadataUnitComponent;
  let fixture: ComponentFixture<MetadataUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
