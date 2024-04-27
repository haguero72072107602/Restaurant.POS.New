import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardComponentEditComponent} from './card-component-edit.component';

describe('EditComponentComponent', () => {
  let component: CardComponentEditComponent;
  let fixture: ComponentFixture<CardComponentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponentEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardComponentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
