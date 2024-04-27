import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {CashSales, Functions, ICashSales, IFunctions, ISales, Sales} from '@models/financials';
import {InformationType} from '@core/utils/information-type.enum';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {CashService} from '@core/services/bussiness-logic/cash.service';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';

import {initFlowbite} from 'flowbite';
import {getFormatDate,} from '@core/utils/functions/transformers';
import {ReportsService} from '@core/services/bussiness-logic/reports.service';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {FinancialsComponent} from '@modules/home/component/financials/financials.component';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {DateRange} from '@angular/material/datepicker';
import {ChartOptions} from '@models/apexcharts-options.model';
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
    ButtonDateRangeComponent
  ]
})
export class RptFinancialNewComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('financialscards', {static: true}) financials_cards?: FinancialsComponent;
  @ViewChild('salesrevenues', {static: true}) sales_revenes_block?: BlockRptSalesRevenueComponent;
  @ViewChild('menuitems', {static: true}) menuitems?: BlockRptMenuItemsBestsellerComponent;
  @ViewChild('chart', {static: true}) chart?: ChartComponent;
  @Input() fromDate?: string;
  @Input() toDate?: string;
  public sales?: ISales;
  public cash?: ICashSales;
  public functions?: IFunctions;

  lines?: any[];
  mediaPayments?: any[];
  mediaSales?: any[];
  showReport: boolean = false;
  timePicker: boolean = true;
  maxDate?: Date;

  rangeSelectDate?: DateRange<Date>;


  events: string[] = [];
  optionsPaymentsChart: any;
  optionsCardsChart: any;
  optionsSalesRevenue: ChartOptions;
  optionsItemsMenu: ChartOptions;
  protected readonly onchange = onchange;
  protected readonly RangeDateOperation = RangeDateOperation;
  private subscription: Subscription[] = new Array<Subscription>();
  private sales_revenue_data = [
    {
      id: 1,
      date: '2023-11-06',
      amount: 6540,
    },
    {
      id: 2,
      date: '2023-11-07',
      amount: 7340,
    },
    {
      id: 3,
      date: '2023-11-08',
      amount: 12840,
    },
    {
      id: 4,
      date: '2023-11-09',
      amount: 5000,
    },
    {
      id: 5,
      date: '2023-11-10',
      amount: 9840,
    },
    {
      id: 6,
      date: '2023-11-11',
      amount: 3840,
    },
    {
      id: 7,
      date: '2023-11-12',
      amount: 26140,
    },
  ];
  private items_menu = [
    {
      id: 1,
      name: "Pollo frito",
      amount: 20,
    },
    {
      id: 2,
      name: "Carne asada",
      amount: 73,
    },
    {
      id: 3,
      name: "Huevo frito",
      amount: 120,
    },
    {
      id: 4,
      name: "Cafe con leche",
      amount: 23,
    },
    {
      id: 5,
      name: "Jugo de naranja",
      amount: 15,
    },
    {
      id: 6,
      name: "Bistec de cerdo",
      amount: 50,
    },
    {
      id: 7,
      name: "Paleta de cerdo",
      amount: 30,
    },
  ];

  constructor(
    private dialogService: DialogService,
    private cashService: CashService,
    private reportService: ReportsService,
    private operationService: OperationsService,
    private dataStorage: DataStorageService,
    private router: Router,
  ) {


    const JustAmount = this.sales_revenue_data.map((item) => item.amount);
    const JustDates = this.sales_revenue_data.map((item) => item.date);

    this.optionsSalesRevenue = {
      /* data: sales_revenue_data,
      series: [
        {
          type: 'bar',
          xKey: 'date',
          yKey: 'amount',

        },
        {
          type: 'line',
          xKey: 'date',
          yKey: 'amount',
          direction:'vertical'

        },
      ],*/
      series: [
        {
          name: 'Sales revenue',
          data: JustAmount,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: 'Sales revenue',
      },
      xaxis: {
        categories: JustDates,
      },
      fill: {
        colors: ['#3EC8AC']
      },
      plotOptions: {
        bar: {
          borderRadius: 5
        }
      },
      labels: [""]
    };

    this.optionsItemsMenu = {
      series: [
        {
          name: 'Sales revenue',
          data: this.items_menu.map((item) => item.amount),
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: 'Sales revenue',
      },
      xaxis: {
        categories: this.items_menu.map((item) => item.name),
      },
      fill: {},
      plotOptions: {
        bar: {
          borderRadius: 5,
          horizontal: true,
          distributed: true
        }
      },
      labels: []
    }
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
        data.netSale,
        this.sales_revenue_data,
        data.tipAmount
      );

      this.cash = new CashSales(
        data.cashSale,
        data.cashAccountPayment,
        data.paidOut,
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
      this.optionsPaymentsChart = {
        data: data.paymentsDataViewModels,
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
      this.subscription.push(
        this.dataStorage.getCloseReport(startDate, endDate).subscribe(
          (next: any) => {
            console.log(next);
            this.onSetDataReport(next);
            this.cashService.resetEnableState();
            this.showReport = true;
          },
          (err) => {
            console.error(err);
            this.dialogService.openGenericInfo(InformationType.ERROR, err);
          }
        )
      );


    this.subscription.push(
      this.dataStorage.getCloseDayReportsByDate(startDate, endDate).subscribe(
        (next: any) => {
          console.log(next);

          this.sales_revenes_block?.onSetDataReport(next);
          this.showReport = true;
        },
        (err: any) => {
          console.error(err);
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

    this.financials_cards!.onGenerateReport(this.reportStartDate, this.reportEndDate, true);

    this.menuitems!.onGenerateReport(this.reportStartDate, this.reportEndDate)

    this.onGenerateReport(this.reportStartDate, this.reportEndDate, false);

  }

  onChangeDate($event: DateRange<Date>) {
    console.log($event);
    this.rangeSelectDate = $event;

    this.onReportView();
  }
}
