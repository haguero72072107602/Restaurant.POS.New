import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalculatorCashOutInComponent} from './calculator-cash-out-in.component';

describe('CalculatorCashOutInComponent', () => {
  let component: CalculatorCashOutInComponent;
  let fixture: ComponentFixture<CalculatorCashOutInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatorCashOutInComponent]
    });
    fixture = TestBed.createComponent(CalculatorCashOutInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
