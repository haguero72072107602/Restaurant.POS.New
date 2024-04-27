import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerSetDiscountComponent} from './scheduler-set-discount.component';

describe('SchedulerSetDiscountComponent', () => {
  let component: SchedulerSetDiscountComponent;
  let fixture: ComponentFixture<SchedulerSetDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerSetDiscountComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerSetDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
