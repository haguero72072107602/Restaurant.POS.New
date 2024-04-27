import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClockOutUserComponent} from './clock-out-user.component';

describe('ClockOutUserComponent', () => {
  let component: ClockOutUserComponent;
  let fixture: ComponentFixture<ClockOutUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClockOutUserComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClockOutUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
