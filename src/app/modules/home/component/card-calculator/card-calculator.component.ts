import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TypeKey} from "@core/utils/typekey.enum";
import {EApplyDiscount} from "@core/utils/apply-discount.enum";
import {DiscountEvent} from "@models/discount-event.model";

@Component({
  selector: 'app-card-calculator',
  templateUrl: './card-calculator.component.html',
  styleUrls: ['./card-calculator.component.css']
})
export class CardCalculatorComponent {

  @Output() evDiscount: EventEmitter<DiscountEvent> = new EventEmitter<DiscountEvent>();
  @Input({required: true}) maxAmount?: number;
  //public amountPaid: number;
  public amountPayment: string = "0.00";
  digits = '';
  cost = '';
  maxlength = 8;
  titleCalculator?: string;
  selectAcction: EApplyDiscount = EApplyDiscount.AMOUNT;
  protected readonly TypeKey = TypeKey;
  protected readonly EApplyDiscount = EApplyDiscount;

  constructor() {
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

  emitValue() {
    this.evDiscount?.emit({amount: Number(this.amountPayment), operation: this.selectAcction})
  }

  inputNumber(value: any) {
    const valueCheck = this.digits + value;

    const cost = this.selectAcction === EApplyDiscount.AMOUNT
      ? parseFloat(valueCheck) * 0.01
      : parseFloat(valueCheck);


    if (!Number.isNaN(cost) && this.validNumber(cost)) {
      this.digits += value + '';
      this.cost = cost.toFixed(2);
      this.amountPayment = this.cost;
    }
    /* else {
      this.resetPrice();
    }
    */
    this.emitValue();
  }

  back() {
    if (this.digits.length > 1) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      const cost = this.selectAcction === EApplyDiscount.AMOUNT
        ? parseFloat(this.digits) * 0.01
        : parseFloat(this.digits);
      this.cost = cost.toFixed(2);
      this.amountPayment = this.cost;
    } else {
      this.resetPrice();
    }
    this.emitValue();
  }

  resetPrice() {
    this.digits = '';
    this.cost = '0.00';
    this.amountPayment = this.cost;
    this.emitValue();
  }

  setKeys(Operator: EApplyDiscount) {
    this.selectAcction = Operator;

    switch (this.selectAcction) {
      case EApplyDiscount.AMOUNT:
        if (Number(this.amountPayment) > 100) {
          this.amountPayment = Number(100).toFixed(2);
        }
        break;
      case EApplyDiscount.PERCENT:
        break;
    }
    this.emitValue();
  }

  private validNumber(cost: number) {
    switch (this.selectAcction) {
      case EApplyDiscount.AMOUNT:
        return cost <= this.maxAmount!
        break
      case EApplyDiscount.PERCENT:
        return cost <= 100;
        break
    }
  }
}
