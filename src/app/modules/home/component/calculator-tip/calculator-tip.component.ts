import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TypeKey} from "@core/utils/typekey.enum";
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {Invoice} from "@models/invoice.model";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {floatToDecimal} from "@core/utils/functions/functions";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";


@Component({
  selector: 'app-calculator-tip',
  templateUrl: './calculator-tip.component.html',
  styleUrls: ['./calculator-tip.component.css'],
})
export class CalculatorTipComponent implements OnInit {
  @ViewChild('btnTips', {static: true}) btnTips?: ElementRef;

  public amountBalance: number;
  public amountSubTotal: number;
  public amountPaid: number;
  public checkBalance: boolean = false;

  public amountPayment: string = "0.00";
  digits = '';
  cost = '';
  maxlength = 8;
  selectedTip: number = 0;
  tips?: number = 0;
  allowAuth: boolean = false;
  titleCalculator: string = "Amount"
  labelOpe?: string = "DUE";
  amountTip?: string = "0.00";
  activeButton: number = 0;
  isRefund: boolean = false;
  applyTip: boolean = true;
  protected readonly TypeKey = TypeKey;

  constructor(
    private cashService: CashService,
    private dialogService: DialogService,
    private invoiceService: InvoiceService,
    private dialogRef: MatDialogRef<CalculatorTipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {


    this.isRefund = data?.isRefund;
    this.amountPaid = Math.abs(data?.amountPaid);
    this.amountSubTotal = Math.abs(data?.amountSubTotal);
    this.amountBalance = Math.abs(data?.amountBalance);
    this.checkBalance = data?.checkBalance;
    this.amountPayment = Math.abs(this.amountPaid).toFixed(2);
  }

  get enabledTips() {
    return this.selectedTip === 3;
  }

  ngOnInit(): void {

    if (this.cashService.config.sysConfig.allowTip!) {
      this.invoiceService.getInvoicePayment(this.invoiceService.invoice?.id!).subscribe((next) => {
        this.allowAuth = true;
        this.applyTip = next.length === 0;
        (this.isRefund || !this.applyTip) ? this.selectedTip = 4 : this.selectedTip = 0;
        this.amountPayment = (this.amountPaid + this.tips!).toFixed(2).toString();
        this.setTips(this.selectedTip);
      }, error => {
        this.dialogService.openGenericInfo("Error", error)
      });
    }
  }

  onCloseDialog() {
    if (this.selectedTip < 3) {
      const cash = parseFloat(((Number(this.amountPayment) - Number(this.tips!)).toFixed(2)));
      this.dialogRef.close({cashInvoice: cash, cashTip: this.tips!});
    } else {
      this.dialogRef.close({cashInvoice: this.amountPayment!, cashTip: this.tips!});
    }

  }

  onCancelDialog() {
    this.dialogRef.close();
  }

  onActiveButton(active: number) {
    this.activeButton = active;
    active === 0 ?
      this.digits = (Number(this.amountPayment) * 100).toString() :
      this.digits = (Number(this.amountTip!) * 100).toString()
  }

  onShowTips(percent: number) {
    if (this.selectedTip < 3) {
      this.labelOpe = "";
      this.amountPayment = Number(this.amountBalance + this.tips!).toFixed(2);

      this.amountTip = '$ ' + Number(this.amountBalance).toFixed(2) +
        " + " + this.tips!.toFixed(2).toString() + " (" + percent + "%)"
    } else {
      this.amountTip = '$ ' + this.amountPayment +
        " + " + this.tips!.toFixed(2).toString() + " (" + percent + "%)"
    }

  }

  getAmount() {
    this.labelOpe = "Due";

    //if (this.selectedTip < 3) return "0.00";

    let value = this.amountPaid! + Number(this.tips) - Number(this.amountPayment);

    this.labelOpe = value! > 0 ? "Due" : "Change Due"

    return Math.abs(value!).toFixed(2);
  }

  getKeys(value: string, type: TypeKey, reset?: boolean) {

    //if (this.selectedTip <= 2) return;

    if (reset) this.resetPrice();

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

  isNumber(n: any) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
  }

  inputNumber(value: any) {

    if (!this.isNumber(this.digits)) this.digits = '';

    const valueCheck = this.digits + value;

    const cost = parseFloat(valueCheck) * 0.01;

    if (!Number.isNaN(cost)) {
      if (this.activeButton === 0) {
        if (this.checkBalance) {
          if (Number(cost) > this.amountBalance) return;
        }

        this.digits += value + '';
        this.cost = cost.toFixed(2);
        this.onValue();
      }

      if (this.activeButton === 1) {
        this.digits += value + '';
        this.cost = cost.toFixed(2);
        this.onValue();
      }

      this.getAmount();

    } else {
    }
  }

  back() {

    if (this.digits.length > 1) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      const cost = parseFloat(this.digits) * 0.01;
      this.cost = cost.toFixed(2);
      this.onValue();
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.digits = '';
    this.cost = '0.00';
    this.onValue();
  }

  onValue() {
    if (this.activeButton === 0) {
      this.amountPayment = this.cost;
      //this.setTips(this.selectedTip);
    } else {
      this.amountTip = this.cost;
    }
    if (this.selectedTip === 3) this.tips = Number(this.amountTip);
  }

  onActiveSelected(value: number): string {
    return this.selectedTip === value ? 'bg-[#557AD9] text-white' : 'text-[#557AD9] bg-[#E5EDFE]'
  }

  setTips(value: number) {

    if (this.allowAuth) {
      this.digits = '';

      switch (value) {
        case 0:
          this.activeButton = 0;
          this.tips = floatToDecimal(Number(this.amountSubTotal) * 0.15);
          this.onShowTips(0.15);
          break;
        case 1:
          this.activeButton = 0;
          this.tips = floatToDecimal(Number(this.amountSubTotal) * 0.18);
          this.onShowTips(0.18);
          break;
        case 2:
          this.activeButton = 0;
          this.tips = floatToDecimal(Number(this.amountSubTotal) * 0.20);
          this.onShowTips(0.20);
          break;
        case 3:
          this.activeButton = 1;
          this.amountTip = "";
          this.amountPayment = this.amountBalance!.toFixed(2);
          break;
        case 4:
          this.activeButton = 0;
          this.amountTip = "--";
          this.tips = 0;
          this.amountPayment = this.amountBalance!.toFixed(2);
          break;
      }
    } else {
      this.amountTip = "--";
      this.tips = 0;
    }
  }


}

