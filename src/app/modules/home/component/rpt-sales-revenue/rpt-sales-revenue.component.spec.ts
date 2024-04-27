import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptSalesRevenueComponent} from './rpt-sales-revenue.component';

describe('RptSalesRevenueComponent', () => {
  let component: RptSalesRevenueComponent;
  let fixture: ComponentFixture<RptSalesRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RptSalesRevenueComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptSalesRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
