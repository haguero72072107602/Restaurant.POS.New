import {Component, Inject} from '@angular/core';
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TypeKey} from '@core/utils/typekey.enum';
import {DiscountEvent} from "@models/discount-event.model";
import {EApplyDiscount} from "@core/utils/apply-discount.enum";


enum OperationCalculator {
  Operator = 0,
  Porcentage = 1
}

@Component({
  selector: 'app-calculator-discount',
  templateUrl: './calculator-discount.component.html',
  styleUrls: ['./calculator-discount.component.css']
})
export class CalculatorDiscountComponent {

  //public amountPaid: number;
  public amountPayment: string = "0.00";
  digits = '';
  cost = '';
  maxlength = 8;
  titleCalculator?: string;
  maxValue: number = 0;
  result?: DiscountEvent = {amount: 0, operation: EApplyDiscount.AMOUNT};
  protected readonly TypeKey = TypeKey;

  constructor(private authService: AuthService,
              private cashService: CashService,
              private dialogRef: MatDialogRef<CalculatorDiscountComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.titleCalculator = data!.titleCalculator
    this.maxValue = data!.maxValue;
    this.amountPayment = data!.amountPayment;
  }

  onCancelDialog() {
    this.dialogRef.close()
  }

  onDiscount() {
    this.dialogRef.close(this.result)
  }

  evDiscount($event: DiscountEvent) {
    this.result = $event;
  }
}
