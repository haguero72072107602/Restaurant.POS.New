import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-clock-in-user',
  templateUrl: './clock-in-user.component.html',
  styleUrls: ['./clock-in-user.component.css']
})
export class ClockInUserComponent {

  constructor(public dialogRef: MatDialogRef<ClockInUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onClose() {
    this.dialogRef.close();
  }
}
