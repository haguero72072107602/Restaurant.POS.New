import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DlgDiscountComponent} from './dlg-discount.component';

describe('DlgDiscountComponent', () => {
  let component: DlgDiscountComponent;
  let fixture: ComponentFixture<DlgDiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DlgDiscountComponent]
    });
    fixture = TestBed.createComponent(DlgDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
