import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-clock-out-user',
  templateUrl: './clock-out-user.component.html',
  styleUrls: ['./clock-out-user.component.css']
})
export class ClockOutUserComponent {
  constructor(public dialogRef: MatDialogRef<ClockOutUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onClose() {
    this.dialogRef.close();
  }
}
