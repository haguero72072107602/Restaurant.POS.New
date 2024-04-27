import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsGeneralsComponent} from './settings-generals.component';

describe('SettingsGeneralsComponent', () => {
  let component: SettingsGeneralsComponent;
  let fixture: ComponentFixture<SettingsGeneralsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsGeneralsComponent]
    });
    fixture = TestBed.createComponent(SettingsGeneralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
