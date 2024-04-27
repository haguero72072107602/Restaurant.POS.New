import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsGeneralsOptionSystemsComponent} from './settings-generals-option-systems.component';

describe('SettingsGeneralsOptionSystemsComponent', () => {
  let component: SettingsGeneralsOptionSystemsComponent;
  let fixture: ComponentFixture<SettingsGeneralsOptionSystemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsGeneralsOptionSystemsComponent]
    });
    fixture = TestBed.createComponent(SettingsGeneralsOptionSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
