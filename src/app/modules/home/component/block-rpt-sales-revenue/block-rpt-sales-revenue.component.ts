import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InformationType} from '@core/utils/information-type.enum';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {CashService} from '@core/services/bussiness-logic/cash.service';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';

import {initFlowbite} from 'flowbite';
import {
  dateRangeISO,
  getFormatDate,
} from '@core/utils/functions/transformers';
import {ReportsService} from '@core/services/bussiness-logic/reports.service';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {FinancialsComponent} from '@modules/home/component/financials/financials.component';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {CashSales, Functions, Sales} from '@models/financials';
import {ChartOptions} from '@models/apexcharts-options.model';
import {ChartComponent, NgApexchartsModule} from 'ng-apexcharts';
import {Subscription} from 'rxjs';
import {CurrencyPipe} from "@angular/common";

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
  selector: 'app-block-rpt-sales-revenue',
  templateUrl: './block-rpt-sales-revenue.component.html',
  styleUrl: './block-rpt-sales-revenue.component.css',
  providers: [{provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}],
  imports: [
    NgApexchartsModule,
    CurrencyPipe
  ]
})
export class BlockRptSalesRevenueComponent implements OnInit {
  @Input({required: true}) reportStartDate?: string;
  @Input({required: true}) reportEndDate?: string;
  @Input() showPrint?: boolean = true;
  @Input() cashierId: string = '';
  @Input() closeDay?: boolean = true;

  @Output() evtProgress = new EventEmitter<boolean>();
  optionsSalesTypesChart: any = {};
  showReport: boolean = false;
  timePicker: boolean = true;
  maxDate?: Date;
  events: string[] = [];
  maxSales: number | string = 0;
  minSales: number | string = 0;
  averageSales: number | string = 0;
  optionsSalesRevenue: ChartOptions | undefined;
  JustAmount: any[] = [];
  JustDates: any[] = [];
  private subscription: Subscription[] = new Array<Subscription>();
  private sales_revenue_data: any[] = [];
  private data = [
    {
      name: 'Dine In',
      count: 2,
      total: 15.99,
    },
    {
      name: 'Pick Up',
      count: 1,
      total: 5.0,
    },
    {
      name: 'Delivery',
      count: 1,
      total: 5.62,
    },
    {
      name: 'To Go',
      count: 1,
      total: 10.0,
    },
  ];

  constructor(
    private cashService: CashService,
    private router: Router
  ) {
  }

  get getDateRangeFormat() {
    return "From " + this.reportStartDate + " To " + this.reportEndDate
  }

  onSetDataReport(data: any) {

    if (data.length > 0) {

      this.sales_revenue_data = data;
      this.cashService.resetEnableState();
      this.showReport = true;

      this.JustAmount = this.sales_revenue_data.map((item) => item.grossSale);
      this.JustDates = this.sales_revenue_data.map((item) =>
        this.formatDate(item.openingTime)
      );

      const summatory = this.JustAmount.reduce((itemPrevius, itemCurrent) => {
        return itemPrevius + itemCurrent;
      }, 0);

      console.log('Average:', summatory, 'Just amount', this.JustAmount);
      this.averageSales = Number(summatory / this.JustAmount.length).toFixed(0)
        ? Number(summatory / this.JustAmount.length).toFixed(0)
        : 'Load';

      console.log('Average:', this.averageSales);
      this.maxSales = Number(
        this.JustAmount.reduce((itemPrevius, itemCurrent) => {
          return itemPrevius > itemCurrent ? itemPrevius : itemCurrent;
        })
      ).toFixed(0);
      this.minSales = Number(
        this.JustAmount.reduce((itemPrevius, itemCurrent) => {
          return itemPrevius < itemCurrent ? itemPrevius : itemCurrent;
        })
      ).toFixed(0);

      this.optionsSalesRevenue = {
        series: [
          {
            name: 'Sales revenue',
            data: this.JustAmount,
          },
        ],
        chart: {
          height: 350,
          type: 'line',
        },
        title: {
          text: 'Sales revenue',
        },
        xaxis: {
          categories: this.JustDates,
        },
        fill: {
          colors: ['#3EC8AC'],
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
          },
        },
        labels: [''],
      };

      /*this.sales = new Sales(data.saleTax, data.taxSale, data.grossSale, data.refunds,
        data.taxRefunds, data.accountChargeTotal, data.accountPaymentTotal, data.netSale, undefined ,data.tipAmount);


      this.lines = data.stationDataViewModels;
      this.mediaPayments = data.paymentsDataViewModels;
      this.mediaSales = data.mediaDataViewModels;*/
    } else {
      this.showReport = false;
    }

  }

  ngOnInit(): void {

    this.maxDate = new Date();
    this.optionsSalesTypesChart = {
      data: this.data,
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
          fills: ['#203665', '#375CAB', '#4D81F1', '#88ABF6'],
          strokes: ['#203665', '#375CAB', '#4D81F1', '#88ABF6'],
        },
      ],
    };
  }

  onClickSalesRevenue() {
    //this.router.navigate(["/home/layout/reports/rptsalesrevenue"]);
    //this.router.navigate(["/home/layout/reports/rptclockday"]);
    this.router.navigate(['/home/layout/reports/rptsalesrevenue']);
  }

  formatDate(date: string) {
    return date.slice(0, 10);
  }
}
