import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccViewComponent } from './acc-view.component';

describe('AccViewComponent', () => {
  let component: AccViewComponent;
  let fixture: ComponentFixture<AccViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
