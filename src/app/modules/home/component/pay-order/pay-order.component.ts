import {AfterViewInit, Component, OnInit} from '@angular/core';

import {InvoiceService} from '@core/services/bussiness-logic/invoice.service';
import {MatDialog} from '@angular/material/dialog';
import {InfoPayOrderComponent} from '../info-pay-order/info-pay-order.component';
import {PaymentOpEnum} from "@core/utils/operations";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {PAXConnTypeEnum} from "@core/utils/pax-conn-type.enum";
import {CanComponentDeactivate} from "@core/guards/candeactivate.guard";
import {forkJoin, Observable} from 'rxjs';
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {DlgSplitComponent} from "@modules/home/component/dlg-split/dlg-split.component";
import {arraySplit} from "@models/split.model";
import {ProductOrder} from "@models/product-order.model";
import {PaidInvoice} from "@models/paid-invoice.model";
import {CompanyType} from "@core/utils/company-type.enum";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {isNullOrUndefined} from "@swimlane/ngx-datatable";
import {floatToDecimal} from "@core/utils/functions/functions";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {Router, UrlTree} from "@angular/router";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {Invoice} from "@models/invoice.model";
import {DialogType} from "@core/utils/dialog-type.enum";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {ConfirmPaymentComponent} from "@modules/home/component/confirm-payment/confirm-payment.component";

@Component({
  selector: 'app-pay-order',
  templateUrl: './pay-order.component.html',
  styleUrls: ['./pay-order.component.css']
})
export class PayOrderComponent extends AbstractInstanceClass implements CanComponentDeactivate, OnInit, AfterViewInit {
  //public invoice?: Invoice;
  public payment: PaymentOpEnum = PaymentOpEnum.CASH;
  splitInvoice?: any[][] = [];
  protected readonly PaymentOpEnum = PaymentOpEnum;
  private cancelOperation: boolean = false;
  private enableSplit: boolean = false;

  constructor(
    public invoiceService: InvoiceService,
    private dialogService: DialogService,
    private cashService: CashService,
    private router: Router,
    public dialog: MatDialog,
    private departProduct: DepartProductService,
    private operationService: OperationsService,
    private searchService: SearchService) {
    super();
  }

  get enableSplitOrder() {
    return this.invoiceService.groupByProductOrder(this.invoiceService.invoice?.productOrders!).length < 1
  }

  get disableRefound() {
    return this.invoiceService.invoice?.isRefund
  }

  ngAfterViewInit(): void {
    this.sub$.push(this.invoiceService.evNewInvoice.subscribe((next: any) => {
      this.emitCreateInvoive(next);
    }));

    this.sub$.push(this.operationService.paidDocumentObservable().subscribe((next: PaidInvoice) => {
      if (next && next!.invoice && next?.invoice?.applicationUserId!) {
        this.onDebitOrCreditDocument(next);
      }
    }));

    this.searchService.setStateButtons(true);
  }

  canDeactivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const balance = floatToDecimal(
      isNullOrUndefined(this.invoiceService.invoice?.balance) ? 0.00 : this.invoiceService.invoice?.balance!);

    const fsTotal = floatToDecimal(isNullOrUndefined(this.invoiceService.invoice?.fsTotal!) ?
      0.00 : this.invoiceService.invoice?.fsTotal!);

    if (balance === fsTotal) {
      this.searchService.setStateButtons(false);
      this.invoiceService.removeInvoice();
      return true;
    }

    if (this.cancelOperation!) {
      this.operationService.resetInactivity(false);
      this.searchService.setStateButtons(false);
    }

