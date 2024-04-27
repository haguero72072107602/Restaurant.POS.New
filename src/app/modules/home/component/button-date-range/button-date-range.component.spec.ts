import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonDateRangeComponent} from './button-date-range.component';

describe('ButtonDateRangeComponent', () => {
  let component: ButtonDateRangeComponent;
  let fixture: ComponentFixture<ButtonDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonDateRangeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
