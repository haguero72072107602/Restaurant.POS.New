import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardCustomerComponent} from './card-customer.component';

describe('CardCustomerComponent', () => {
  let component: CardCustomerComponent;
  let fixture: ComponentFixture<CardCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCustomerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
