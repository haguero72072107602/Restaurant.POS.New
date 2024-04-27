import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddModiferGroupComponent} from './add-modifer-group.component';

describe('AddModiferGroupComponent', () => {
  let component: AddModiferGroupComponent;
  let fixture: ComponentFixture<AddModiferGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModiferGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddModiferGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
