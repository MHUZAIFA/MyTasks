import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPreViewerComponent } from './document-pre-viewer.component';

describe('DocumentPreViewerComponent', () => {
  let component: DocumentPreViewerComponent;
  let fixture: ComponentFixture<DocumentPreViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentPreViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPreViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
