import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptCloseDayComponent} from './rpt-close-day.component';

describe('RptCloseShiftComponent', () => {
  let component: RptCloseDayComponent;
  let fixture: ComponentFixture<RptCloseDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RptCloseDayComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptCloseDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
