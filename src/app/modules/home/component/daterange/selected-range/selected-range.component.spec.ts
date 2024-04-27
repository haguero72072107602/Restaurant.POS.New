import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectedRangeComponent} from './selected-range.component';

describe('SelectedRangeComponent', () => {
  let component: SelectedRangeComponent;
  let fixture: ComponentFixture<SelectedRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedRangeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectedRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
