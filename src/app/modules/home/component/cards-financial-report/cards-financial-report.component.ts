import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {CashSales, Functions, ICashSales, IFunctions, ISales, Sales} from "@models/financials";
import {ActivatedRoute} from "@angular/router";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {InformationType} from "@core/utils/information-type.enum";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  standalone: true,
  selector: 'app-cards-financial-report',
  templateUrl: './cards-financial-report.component.html',
  styleUrl: './cards-financial-report.component.css'
})
export class CardsFinancialReportComponent implements OnInit, OnDestroy {
  @Input({required: true}) reportStartDate?: string;
  @Input({required: true}) reportEndDate?: string;
  @Input() showPrint?: boolean = true;
  @Input() cashierId: string = "";
  @Input() closeDay?: boolean = true;
  @Output() evtProgress = new EventEmitter<boolean>()
  public sales?: ISales;
  public cash?: ICashSales;
  public functions?: IFunctions;
  lines?: any[];
  mediaPayments?: any[];
  mediaSales?: any[];
  showReport: boolean = false;
  startDate?: string;
  endDate?: string;
  private subscription: Subscription[] = new Array<Subscription>();

  constructor(private route: ActivatedRoute,
              private dataStorage: DataStorageService,
              private cashService: CashService,
              private operationService: OperationsService,
              private reportService: ReportsService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    //this.showReport = false;
    //this.onGenerateReport( this.reportStartDate!, this.reportEndDate!);
    this.startDate = this.reportStartDate;
    this.endDate = this.reportEndDate;
  }

  onGenerateReport(startDate: string, endDate: string) {
    console.log('getFullReport');

    this.evtProgress.emit(true);

    const serviceExecute = this.closeDay ?
      this.dataStorage.getCloseReport(startDate, endDate) :
      this.reportService.cashierCloseShiftPrint(false, false, this.cashierId, startDate, endDate);

    this.subscription.push(serviceExecute.subscribe(
      (next: any) => {
        console.log("data repor ->", next);
        this.onSetDataReport(next);
        this.cashService.resetEnableState();
        this.showReport = true;
        this.evtProgress.emit(false);
      },
      err => {
        console.error(err);
        this.evtProgress.emit(false);
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
      }
    ));
  }

  onSetDataReport(data: any) {
    if (data) {
      this.sales = new Sales(
        data.saleTax,
        data.taxSale,
        data.grossSale,
        data.refunds,
        data.taxRefunds,
        data.accountChargeTotal,
        data.accountPaymentTotal,
        data.netSale, undefined,
        data.tipAmount);

      this.cash = new CashSales(
        data.cashSale, data.cashAccountPayment,
        data.paidOut, data.cashDue,
        data.ticketsCount, data.avgTickets);

      this.functions = new Functions(
        data.refunds, data.openChecks,
        data.voidTickets, data.paidOut,
        data.paidIn, data.discounts);

      this.lines = data.stationDataViewModels;
      this.mediaPayments = data.paymentsDataViewModels;
      this.mediaSales = data.mediaDataViewModels;
    }
  }

  printFinancialReport() {

    const dialogPrinting =
      this.dialogService.openGenericInfo(InformationType.INFO, 'Printing Range Close Report...');

    this.subscription.push(this.dataStorage.rangeClosePrint(this.reportStartDate!, this.reportEndDate!).subscribe(
      next => {
        console.log('printRangeCloseReport', next);
        dialogPrinting!.close();
      },
      err => {
        dialogPrinting!.close();
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.map(sub => sub.unsubscribe());
  }

}
