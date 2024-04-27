import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockRptSalesRevenueComponent} from './block-rpt-sales-revenue.component';

describe('BlockRptSalesRevenueComponent', () => {
  let component: BlockRptSalesRevenueComponent;
  let fixture: ComponentFixture<BlockRptSalesRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockRptSalesRevenueComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BlockRptSalesRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
