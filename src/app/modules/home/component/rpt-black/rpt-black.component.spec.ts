import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptBlackComponent} from './rpt-black.component';

describe('RptBlackComponent', () => {
  let component: RptBlackComponent;
  let fixture: ComponentFixture<RptBlackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RptBlackComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptBlackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
