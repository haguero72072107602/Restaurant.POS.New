import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerSetPromotionsComponent} from './scheduler-set-promotions.component';

describe('SchedulerSetPromotionsComponent', () => {
  let component: SchedulerSetPromotionsComponent;
  let fixture: ComponentFixture<SchedulerSetPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerSetPromotionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerSetPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
