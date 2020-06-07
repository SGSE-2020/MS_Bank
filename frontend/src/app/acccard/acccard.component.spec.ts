import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcccardComponent } from './acccard.component';

describe('AcccardComponent', () => {
  let component: AcccardComponent;
  let fixture: ComponentFixture<AcccardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcccardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcccardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
