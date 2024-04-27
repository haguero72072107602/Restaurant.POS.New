import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerCardFrecuencyComponent} from './scheduler-card-frecuency.component';

describe('SchedulerCardFrecuencyComponent', () => {
  let component: SchedulerCardFrecuencyComponent;
  let fixture: ComponentFixture<SchedulerCardFrecuencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerCardFrecuencyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerCardFrecuencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
