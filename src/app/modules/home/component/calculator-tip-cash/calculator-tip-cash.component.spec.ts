import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalculatorTipCashComponent} from './calculator-tip-cash.component';

describe('CalculatorComponent', () => {
  let component: CalculatorTipCashComponent;
  let fixture: ComponentFixture<CalculatorTipCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorTipCashComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalculatorTipCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
