import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsviewComponent } from './settingsview.component';

describe('SettingsviewComponent', () => {
  let component: SettingsviewComponent;
  let fixture: ComponentFixture<SettingsviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
