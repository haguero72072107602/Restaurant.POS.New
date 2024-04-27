import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalculatorAdjustComponent} from './calculator-adjust.component';

describe('CalculatorAdjustComponent', () => {
  let component: CalculatorAdjustComponent;
  let fixture: ComponentFixture<CalculatorAdjustComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatorAdjustComponent]
    });
    fixture = TestBed.createComponent(CalculatorAdjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
