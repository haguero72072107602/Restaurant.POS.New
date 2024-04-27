import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropdownElementModifierGroupComponent} from './dropdown-element-modifier-group.component';

describe('DropdownElementModifierGroupComponent', () => {
  let component: DropdownElementModifierGroupComponent;
  let fixture: ComponentFixture<DropdownElementModifierGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownElementModifierGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropdownElementModifierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
