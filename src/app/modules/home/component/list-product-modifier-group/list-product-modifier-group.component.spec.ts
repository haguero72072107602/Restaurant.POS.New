import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListProductModifierGroupComponent} from './list-product-modifier-group.component';

describe('ListProductModifierGroupComponent', () => {
  let component: ListProductModifierGroupComponent;
  let fixture: ComponentFixture<ListProductModifierGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProductModifierGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListProductModifierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
