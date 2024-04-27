import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DlgPayMethodComponent} from './dlg-pay-method.component';

describe('PayCashComponent', () => {
  let component: DlgPayMethodComponent;
  let fixture: ComponentFixture<DlgPayMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DlgPayMethodComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DlgPayMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
