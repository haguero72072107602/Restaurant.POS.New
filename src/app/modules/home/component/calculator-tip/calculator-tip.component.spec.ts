import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalculatorTipComponent} from './calculator-tip.component';

describe('CalculatorComponent', () => {
  let component: CalculatorTipComponent;
  let fixture: ComponentFixture<CalculatorTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorTipComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalculatorTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
