import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptSalesDaysComponent} from './rpt-sales-days.component';

describe('RptSalesDaysComponent', () => {
  let component: RptSalesDaysComponent;
  let fixture: ComponentFixture<RptSalesDaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RptSalesDaysComponent]
    });
    fixture = TestBed.createComponent(RptSalesDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
