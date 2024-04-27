import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Invoice} from '@models/invoice.model';
import {InvoiceService} from '@core/services/bussiness-logic/invoice.service';
import {ColDef, FirstDataRenderedEvent, ValueFormatterParams} from "ag-grid-community";
import {ProductOrder} from "@models/product-order.model";
import {PaymentOpEnum} from "@core/utils/operations";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";

@Component({
  selector: 'app-info-pay-order',
  templateUrl: './info-pay-order.component.html',
  styleUrls: ['./info-pay-order.component.css']
})
export class InfoPayOrderComponent {

  public invoiceOrder: undefined | Invoice;
  public columnDefs: undefined | ColDef[] = [];
  public rowData: undefined | ProductOrder[] = [];
  public rowSelection: 'single' | 'multiple' = 'single';
  defaultColDef: ColDef = {
    resizable: true,
  };
  typePaid: string = "";
  private paymentOpEnum?: PaymentOpEnum;
  private paidInvoice!: number;

  constructor(private dialogRef: MatDialogRef<InfoPayOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private invoiceService: InvoiceService,
              private cashService: CashService,
              private operationService: OperationsService) {

    this.invoiceOrder! = data.invoice!;
    this.paymentOpEnum! = data.payment;
    this.typePaid = data.typePaid;
    this.paidInvoice = data.paidInvoice!;

    console.log("Dejame ver que llega", data);


    this.rowData = this.invoiceOrder?.productOrders;
    this.onColumnDefs();
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + params.value.toFixed(2);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onPayOrder(pay: boolean) {
    this.dialogRef.close({Pay: pay})
  }

  onEmailOrder(b: boolean) {

  }

  onSmsOrder() {
  }

  onPrintOrder() {
    this.operationService.print(this.invoiceService.invoice!);
  }

  onCancelOrder(b: boolean) {
    this.dialogRef.close()
  }

  getTax() {
    return this.paymentOpEnum == PaymentOpEnum.CASH && this.cashService.config.sysConfig.removeTax
      ? '0.00' : this.invoiceOrder?.tax?.toFixed(2);
  }

  getTotal() {
    /*
    return this.paymentOpEnum ==  this.cashService.config.sysConfig.removeTax
      ? this.invoiceOrder?.subTotal?.toFixed(2) : this.invoiceOrder?.total?.toFixed(2);
    */
    return (this.invoiceOrder!.total + this.invoiceOrder!.tipAmount!).toFixed(2)
  }

  getPaid() {
    return this.invoiceOrder!.balance!.toFixed(2)
  }

  private onColumnDefs() {

    this.columnDefs = [
      {headerName: 'ITEM NAME', field: 'productName', width: 300},
      {headerName: 'QTY', field: 'quantity'},
      {headerName: 'PRICE', field: 'unitCost', valueFormatter: this.AmountFormat},
      {headerName: 'TAX', field: 'tax', valueFormatter: this.AmountFormat},
      {headerName: 'SUBTOTAL', field: 'subTotal', valueFormatter: this.AmountFormat},
    ];
  }

}
