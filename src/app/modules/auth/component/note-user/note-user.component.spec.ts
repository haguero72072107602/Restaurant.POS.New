import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoteUserComponent} from './note-user.component';

describe('NoteUserComponent', () => {
  let component: NoteUserComponent;
  let fixture: ComponentFixture<NoteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteUserComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NoteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
