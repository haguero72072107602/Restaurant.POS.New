import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScrollEarringComponent} from './scroll-earring.component';

describe('ScrollEarringComponent', () => {
  let component: ScrollEarringComponent;
  let fixture: ComponentFixture<ScrollEarringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollEarringComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScrollEarringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
