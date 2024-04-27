import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddNoteDueComponent} from './add-note-due.component';

describe('AddNoteComponent', () => {
  let component: AddNoteDueComponent;
  let fixture: ComponentFixture<AddNoteDueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNoteDueComponent]
    });
    fixture = TestBed.createComponent(AddNoteDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
