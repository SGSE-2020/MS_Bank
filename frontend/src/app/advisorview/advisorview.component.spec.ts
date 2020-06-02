import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorviewComponent } from './advisorview.component';

describe('AdvisorviewComponent', () => {
  let component: AdvisorviewComponent;
  let fixture: ComponentFixture<AdvisorviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisorviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
