import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptFinancialComponent} from './rpt-financial.component';

describe('RptFinancialComponent', () => {
  let component: RptFinancialComponent;
  let fixture: ComponentFixture<RptFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RptFinancialComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
