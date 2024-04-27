import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardItemsOrderComponent} from './card-items-order.component';

describe('CardItemsOrderComponent', () => {
  let component: CardItemsOrderComponent;
  let fixture: ComponentFixture<CardItemsOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardItemsOrderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardItemsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
