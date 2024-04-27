import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddUpdateProductOrderComponent} from './add-update-product-order.component';

describe('AddUpdateProductOrderComponent', () => {
  let component: AddUpdateProductOrderComponent;
  let fixture: ComponentFixture<AddUpdateProductOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUpdateProductOrderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddUpdateProductOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
