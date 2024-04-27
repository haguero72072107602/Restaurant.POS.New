import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProccessLoginComponent} from './proccess-login.component';

describe('ProccessLoginComponent', () => {
  let component: ProccessLoginComponent;
  let fixture: ComponentFixture<ProccessLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProccessLoginComponent]
    });
    fixture = TestBed.createComponent(ProccessLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
