import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerProductComponent} from './scheduler-product.component';

describe('SchedulerProductComponent', () => {
  let component: SchedulerProductComponent;
  let fixture: ComponentFixture<SchedulerProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerProductComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
