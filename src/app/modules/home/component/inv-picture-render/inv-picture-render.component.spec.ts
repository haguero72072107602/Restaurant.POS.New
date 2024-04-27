import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InvPictureRenderComponent} from './inv-picture-render.component';

describe('InvPictureRenderComponent', () => {
  let component: InvPictureRenderComponent;
  let fixture: ComponentFixture<InvPictureRenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvPictureRenderComponent]
    });
    fixture = TestBed.createComponent(InvPictureRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
