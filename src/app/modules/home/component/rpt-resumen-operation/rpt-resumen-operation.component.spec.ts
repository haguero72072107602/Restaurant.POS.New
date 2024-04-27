import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptResumenOperationComponent} from './rpt-resumen-operation.component';

describe('RptResumenOperationComponent', () => {
  let component: RptResumenOperationComponent;
  let fixture: ComponentFixture<RptResumenOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RptResumenOperationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptResumenOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
