import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsNewPermissionsOptionComponent} from './settings-new-permissions-option.component';

describe('SettingsNewPermissionsOptionComponent', () => {
  let component: SettingsNewPermissionsOptionComponent;
  let fixture: ComponentFixture<SettingsNewPermissionsOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsNewPermissionsOptionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsNewPermissionsOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
