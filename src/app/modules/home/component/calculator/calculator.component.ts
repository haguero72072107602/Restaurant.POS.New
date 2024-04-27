import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TypeKey} from "@core/utils/typekey.enum";
import {AuthService} from "@core/services/api/auth.service";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent {
  //public amountPaid: number;
  public amountPayment: string = "0.00";
  digits = '';
  cost = '';
  maxlength = 8;
  titleCalculator?: string;
  isPassword: boolean = false;
  passwordHide?: string;
  protected readonly TypeKey = TypeKey;

  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private dialogRef: MatDialogRef<CalculatorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.titleCalculator = data!.titleCalculator
    if (data!.password!) {
      this.amountPayment = "";
      this.isPassword = data!.password!;
      this.maxlength = data!.maxlength!;
    }
  }

  onCloseDialog() {
    if (!this.isPassword) {
      if (Number(this.amountPayment) > 0) {
        this.dialogRef.close({cashInvoice: this.amountPayment});
      }
    } else {
      //this.dialogRef.close({password: this.amountPayment});
      this.login();
    }
  }

  onCancelDialog() {
    this.dialogRef.close({cashInvoice: -1});
  }

  getKeys(value: string, type: TypeKey, clearValue?: boolean) {
    if (clearValue) {
      this.digits = "";
    }
    if (type === 1 && this.digits.length < this.maxlength) {
      this.inputNumber(value);
    } else if (value === 'Clear') {
      this.resetPrice();
    } else if (value === 'Enter') {
      //this.addGenericProd();
    } else if (value === 'Back') {
      this.back();
    }
  }

  inputNumber(value: any) {
    this.digits += value + '';
    if (!this.isPassword) {
      const cost = parseFloat(this.digits) * 0.01;
      if (!Number.isNaN(cost)) {
        this.cost = cost.toFixed(2);
        this.amountPayment = this.cost;
      } else {
        this.resetPrice();
      }
    } else {
      this.passwordHide = this.digits;
      const charPassword = "*";
      this.amountPayment = charPassword.repeat(this.digits.length!);
    }
  }

  back() {
    if (this.digits.length > 1) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      if (!this.isPassword) {
        const cost = parseFloat(this.digits) * 0.01;
        this.cost = cost.toFixed(2);
        this.amountPayment = this.cost;
      } else {
        this.passwordHide = this.digits;
        const charPassword = "*";
        this.amountPayment = charPassword.repeat(this.digits.length!);
      }
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.digits = '';
    if (!this.isPassword) {
      this.cost = '0.00';
      this.amountPayment = this.cost;
    } else {
      this.passwordHide = this.digits;
      const charPassword = "*";
      this.amountPayment = charPassword.repeat(this.digits.length!);
    }
  }

  login() {
    this.authService.loginUser({username: 'user', password: this.passwordHide}).subscribe(t => {
      if ([UserrolEnum.SUPERVISOR, UserrolEnum.ADMIN].includes(t.rol!)) {
        this.dialogRef.close({valid: true, token: t.token!});
      } else {
        this.dialogService.openGenericInfo("Error", "This user does not have permission to perform this operation");
      }
      this.dialogRef.close({valid: true, token: t.token!});
    }, error1 => {
      this.dialogService.openGenericInfo("Error", error1);
    });
  }

}
