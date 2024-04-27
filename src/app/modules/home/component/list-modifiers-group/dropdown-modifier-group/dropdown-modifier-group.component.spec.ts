import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropdownModifierGroupComponent} from './dropdown-modifier-group.component';

describe('DropdownModifierGroupComponent', () => {
  let component: DropdownModifierGroupComponent;
  let fixture: ComponentFixture<DropdownModifierGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownModifierGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropdownModifierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
