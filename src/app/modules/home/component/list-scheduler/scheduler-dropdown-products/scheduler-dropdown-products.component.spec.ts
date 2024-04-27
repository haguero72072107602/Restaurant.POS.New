import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulerDropdownProductsComponent} from './scheduler-dropdown-products.component';

describe('SchedulerDropdownProductsComponent', () => {
  let component: SchedulerDropdownProductsComponent;
  let fixture: ComponentFixture<SchedulerDropdownProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerDropdownProductsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SchedulerDropdownProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
