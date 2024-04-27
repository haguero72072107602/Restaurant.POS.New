import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScrollTableComponent} from './scroll-table.component';

describe('ScrollTableComponent', () => {
  let component: ScrollTableComponent;
  let fixture: ComponentFixture<ScrollTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollTableComponent]
    });
    fixture = TestBed.createComponent(ScrollTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
