import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardDateComponent} from './card-date.component';

describe('CardDateComponent', () => {
  let component: CardDateComponent;
  let fixture: ComponentFixture<CardDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardDateComponent]
    });
    fixture = TestBed.createComponent(CardDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
