import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TypeKey} from '@core/utils/typekey.enum';

@Component({
  selector: 'app-calculator-cash-out-in',
  templateUrl: './calculator-cash-out-in.component.html',
  styleUrls: ['./calculator-cash-out-in.component.css']
})
export class CalculatorCashOutInComponent {

  @ViewChild("textMotion", {static: true}) textMotion: undefined | ElementRef;

  public amountPayment: string = "0.00";
  digits = '';
  cost = '';
  maxlength = 8;
  titleCalculator?: string;
  selectAcction: number = 2;
  protected readonly TypeKey = TypeKey;

  constructor(private authService: AuthService,
              private cashService: CashService,
              private dialogRef: MatDialogRef<CalculatorCashOutInComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.titleCalculator = data!.titleCalculator
    if (data!.password!) {
      this.amountPayment = "";
      this.maxlength = data!.maxlength!;
    }
  }

  onAccept() {
    console.log("Operation ", this.amountPayment, this.textMotion?.nativeElement!.value);
    if (Number(this.amountPayment) > 0 && this.textMotion?.nativeElement!.value.trim().length > 0) {
      this.dialogRef.close({
        cash: this.amountPayment,
        motion: this.textMotion?.nativeElement!.value,
        typeOperation: this.selectAcction
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
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
    const cost = parseFloat(this.digits) * 0.01;
    if (!Number.isNaN(cost)) {
      this.cost = cost.toFixed(2);
      this.amountPayment = this.cost;
    } else {
      this.resetPrice();
    }
  }

  back() {
    if (this.digits.length > 1) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      const cost = parseFloat(this.digits) * 0.01;
      this.cost = cost.toFixed(2);
      this.amountPayment = this.cost;
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.digits = '';
    this.cost = '0.00';
    this.amountPayment = this.cost;
  }
}
