import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropdownModifierComponent} from './dropdown-modifier.component';

describe('DropdownModifierComponent', () => {
  let component: DropdownModifierComponent;
  let fixture: ComponentFixture<DropdownModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownModifierComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropdownModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
