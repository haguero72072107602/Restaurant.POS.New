import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DlgClosebatchComponent} from './dlg-closebatch.component';

describe('DlgClosebatchComponent', () => {
  let component: DlgClosebatchComponent;
  let fixture: ComponentFixture<DlgClosebatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DlgClosebatchComponent]
    });
    fixture = TestBed.createComponent(DlgClosebatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
