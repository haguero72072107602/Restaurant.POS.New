import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCodeComponent} from './add-code.component';

describe('AddCodeComponent', () => {
  let component: AddCodeComponent;
  let fixture: ComponentFixture<AddCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCodeComponent]
    });
    fixture = TestBed.createComponent(AddCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
