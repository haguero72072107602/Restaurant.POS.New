import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerFrecuencyComponent} from './scheduler-frecuency.component';

describe('SchedulerFrecuencyComponent', () => {
  let component: SchedulerFrecuencyComponent;
  let fixture: ComponentFixture<SchedulerFrecuencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerFrecuencyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerFrecuencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
