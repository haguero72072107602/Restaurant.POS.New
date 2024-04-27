import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RptMenuItemsSalesComponent} from './rpt-menu-items-sales.component';

describe('RptMenuItemsSalesComponent', () => {
  let component: RptMenuItemsSalesComponent;
  let fixture: ComponentFixture<RptMenuItemsSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RptMenuItemsSalesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RptMenuItemsSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
