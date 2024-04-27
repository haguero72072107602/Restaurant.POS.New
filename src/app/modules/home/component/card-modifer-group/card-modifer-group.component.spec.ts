import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardModiferGroupComponent} from './card-modifer-group.component';

describe('CardModiferGroupComponent', () => {
  let component: CardModiferGroupComponent;
  let fixture: ComponentFixture<CardModiferGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModiferGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardModiferGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
