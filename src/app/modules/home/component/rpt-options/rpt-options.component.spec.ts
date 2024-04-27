import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptOptionsComponent} from './rpt-options.component';

describe('RptOptionsComponent', () => {
  let component: RptOptionsComponent;
  let fixture: ComponentFixture<RptOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RptOptionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
