import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerHeaderComponent} from './scheduler-header.component';

describe('SchedulerHeaderComponent', () => {
  let component: SchedulerHeaderComponent;
  let fixture: ComponentFixture<SchedulerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerHeaderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
