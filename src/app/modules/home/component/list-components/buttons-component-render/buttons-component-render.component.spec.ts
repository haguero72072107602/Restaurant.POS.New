import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonsComponentRender} from './buttons-component-render.component';

describe('ButtonsComponentRenderComponent', () => {
  let component: ButtonsComponentRender;
  let fixture: ComponentFixture<ButtonsComponentRender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonsComponentRender]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonsComponentRender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
