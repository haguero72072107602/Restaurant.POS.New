import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoPayOrderComponent} from './info-pay-order.component';

describe('InfoPayOrderComponent', () => {
  let component: InfoPayOrderComponent;
  let fixture: ComponentFixture<InfoPayOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoPayOrderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InfoPayOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
