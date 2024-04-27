import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HaveKeycardComponent} from './have-keycard.component';

describe('HaveKeycardComponent', () => {
  let component: HaveKeycardComponent;
  let fixture: ComponentFixture<HaveKeycardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaveKeycardComponent]
    });
    fixture = TestBed.createComponent(HaveKeycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
