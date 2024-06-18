import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CashSales, Functions, ICashSales, IFunctions, ISales, Sales} from 'src/app/models/financials';
import {Theme} from 'src/app/models/theme';
import {DataStorageService} from "@core/services/api/data-storage.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {InformationType} from "@core/utils/information-type.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent implements OnInit, OnDestroy {
  title?: string;
  subtitle?: string;
  @Input() sales?: ISales;
  @Input() cash?: ICashSales;
  @Input() functions?: IFunctions;
  lines?: any[];
  mediaPayments?: any[];
  mediaSales?: any[];
  fromDate?: string;
  toDate?: string;
  subscription?: Subscription;

  theme: string = this.th.theme;

  constructor(private th: Theme, public dialogRef: MatDialogRef<FinancialReportComponent>,
              private dialogService: DialogService,
              @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService,
              private cashService: CashService) {
    console.log('financial report', data);
    if (data.title) {
      this.title = data.title;
    }
    if (data.subtitle) {
      this.subtitle = data.subtitle;
    }
    if (data.fromDate) {
      this.fromDate = data.fromDate;
    }
    if (data.toDate) {
      this.toDate = data.toDate;
    }
    if (data.data) {
      const data = this.data.data;
      this.sales = new Sales(data.saleTax, data.taxSale, data.grossSale, data.refunds,
        data.taxRefunds, data.accountChargeTotal, data.accountPaymentTotal, data.netSale);

      this.cash = new CashSales(data.cashSale, data.cashAccountPayment, data.paidOut, data.paidIn,
        data.cashDue, data.ticketsCount, data.avgTickets);

      this.functions = new Functions(data.refunds, data.openChecks, data.voidTickets,
        data.paidOut, data.paidIn, data.discounts);

      this.lines = data.stationDataViewModels;
      this.mediaPayments = data.paymentsDataViewModels;
      this.mediaSales = data.mediaDataViewModels;
    }
  }

  ngOnInit() {
  }

  printCloseReport() {
    /* this.subscription =  */
    this.dialogRef.close();
    const dialogPrinting = this.dialogService.openGenericInfo(InformationType.INFO, 'Printing Range Close Report...')
    this.subscription = this.dataStorage.rangeClosePrint(this.fromDate!, this.toDate!).subscribe(
      next => {
        console.log('printRangeCloseReport', next);
        dialogPrinting?.close();
        this.dialogService.openGenericInfo(InformationType.INFO, 'Print report successful');
      },
      err => {
        dialogPrinting?.close();
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    /* this._destroyed$.next();
    this._destroyed$.complete(); */
  }

}
