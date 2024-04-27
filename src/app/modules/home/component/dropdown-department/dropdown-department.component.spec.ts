import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropdownDepartmentComponent} from './dropdown-department.component';

describe('DropdownDepartmentComponent', () => {
  let component: DropdownDepartmentComponent;
  let fixture: ComponentFixture<DropdownDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownDepartmentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropdownDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
