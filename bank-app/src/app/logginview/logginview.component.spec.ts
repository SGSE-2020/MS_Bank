import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogginviewComponent } from './logginview.component';

describe('LogginviewComponent', () => {
  let component: LogginviewComponent;
  let fixture: ComponentFixture<LogginviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogginviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogginviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
