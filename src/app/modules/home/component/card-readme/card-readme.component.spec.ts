import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardReadmeComponent} from './card-readme.component';

describe('CardReadmeComponent', () => {
  let component: CardReadmeComponent;
  let fixture: ComponentFixture<CardReadmeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardReadmeComponent]
    });
    fixture = TestBed.createComponent(CardReadmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
