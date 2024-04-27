import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubmayorProductComponent} from './submayor-product.component';

describe('SubmayorProductComponent', () => {
  let component: SubmayorProductComponent;
  let fixture: ComponentFixture<SubmayorProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmayorProductComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubmayorProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
