import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-note-user',
  templateUrl: './note-user.component.html',
  styleUrls: ['./note-user.component.css']
})
export class NoteUserComponent {

  constructor(public dialogRef: MatDialogRef<NoteUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onClose() {
    this.dialogRef.close();
  }
}
