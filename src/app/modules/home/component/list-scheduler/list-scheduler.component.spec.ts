import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSchedulerComponent} from './list-scheduler.component';

describe('HappyHourComponent', () => {
  let component: ListSchedulerComponent;
  let fixture: ComponentFixture<ListSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSchedulerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
