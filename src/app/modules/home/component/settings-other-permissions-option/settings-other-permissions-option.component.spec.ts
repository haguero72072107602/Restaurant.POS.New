import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsOtherPermissionsOptionComponent} from './settings-other-permissions-option.component';

describe('SettingsOtherPermissionsOptionComponent', () => {
  let component: SettingsOtherPermissionsOptionComponent;
  let fixture: ComponentFixture<SettingsOtherPermissionsOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsOtherPermissionsOptionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsOtherPermissionsOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
