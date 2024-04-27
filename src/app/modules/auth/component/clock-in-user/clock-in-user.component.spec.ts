import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClockInUserComponent} from './clock-in-user.component';

describe('ClockInUserComponent', () => {
  let component: ClockInUserComponent;
  let fixture: ComponentFixture<ClockInUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClockInUserComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClockInUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
