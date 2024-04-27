import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerCardComponent} from './scheduler-card.component';

describe('CardSchedulerComponent', () => {
  let component: SchedulerCardComponent;
  let fixture: ComponentFixture<SchedulerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
