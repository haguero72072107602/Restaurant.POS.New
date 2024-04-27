import {Component, Inject} from '@angular/core';
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-code',
  templateUrl: './add-code.component.html',
  styleUrls: ['./add-code.component.css']
})
export class AddCodeComponent {
  titleCode?: string;
  codeOperation?: string;
  private isPassword: boolean = false;

  constructor(private authService: AuthService,
              private cashService: CashService,
              private dialogRef: MatDialogRef<AddCodeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.titleCode = data!.titleCode;
    this.isPassword = data!.titleCode;
  }

  onCancelDialog() {
    this.dialogRef.close();
  }

  onCloseDialog() {
    if (this.codeOperation?.trim().length! > 0) {
      this.dialogRef.close({result: true, codeOperation: this.codeOperation});
    }
  }
}
