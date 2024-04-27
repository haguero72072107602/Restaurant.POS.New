import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GenericAlertComponent} from './generic-alert.component';

describe('GenericAlertComponent', () => {
  let component: GenericAlertComponent;
  let fixture: ComponentFixture<GenericAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericAlertComponent]
    });
    fixture = TestBed.createComponent(GenericAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
