import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsFinancialReportComponent} from './cards-financial-report.component';

describe('CardsFinancialReportComponent', () => {
  let component: CardsFinancialReportComponent;
  let fixture: ComponentFixture<CardsFinancialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsFinancialReportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardsFinancialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
