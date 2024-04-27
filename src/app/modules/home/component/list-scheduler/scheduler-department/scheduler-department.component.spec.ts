import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerDepartmentComponent} from './scheduler-department.component';

describe('SchedulerDepartmentComponent', () => {
  let component: SchedulerDepartmentComponent;
  let fixture: ComponentFixture<SchedulerDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerDepartmentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
