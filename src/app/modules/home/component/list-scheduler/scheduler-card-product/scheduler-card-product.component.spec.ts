import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerCardProductComponent} from './scheduler-card-product.component';

describe('SchedulerCardProductComponent', () => {
  let component: SchedulerCardProductComponent;
  let fixture: ComponentFixture<SchedulerCardProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerCardProductComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerCardProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
