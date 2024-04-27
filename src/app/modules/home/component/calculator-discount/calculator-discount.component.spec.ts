import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalculatorDiscountComponent} from './calculator-discount.component';

describe('CalculatorDiscountComponent', () => {
  let component: CalculatorDiscountComponent;
  let fixture: ComponentFixture<CalculatorDiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatorDiscountComponent]
    });
    fixture = TestBed.createComponent(CalculatorDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
