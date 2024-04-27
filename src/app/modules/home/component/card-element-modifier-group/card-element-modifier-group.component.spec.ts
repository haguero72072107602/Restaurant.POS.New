import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardElementModifierGroupComponent} from './card-element-modifier-group.component';

describe('CardElementModifierGroupComponent', () => {
  let component: CardElementModifierGroupComponent;
  let fixture: ComponentFixture<CardElementModifierGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardElementModifierGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardElementModifierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
