import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TypeKey} from '@core/utils/typekey.enum';
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {PaymentMethodEnum} from '@core/utils/operations/payment-method.enum';
import type {DropdownInterface, DropdownOptions} from "flowbite";
import {Dropdown, initFlowbite} from 'flowbite'
import {PaymentInvoice} from "@models/financials/payment-invoice.model";
import {floatToDecimal} from "@core/utils/functions/functions";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-calculator-adjust',
  templateUrl: './calculator-adjust.component.html',
  styleUrls: ['./calculator-adjust.component.css']
})
export class CalculatorAdjustComponent implements OnInit, AfterViewInit {
  public amountPayment: string = "0.00";
  digits = '';
  cost = '';
  maxlength = 8;
  titleCalculator?: string;
  receiptId?: string;
  selectAcction: number = 1;
  selectPayment: PaymentInvoice[] = [];
  selectedPay?: PaymentInvoice;
  $targetEl?: HTMLElement;
  $triggerEl?: HTMLElement;
  public btnCASH: boolean = true;
  public btnDEBIT: boolean = true;
  public btnCREDIT: boolean = true;
  public btnONLINE: boolean = true;
  protected readonly TypeKey = TypeKey;

  constructor(private invoiceService: InvoiceService,
              private dialogService: DialogService,
              private cashService: CashService,
              private dialogRef: MatDialogRef<CalculatorAdjustComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.receiptId = data!.receiptId;
    this.titleCalculator = data!.titleCalculator
    if (data!.password!) {
      this.amountPayment = "";
      this.maxlength = data!.maxlength!;
    }
  }

  ngAfterViewInit(): void {
    this.$targetEl = document.getElementById('dropdownDelay')!;

    // set the element that trigger the dropdown menu on click
    this.$triggerEl = document.getElementById('dropdownDelayButton')!;


    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,
      onHide: () => {
        console.log('dropdown has been hidden');
      },
      onShow: () => {
        console.log('dropdown has been shown');
      },
      onToggle: () => {
        console.log('dropdown has been toggled');
      }
    };

    const dropdown: DropdownInterface = new Dropdown(this.$targetEl, this.$triggerEl, options);

  }

  ngOnInit(): void {
    if (this.cashService.config.sysConfig.allowTip!) {
      this.invoiceService.getInvoicePayment(this.receiptId!).subscribe(
        (nextPayment: any) => {
          console.log("Payment -> ", nextPayment)

          nextPayment.forEach((p: any) => {

            switch (p.paymentMethod as PaymentMethodEnum) {
              case PaymentMethodEnum.CASH:
                this.btnCASH = false;
                this.selectAcction = 1;
                this.selectPayment.push({
                  confirmationCode: "",
                  paymentMethod: PaymentMethodEnum.CASH.toString(),
                  paymentId: p?.id,
                  invoiceId: p?.invoiceId,
                  tip: 0,
                  amount: p?.balance,
                  card: "CASH"
                })
                break;
              case PaymentMethodEnum.CREDIT_CARD:
                this.btnCREDIT = false;
                this.selectAcction = 2;
                this.selectPayment.push({
                  confirmationCode: p?.creditCard?.ccNumber,
                  paymentMethod: PaymentMethodEnum.CREDIT_CARD.toString(),
                  paymentId: p?.id,
                  invoiceId: p?.invoiceId,
                  tip: 0,
                  amount: p?.balance,
                  card: "CREDIT"
                })
                break;
              case PaymentMethodEnum.DEBIT_CARD:
                this.btnDEBIT = false;
                this.selectAcction = 3;
                this.selectPayment.push({
                  confirmationCode: p?.debitCard?.ccNumber,
                  paymentMethod: PaymentMethodEnum.DEBIT_CARD.toString(),
                  paymentId: p?.id,
                  invoiceId: p?.invoiceId,
                  tip: 0,
                  amount: p?.balance,
                  card: "DEBIT"
                })
                break;
              case PaymentMethodEnum.Online:
                this.btnONLINE = false;
                this.selectAcction = 4;
                this.selectPayment.push({
                  confirmationCode: p?.confirmationCode,
                  paymentMethod: PaymentMethodEnum.Online.toString(),
                  paymentId: p?.id,
                  invoiceId: p?.invoiceId,
                  tip: 0,
                  amount: p?.balance,
                  card: p?.onlinePayment!.paymentMethod
                })
                break;
            }
          });

          /* Chequear que exista una tarjeta CASH */
          const filterCash = this.selectPayment.filter(p => p.paymentMethod === '1');

          if (filterCash.length === 0) {
            this.selectPayment.push({
              confirmationCode: "",
              paymentMethod: PaymentMethodEnum.CASH.toString(),
              paymentId: '',
              invoiceId: this.selectPayment[0].invoiceId,
              tip: 0,
              amount: 0.00,
              card: "CASH"
            });
          }

          this.selectPayment = this.selectPayment
            .sort((a, b) => (a.paymentMethod < b.paymentMethod ? -1 : 1));

        }, error => {
          this.dialogService.openGenericInfo("Error", error)
        });
    }
  }

  onAccept() {
    if (/* (Number(this.amountPayment) > 0) && */ (this.selectedPay)) {
      this.selectedPay.tip = floatToDecimal(this.amountPayment);
      this.dialogRef.close({
        cash: this.amountPayment,
        typeOperation: this.selectAcction,
        paymentTip: this.selectedPay
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

  onSelectPayment($event: PaymentInvoice) {
    console.log("Selected payment ->", $event)
    this.selectedPay = $event;
  }
}