    return this.cancelOperation;
  };

  modifedCashStar() {
    return forkJoin(
      //users.map(user => this.updateUser(user))
      this.invoiceService.invoice!.productOrders?.map((prodOrder: ProductOrder) => {

      })
      //return this.invoiceService.invoice?.productOrders
    );

    //this.invoiceService.invoice?.productOrders?.forEach( p => {
    //
    //});
  }

  onFormPayment(payment: PaymentOpEnum) {

    this.payment = payment;

    switch (this.payment) {
      case PaymentOpEnum.CASH:
        this.onCashPay()
        break;
      case PaymentOpEnum.OTHER:
        this.operationService.setOtherPaymentType()
        break;
      case PaymentOpEnum.ZELLE:
        this.onPaidLine(PaymentOpEnum.ZELLE, true);
        break;
      case PaymentOpEnum.DOORDASH:
        this.onPaidLine(PaymentOpEnum.DOORDASH, false);
        break;
      case PaymentOpEnum.UBER:
        this.onPaidLine(PaymentOpEnum.UBER, false);
        break;
      case PaymentOpEnum.SAUCE:
        this.onPaidLine(PaymentOpEnum.SAUCE, false);
        break;
      default:
        this.onFormsOfPpayment(this.operationService.getTotalToPaid(PaymentOpEnum.CREDIT_CARD),
          this.payment === PaymentOpEnum.DEBIT_CARD ? "DEBIT CARD" : "CREDIT CARD");
        break
    }
  }

  onPaidLine(codeOperation?: PaymentOpEnum, confirmation: boolean = true) {
    this.operationService.calculatorTips(
      {
        amountPaid: this.operationService.getTotalToPaid(PaymentOpEnum.CASH),
        amountSubTotal: this.invoiceService.invoice?.subTotal!, isRefund: this.invoiceService.invoice?.isRefund,
        amountBalance: this.invoiceService.invoice?.balance,
        checkBalance: true,
      }).subscribe((next: any) => {
      if (next) {

        if (confirmation) {

          /*
          this.dialogService.dialog.open(AddCodeComponent, {
            width: '511px', height: '310px',
            data: {
              titleCode: "Type operation code"
            },
            disableClose: true
          })
          */

          this.dialogService.openDialog(ConfirmPaymentComponent, "", "432px", "508px", false)
            .afterClosed().subscribe((nextCode: any) => {

            if (nextCode) {
              this.invoiceService.invoice!.tip = next.cashTip;
              this.onFormsOfPpayment(next!.cashInvoice, nextCode, codeOperation!, next.cashTip)
            }
          })


        } else {
          this.invoiceService.invoice!.tip = next.cashTip;
          this.onFormsOfPpayment(next!.cashInvoice, undefined, codeOperation!, next.cashTip)
        }
      }
    });
  }

  onChangeProductStar(cashInvoice: number, cashTip: number) {
    let productStar = this.invoiceService.invoice!.productOrders!.filter(p => p.isStar);

    if (productStar!.length > 0) {

      const totalProductStar = productStar!
        .reduce((p: number, productOrder: ProductOrder) => p + (productOrder.quantity * productOrder.unitCost), 0)

      let totalProduct = 0;

      productStar!.map((prodOrd: ProductOrder) => {
        const product = this.departProduct.getProducts().filter(p => p.id === prodOrd.productId)[0];
        prodOrd.unitCost = product.currentPrice;
        totalProduct += (prodOrd.unitCost * prodOrd.quantity)
      });

      this.invoiceService.updateProductOrderByInvoice(productStar, this.invoiceService.receiptNumber)
        .subscribe((next: Invoice) => {

          console.log(" Conversion product order to star ->", next);
          let totalInvoice = this.invoiceService.invoice!.total;

          this.invoiceService.setInvoice(next);

          const totalPaid = cashInvoice - (totalProductStar - totalProduct);

          this.onFormsOfPpayment(totalPaid, "CASH", undefined, cashTip);

        }, error => {
          this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error)
        })
    }
  }

  onCashPay() {

    /* Check product star in invoice */
    /*
    if (this.operationService.existsProductOrderStar()) {
      this.onChangeProductStar(next.cashTip);
    }
    */

    this.operationService.calculatorTips(
      {
        amountPaid: this.operationService.getTotalToPaid(PaymentOpEnum.CASH),
        amountSubTotal: this.invoiceService.invoice?.subTotal!,
        amountBalance: this.invoiceService.invoice?.balance,
        checkBalance: false,
        isRefund: this.invoiceService.invoice?.isRefund
      }).subscribe((next: any) => {
      if (next) {

        /* procedure star*/
        if (this.operationService.existsProductOrderStar()) {

          if (this.invoiceService.invoice?.balance! <= (next!.cashInvoice + next!.cashTip)) {
            console.log('product star ->', this.invoiceService.invoice!.productOrders);
            this.onChangeProductStar(next!.cashInvoice, next!.cashTip);
          } else {
            this.dialogService.openGenericAlert(DialogType.DT_WARNING, "Information",
              "Partial payments are not allowed on invoices with star products");
          }
        } else {
          this.onFormsOfPpayment(next!.cashInvoice, "CASH", undefined, next.cashTip);
        }
      }
    });
  }

  onFormsOfPpayment(amount: number, infoPaid?: string, code?: PaymentOpEnum, tips?: number) {
    let cardTotal =
      this.cashService.config.sysConfig.paxConnType == PAXConnTypeEnum.OFFLINE ? amount : 0.00;

    this.invoiceService.invoice!.tip = 0;

    switch (this.payment) {
      case PaymentOpEnum.EBT_CARD:
        break;
      case PaymentOpEnum.CASH:
        this.operationService.cashMoney(amount, tips!);
        break;
      case PaymentOpEnum.OTHER:
        break;
      case PaymentOpEnum.DEBIT_CARD:
        this.operationService.detectPAXConn(PaymentOpEnum.DEBIT_CARD, Math.abs(cardTotal));
        break;
      case PaymentOpEnum.CREDIT_CARD:
        this.operationService.detectPAXConn(PaymentOpEnum.CREDIT_CARD, Math.abs(cardTotal));
        break;
      case PaymentOpEnum.CHECK:
        this.operationService.check();
        break;
      case PaymentOpEnum.GIFT_CARD:
        break;
      case PaymentOpEnum.TRANSFER:
        break;
      case PaymentOpEnum.CREDIT_CARD_MANUAL:
        break;
      case PaymentOpEnum.ONLINE:
        break;
      case PaymentOpEnum.ZELLE:
        this.operationService.PaidInline(infoPaid!, amount, PaymentOpEnum.ZELLE, tips);
        break;
      case PaymentOpEnum.DOORDASH:
        this.operationService.PaidInline(infoPaid!, amount, PaymentOpEnum.DOORDASH, tips);
        break;
      case PaymentOpEnum.UBER:
        this.operationService.PaidInline(infoPaid!, amount, PaymentOpEnum.UBER, tips);
        break;
      case PaymentOpEnum.SAUCE:
        this.operationService.PaidInline(infoPaid!, amount, PaymentOpEnum.SAUCE, tips);
        break;
      default:
        break
    }
  }

  onBackOrder() {
    this.operationService.resetSubTotalState();
    this.router.navigateByUrl("/home/layout/invoice/departaments");
  }

  onAllOrder() {
    this.operationService.resetSubTotalState();
    this.router.navigateByUrl("/home/layout/orders/orderlist");
  }

  onPrintPreparedOrder() {
    this.operationService.printPepared();
  }

  gotoNavegator() {
    this.cancelOperation = true;
    this.operationService.gotoHome();
  }

  onCancelOperation() {
    if (this.invoiceService.invoice!.balance === this.invoiceService.invoice!.total) {
      this.dialogService.openGenericInfo('Confirm', 'You want to cancel the paid operation?', null, true)!
        .afterClosed().subscribe((next: any) => {
        console.log(next);
        if (next !== undefined && next.confirm) {
          this.invoiceService.invoice!.status = InvoiceStatus.IN_PROGRESS;
          (this.invoiceService!.invoice!.isRefund) ?
            this.operationService.cancelRefund(() => {
              this.gotoNavegator();
            }) : this.gotoNavegator()
        }
      });
    } else {
      this.dialogService.openGenericInfo("Error", "Please complete the payment operation...")
    }
  }

  onSplitPay() {

    if (this.invoiceService.order!.table!.chairNumber! > 0) {
      let arrPosition = this.invoiceService
        .groupByProductOrder(this.invoiceService.invoice?.productOrders!);

      let split: arraySplit[] = [];

      arrPosition.forEach(a => {
        split.push({id: a, visible: true, selected: false})
      });

      //groupByProductOrder
      this.dialog.open(DlgSplitComponent, {
        width: '648px', height: '600px',
        data: {positionTable: split},
        disableClose: true
      }).afterClosed().subscribe((next: any) => {
        console.log(next);
        if (next) {
          this.splitInvoice = next.split;
        }
      });
    }
  }

  filterProductOrder(productOrders: ProductOrder[], split: arraySplit[]) {
    const prod: ProductOrder[] = [];

    productOrders.forEach(p => {
      if (split.map(value => {
        return value.id
      }).includes(p.position)) {
        prod.push(p);
      }
    })
    return prod;
  }

  private onDebitOrCreditDocument(next: PaidInvoice) {
    let operation: string;
    this.dialog
      .open(InfoPayOrderComponent, {
        width: '704px', height: '640px',
        disableClose: false,
        data: {
          invoice: next!.invoice!,
          amountPaid: next!.invoice!.total,
          amountSubTotal: next!.invoice!.subTotal,
          paidInvoice: next!.paidInvoice,
          typePaid: next!.payment!
        }
      })
      .afterClosed().subscribe((data: any) => {
      if (next.invoice!.balance === 0) {
        this.invoiceService.removeInvoice();
        if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT) {
          this.router.navigateByUrl("/home/layout/tables");
        } else {
          this.router.navigateByUrl("/home/layout/invoice/departaments");
        }
      }
    }, error => {
      this.dialogService.openGenericInfo("Error", error)
    });
  }

  private emitCreateInvoive(next: any) {
    console.log("create invoice -> ", next);
    this.onBackOrder();
  }

}
