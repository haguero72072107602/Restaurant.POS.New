import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SliderPhotoComponent} from './slider-photo.component';

describe('SliderPhotoComponent', () => {
  let component: SliderPhotoComponent;
  let fixture: ComponentFixture<SliderPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderPhotoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SliderPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
