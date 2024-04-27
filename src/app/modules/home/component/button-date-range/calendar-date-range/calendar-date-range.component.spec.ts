import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarDateRangeComponent} from './calendar-date-range.component';

describe('CalendarDateRangeComponent', () => {
  let component: CalendarDateRangeComponent;
  let fixture: ComponentFixture<CalendarDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDateRangeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalendarDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
