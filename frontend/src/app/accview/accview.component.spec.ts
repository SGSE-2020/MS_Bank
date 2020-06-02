import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccviewComponent } from './accview.component';

describe('AccviewComponent', () => {
  let component: AccviewComponent;
  let fixture: ComponentFixture<AccviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
