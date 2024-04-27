import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SidesPrepareComponent} from './sides-prepare.component';

describe('SidesPrepareComponent', () => {
  let component: SidesPrepareComponent;
  let fixture: ComponentFixture<SidesPrepareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidesPrepareComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidesPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
