import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild, ViewChildren,
} from '@angular/core';
import {Router} from '@angular/router';
import {forkJoin, Subscription} from 'rxjs';
import {CashSales, Functions, ICashSales, IFunctions, ISales, Sales} from '@models/financials';
import {InformationType} from '@core/utils/information-type.enum';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {CashService} from '@core/services/bussiness-logic/cash.service';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';

import {initFlowbite} from 'flowbite';
import {ReportsService} from '@core/services/bussiness-logic/reports.service';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {FinancialsComponent} from '@modules/home/component/financials/financials.component';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {DateRange} from '@angular/material/datepicker';
import {ChartComponent} from 'ng-apexcharts';
import {BlockRptSalesRevenueComponent} from '../block-rpt-sales-revenue/block-rpt-sales-revenue.component';
import {
  BlockRptMenuItemsBestsellerComponent
} from '../block-rpt-menu-items-bestseller/block-rpt-menu-items-bestseller.component';
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {AgChartsAngularModule} from "ag-charts-angular";
import {
  CardsFinancialReportComponent
} from "@modules/home/component/cards-financial-report/cards-financial-report.component";
import {DateRangeComponent} from "@modules/home/component/daterange/daterange.component";
import {ButtonDateRangeComponent} from "@modules/home/component/button-date-range/button-date-range.component";
import {fnFormatDate, fnSetRangeDate} from "@core/utils/functions/functions";
import {
  TablePayMethodComponent
} from "@modules/home/component/rpt-financial-new/table-pay-method/table-pay-method.component";
import {ProgressCircleComponent} from "@modules/home/component/progress-circle/progress-circle.component";
import {NgIf} from "@angular/common";

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  standalone: true,
  selector: 'app-rpt-financial-new',
  templateUrl: './rpt-financial-new.component.html',
  styleUrl: './rpt-financial-new.component.css',
  providers: [{provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}],
  imports: [
    BlockRptMenuItemsBestsellerComponent,
    AgChartsAngularModule,
    BlockRptSalesRevenueComponent,
    CardsFinancialReportComponent,
    DateRangeComponent,
    ButtonDateRangeComponent,
    TablePayMethodComponent,
    ProgressCircleComponent,
    NgIf
  ],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class RptFinancialNewComponent
  implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('financials_cards', { static: false}) financials_cards?: FinancialsComponent;
  @ViewChild('salesrevenues', {static: false}) sales_revenes_block?: BlockRptSalesRevenueComponent;
  @ViewChild('menuitems', {static: false}) menuitems?: BlockRptMenuItemsBestsellerComponent;

  //@ViewChild('chart', {static: true}) chart?: ChartComponent;
  @Input() fromDate?: string;
  @Input() toDate?: string;
  public sales?: ISales;
  public cash?: ICashSales;
  public functions?: IFunctions;

  lines?: any[];
  mediaPayments?: any[];
  mediaSales?: any[];
  showProgressReport: boolean = true;
  timePicker: boolean = true;
  maxDate?: Date;

  rangeSelectDate?: DateRange<Date>;


  events: string[] = [];
  optionsPaymentsChart: any;
  optionsCardsChart: any;

  protected readonly onchange = onchange;
  protected readonly RangeDateOperation = RangeDateOperation;
  private subscription: Subscription[] = new Array<Subscription>();

  constructor(
    private dialogService: DialogService,
    private cashService: CashService,
    private reportService: ReportsService,
    private operationService: OperationsService,
    private dataStorage: DataStorageService,
    private router: Router,
    //private cdr: ChangeDetectorRef
  ) {
  }

  get reportStartDate() {
    return fnFormatDate(this.rangeSelectDate?.start!);
  }

  get reportEndDate() {
    return fnFormatDate(this.rangeSelectDate?.end!);
  }

  ngAfterViewInit(): void {
    initFlowbite();
    this.rangeSelectDate = fnSetRangeDate(RangeDateOperation.ThisMonth);
    this.onReportView();
  }

  onSetDataReport(data: any, data1: any) {

    if (data) {

      debugger;

      this.sales_revenes_block?.onSetDataReport(data1, data);
      this.financials_cards?.onGenerateReport(this.reportStartDate, this.reportEndDate, true);
      this.menuitems?.onGenerateReport(this.reportStartDate, this.reportEndDate);

      this.sales = new Sales(
        data.saleTax,
        data.taxSale,
        data.grossSale,
        data.refunds,
        data.taxRefunds,
        data.accountChargeTotal,
        data.accountPaymentTotal,
        data.netSale,
        data.tipAmount
      );

      this.cash = new CashSales(
        data.cashSale,
        data.cashAccountPayment,
        data.paidOut,
        data.paidIn,
        data.cashDue,
        data.ticketsCount,
        data.avgTickets
      );

      this.functions = new Functions(
        data.refunds,
        data.openChecks,
        data.voidTickets,
        data.paidOut,
        data.paidIn,
        data.discounts
      );

      this.lines = data.stationDataViewModels;
      this.mediaPayments = data.paymentsDataViewModels;
      this.mediaSales = data.mediaDataViewModels;


      this.setDataConfigurPaymentsChart(data);

      this.optionsCardsChart = {
        data: data.mediaDataViewModels,
        series: [
          {
            type: 'pie',
            calloutLabelKey: 'name',
            angleKey: 'total',
            innerRadiusOffset: -70,
            legendItemKey: 'name',
            sectorLabelKey: 'total',
            sectorLabel: {
              color: 'white',
              fontWeight: 'bold',
            },
            fills: ["#9B8AE6", "#4350E3", "#CBCED4", "#DDEAF3", "#32C5FF", "#597393"],
            strokes: ["#9B8AE6", "#4350E3", "#CBCED4", "#DDEAF3", "#32C5FF", "#597393"],
          },
        ],
      };


    }
  }

  ngOnInit(): void {
    this.maxDate = new Date();
  }

  onReportPrint() {
    //this.onGenerateReport(this.reportStartDate, this.reportEndDate, true);
  }

  onGenerateReport(startDate: string, endDate: string, print: boolean) {
    this.operationService.resetInactivity(true);

    if (print) {
      const dialogLoading = this.dialogService.openGenericInfo(
        InformationType.INFO,
        'Getting close reports...'
      );

      this.subscription.push(
        this.reportService.getRangeClosePrint(startDate, endDate).subscribe(
          (next: any) => {
            console.log(next);
            dialogLoading?.close();
            this.cashService.resetEnableState();
          },
          (err) => {
            console.error(err);
            dialogLoading?.close();
            this.dialogService.openGenericInfo(InformationType.ERROR, err);
          }
        )
      );
    } else

      this.showProgressReport = true;

      this.subscription.push(
        forkJoin(
          this.dataStorage.getCloseReport(startDate, endDate),
          this.dataStorage.getCloseDayReportsByDate(startDate, endDate)
        ).subscribe((next: any) => {
            console.log(next);
            this.showProgressReport = false;

            setTimeout(() => {
              this.onSetDataReport(next[0], next[1]);
            }, 5);

            this.cashService.resetEnableState();
          },
          (err) => {
            console.error(err);
            this.showProgressReport = true;
            this.dialogService.openGenericInfo(InformationType.ERROR, err);
          }
        ));
  }

  ngOnDestroy(): void {
    this.subscription.map((sub) => sub.unsubscribe());
  }

  onClickSalesRevenue() {
    this.router.navigate(["/home/layout/reports/rptsalesrevenue"]);
  }

  onClickMenuItemSales() {
    this.router.navigate(["/home/layout/reports/rptmenuitemssales"]);
  }

  onReportView() {
    this.onGenerateReport(this.reportStartDate, this.reportEndDate, false);
  }

  onChangeDate($event: DateRange<Date>) {
    console.log($event);
    this.rangeSelectDate = $event;

    this.onReportView();
  }


  setDataConfigurPaymentsChart(dataValue: any) {

    this.optionsPaymentsChart = {
      data: dataValue.paymentsDataViewModels,
      series: [
        {
          type: 'pie',
          angleKey: 'total',
          calloutLabelKey: 'name',
          legendItemKey: 'name',
          sectorLabelKey: 'total',
          sectorLabel: {
            color: 'white',
            fontWeight: 'bold',
          },
          fills: ["#9B8AE6", "#4350E3", "#CBCED4"],
          strokes: ["#9B8AE6", "#4350E3", "#CBCED4"]
        },
      ],
    };
  }

}
