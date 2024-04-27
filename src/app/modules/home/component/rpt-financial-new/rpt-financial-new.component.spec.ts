import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptFinancialNewComponent} from './rpt-financial-new.component';

describe('RptFinancialNewComponent', () => {
  let component: RptFinancialNewComponent;
  let fixture: ComponentFixture<RptFinancialNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RptFinancialNewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptFinancialNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
