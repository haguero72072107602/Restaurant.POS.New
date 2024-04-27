import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardArrSplitComponent} from './card-arr-split.component';

describe('CardArrSplitComponent', () => {
  let component: CardArrSplitComponent;
  let fixture: ComponentFixture<CardArrSplitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardArrSplitComponent]
    });
    fixture = TestBed.createComponent(CardArrSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
