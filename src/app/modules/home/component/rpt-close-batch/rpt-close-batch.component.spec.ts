import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptCloseBatchComponent} from './rpt-close-batch.component';

describe('RptCloseBatchComponent', () => {
  let component: RptCloseBatchComponent;
  let fixture: ComponentFixture<RptCloseBatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RptCloseBatchComponent]
    });
    fixture = TestBed.createComponent(RptCloseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
