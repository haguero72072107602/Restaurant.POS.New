import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerTimerComponent} from './scheduler-timer.component';

describe('SchedulerTimerComponent', () => {
  let component: SchedulerTimerComponent;
  let fixture: ComponentFixture<SchedulerTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerTimerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
