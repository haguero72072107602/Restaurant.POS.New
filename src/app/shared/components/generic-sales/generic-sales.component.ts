import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Payment} from '../../../models';
import {Theme} from 'src/app/models/theme';
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {InformationType} from "@core/utils/information-type.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-generic-sales',
  templateUrl: './generic-sales.component.html',
  styleUrls: ['./generic-sales.component.scss']
})
export class GenericSalesComponent implements OnInit {
  //sales: Payment;
  sales: any;
  salesByUser: any;
  recordsByUser: any;
  timeWorkedByUser: any;

  employee?: number;
  salesDate?: string;
  invoiceStatus?: string;
  paymentType?: number;

  theme: string = this.th.theme;

  constructor(private th: Theme, public dialogRef: MatDialogRef<GenericSalesComponent>,
              private dialogService: DialogService,
              @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService,
              private cashService: CashService, private invoiceService: InvoiceService, private operationService: OperationsService) {
    console.log('GenericSalesComponent', data);
    if (this.data.content) {
      this.populateSales(this.data.content);
    }

    if (this.data.empl && !this.data.date) {
      this.employee = this.data.empl.id;
      this.salesDate = this.data.salesDate;
      this.invoiceStatus = this.data.invoiceStatus;
      this.getSalesByDate(this.data.empl.id, this.data.salesDate, this.data.invoiceStatus);
      return;
    }
    if (this.data.empl && this.data.date && !this.data.salesDate) {
      this.getRecords(this.data.empl.id, this.data.date);
    }
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  populateSales(data: any) {
    this.sales = data.map((payment: any) => {
      return {'name': payment.name, 'total': payment.total};
    });
  }

  getSalesByPayment(paymentType: any) {
    console.log('getSalesByDate', this.employee, this.salesDate, this.invoiceStatus, paymentType);
    this.getSalesByDate(this.employee, this.salesDate, this.invoiceStatus, paymentType);
  }

  getSalesByDate(ev: any, date?: string, status?: string, paymentMethod?: number) {
    console.log('getSalesByDate', ev, date, status, paymentMethod);
    if (ev) {
      this.dataStorage.getInvoiceByUserAndDate(ev, date, status, paymentMethod).subscribe(next => {
        console.log(next);
        this.salesByUser = next.invoices;
      }, error1 => {
        console.error('getSales', error1);
        this.dialogService.openGenericInfo('Error', error1);
      });
    }
  }

  reviewCheck(receiptNumber: string) {
    this.invoiceService.digits = receiptNumber;
    this.operationService.reviewCheck();
    this.dialogRef.close();
  }

  onPrint() {
    console.log('Print invoices by user', this.data);
    this.dialogService.dialog.closeAll();
    let dialog: any;
    if (this.data.empl.id) {
      dialog = this.dialogService.openGenericInfo(InformationType.INFO, 'Printing report...');
      this.dataStorage.printInvoiceByUser(this.data.empl.id, this.data.salesDate, this.data.invoiceStatus)
        .subscribe(next => {
          dialog.close();
          console.log(next);
        }, error1 => {
          dialog.close();
          this.dialogService.openGenericInfo(InformationType.ERROR, error1);
        });
    } else {
      console.log('Debe seleccionar un empleado');
    }

  }

  private getRecords(id: string, date: string) {
    console.log('getRecords', id, date);
    if (id && date) {
      this.dataStorage.getWorkerRecordsByUser(id, date).subscribe(records => {
        console.log('records', records);
        this.dataStorage.getTimeWorkedByUser(id, date).subscribe(time => {
          console.log('timeWorked', time);
          this.recordsByUser = records;
          this.timeWorkedByUser = time;
        }, error1 => this.dialogService.openGenericInfo('Error', error1));
      }, error1 => {
        console.error('getSales', error1);
        this.dialogService.openGenericInfo('Error', error1);
      });
    }
  }
}
