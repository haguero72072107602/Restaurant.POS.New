import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerAddComponent} from './scheduler-add.component';

describe('SchedulerAddComponent', () => {
  let component: SchedulerAddComponent;
  let fixture: ComponentFixture<SchedulerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerAddComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
