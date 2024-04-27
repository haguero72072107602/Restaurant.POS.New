import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DlgSplitComponent} from './dlg-split.component';

describe('DlgSplitComponent', () => {
  let component: DlgSplitComponent;
  let fixture: ComponentFixture<DlgSplitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DlgSplitComponent]
    });
    fixture = TestBed.createComponent(DlgSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
