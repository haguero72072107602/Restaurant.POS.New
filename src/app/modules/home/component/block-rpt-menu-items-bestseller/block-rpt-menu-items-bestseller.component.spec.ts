import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockRptMenuItemsBestsellerComponent} from './block-rpt-menu-items-bestseller.component';

describe('BlockRptMenuItemsBestsellerComponent', () => {
  let component: BlockRptMenuItemsBestsellerComponent;
  let fixture: ComponentFixture<BlockRptMenuItemsBestsellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockRptMenuItemsBestsellerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BlockRptMenuItemsBestsellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
