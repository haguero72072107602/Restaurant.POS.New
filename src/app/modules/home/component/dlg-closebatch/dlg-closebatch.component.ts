import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dlg-closebatch',
  templateUrl: './dlg-closebatch.component.html',
  styleUrls: ['./dlg-closebatch.component.css']
})
export class DlgClosebatchComponent {
  radioSumary: boolean = true;
  radioDetails: boolean = false;
  typeBatch: number = -1;

  constructor(private dialogRef: MatDialogRef<DlgClosebatchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  onClose() {
    this.dialogRef.close()
  }

  OnAccept() {
    if (this.typeBatch > -1) {
      this.dialogRef.close({closeBatch: this.typeBatch})
    }
  }

  onChangeValue(value: number) {
    this.typeBatch = value;
  }
}
