import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCardTableComponent} from './add-card-table.component';

describe('AddCardTableComponent', () => {
  let component: AddCardTableComponent;
  let fixture: ComponentFixture<AddCardTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCardTableComponent]
    });
    fixture = TestBed.createComponent(AddCardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
