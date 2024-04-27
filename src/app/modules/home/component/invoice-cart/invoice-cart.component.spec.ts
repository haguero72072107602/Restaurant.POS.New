import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InvoiceCartComponent} from './invoice-cart.component';

describe('InvoiceCartComponent', () => {
  let component: InvoiceCartComponent;
  let fixture: ComponentFixture<InvoiceCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceCartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
