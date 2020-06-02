import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeviewComponent } from './exchangeview.component';

describe('ExchangeviewComponent', () => {
  let component: ExchangeviewComponent;
  let fixture: ComponentFixture<ExchangeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
