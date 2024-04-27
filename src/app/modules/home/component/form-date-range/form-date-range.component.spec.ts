import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormDateRangeComponent} from './form-date-range.component';

describe('FormDateRangeComponent', () => {
  let component: FormDateRangeComponent;
  let fixture: ComponentFixture<FormDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDateRangeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
