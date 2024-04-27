import {AfterViewInit, Component, input} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from 'ag-grid-community';
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {Router} from "@angular/router";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {Invoice} from "@models/invoice.model";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {Order} from "@models/order.model";
import {CalculatorAdjustComponent} from "@modules/home/component/calculator-adjust/calculator-adjust.component";
import {MatDialog} from "@angular/material/dialog";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {AddCodeComponent} from "@modules/home/component/add-code/add-code.component";
import {PaymentInvoice} from "@models/financials/payment-invoice.model";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

import {Tooltip} from 'flowbite';
import type {TooltipOptions, TooltipInterface} from 'flowbite';

//import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-buttons-cell-render',
  templateUrl: './buttons-cell-render.html',
  styleUrls: ['./buttons-cell-render.css']
})
export class ButtonsCellRender extends AbstractInstanceClass implements ICellRendererAngularComp, AfterViewInit {
  params!: ICellRendererParams;
  status: number = 0;
  receiptNumber: undefined | string;
  invoice!: Invoice;


  constructor(private invoiceService: InvoiceService,
              private operationService: OperationsService,
              private tableService: TablesService,
              private dialogService: DialogService,
              private dialog: MatDialog,
              private router: Router) {
    super();
  }

  get isRefundDisabled() {
    const status =
      [InvoiceStatus.CANCEL, InvoiceStatus.REFUND, InvoiceStatus.IN_PROGRESS, InvoiceStatus.CREATED,
        InvoiceStatus.IN_HOLD]
    return status.includes(this.status) || this.params!.data!.isRefund!
  }

  get isCancel() {
    const status =
      [InvoiceStatus.IN_PROGRESS, InvoiceStatus.IN_HOLD]
    return status.includes(this.status) && !this.params!.data!.isRefund!
  }

  get isTips() {
    const status = [InvoiceStatus.PAID];
    return (status.includes(this.status) && !this.params!.data!.isRefund!)
  }

  get isPaid() {
    const status = [InvoiceStatus.PAID];
    return status.includes(this.status) || this.params!.data!.isRefund!
  }

  ngAfterViewInit(): void {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;

    this.status = this.params!.data!.status;
    this.receiptNumber = this.params!.data!.receiptNumber;
    this.invoice = (this.params!.data as Invoice);

    console.log('Table cell', params);
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }

  reopenOrder() {
    this.operationService.reopenOrder(this.receiptNumber!, true);
    /*
    if (this.invoiceService?.receiptNumber?.trim() === this.receiptNumber?.trim()) {
      this.router.navigateByUrl("home/layout/invoice/departaments")
    } else {
      this.invoiceService.digits = this.receiptNumber!;
      this.operationService.reviewCheck((invoice: Invoice) => {
        if (invoice?.order && invoice?.order!.type && invoice?.order!.tableId) {
          this.tableService.getTable(invoice?.order!.tableId).subscribe(nextTable => {
            this.tableService.setTableSelected(nextTable);
            this.invoiceService.setDineIn(nextTable).subscribe((next: Order) => {
              this.invoiceService.invoice!.order = next;
              this.invoiceService.setOrderEmit(next);
              const status = [InvoiceStatus.CANCEL, InvoiceStatus.PAID];
              (invoice && status.includes(invoice!.status)) ?
                this.router.navigateByUrl("home/layout/orders/orderview") :
                this.router.navigateByUrl("home/layout/invoice/departaments")
            })
          })
        } else {
          const status = [InvoiceStatus.CANCEL, InvoiceStatus.PAID];
          (invoice && status.includes(invoice!.status)) ?
            this.router.navigateByUrl("home/layout/orders/orderview") :
            this.router.navigateByUrl("home/layout/invoice/departaments")
        }

      });
    }
    */
  }

  processRefund(receiptNumber: string) {
    this.operationService.refund(receiptNumber);
    this.router.navigateByUrl("home/layout/invoice/departaments");
  }

  refundSale() {
    if (this.invoiceService.invoice?.productOrders?.length! > 0 &&
      !this.invoiceService.disableHold) {
      this.invoiceService.InProgressOrder().subscribe(
        next => {
          this.processRefund(this.receiptNumber!);
        },
        err => {
          this.dialogService.openGenericInfo('Error', 'Can\'t complete hold order operation')
        });
    } else {
      this.processRefund(this.receiptNumber!);
    }
  }

  onPrintInvoice() {
    this.invoiceService.digits = this.params.data!.receiptNumber;
    this.operationService.reprint();
  }

  textOperationOpen() {
    const status = [InvoiceStatus.CANCEL, InvoiceStatus.PAID]
    return status.includes(this.status) ? "View" : "Open"
  }


  tipAuthorization(paymentTip: PaymentInvoice) {
    const dialog =
      this.dialogService.openDialog(ProgressSpinnerComponent, "", "289px", "316px");

    const payMethod = parseFloat(paymentTip!.paymentMethod);
    paymentTip!.paymentMethod = paymentTip!.card;

    this.invoiceService.tipAuthorization(payMethod, paymentTip).subscribe(next => {
      console.log("tip authorization ->", next)
      dialog.close();
    }, error => {
      dialog.close();
      this.dialogService.openGenericInfo("Error", error)
    });
  }

  authTips() {
    this.dialog.open(CalculatorAdjustComponent, {
      width: '510x', height: '650px', data: {receiptId: this.invoice!.id},
      disableClose: true
    }).afterClosed().subscribe(next => {
      if (next) {
        console.log(next);
        if (next!.paymentTip!.paymentMethod === '11') {
          this.dialogService.dialog.open(AddCodeComponent, {
            width: '511px', height: '310px',
            data: {
              titleCode: "Type operation code"
            },
            disableClose: true
          }).afterClosed().subscribe((nextCode: any) => {
            if (nextCode.result!) {
              next!.paymentTip.confirmationCode = nextCode.codeOperation;
              this.tipAuthorization(next!.paymentTip)
            }
          })
        } else {
          this.tipAuthorization(next!.paymentTip)
        }
        /*
        switch (next!.typeOperation) {
          case 1:
            break;
          case 2:
            this.invoiceService.debit(0, next!.cash, PaymentStatus.ADJUST, this.receiptNumber!)
              .subscribe(next => {
                dialog.close();
              },error => {dialog.close();this.cashService.openGenericInfo("Error", error)})
            break;
          case 3:
            this.invoiceService.credit(0, next!.cash, PaymentStatus.ADJUST, this.receiptNumber!)
              .subscribe(next => {
                dialog.close();
              },error => {dialog.close();this.cashService.openGenericInfo("Error", error)})
            break;
          case 5:
            break;
        }
        */
      }
    });
  }

  cancelInvoice() {
    this.operationService.void()
  }
}
