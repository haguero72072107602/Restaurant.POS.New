import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsPermisionsOptionSystemsComponent} from './settings-permisions-option-systems.component';

describe('SettingsPermisionsOptionSystemsComponent', () => {
  let component: SettingsPermisionsOptionSystemsComponent;
  let fixture: ComponentFixture<SettingsPermisionsOptionSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPermisionsOptionSystemsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsPermisionsOptionSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
