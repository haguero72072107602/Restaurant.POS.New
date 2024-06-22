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
import {FinancialReportModel} from "@models/financials/financialReport.model";

@Component({
  standalone: true,
  selector: 'app-block-rpt-sales-revenue',
  templateUrl: './block-rpt-sales-revenue.component.html',
  styleUrl: './block-rpt-sales-revenue.component.css',
  imports: [
    NgApexchartsModule,
    CurrencyPipe
  ]
})
export class BlockRptSalesRevenueComponent {

  events: string[] = [];
  averageSales: number | undefined;
  maxSales : number | undefined;
  minSales : number | undefined;

  optionsSalesRevenue: ChartOptions | undefined;
  JustAmount: any[] = [];
  JustDates: any[] = [];

  private sales_revenue_data: any[] = [];

  constructor(
    private cashService: CashService,
    private router: Router
  ) {
  }

  onSetDataReport(data: any, report? : FinancialReportModel) {


    //if (data.length > 0) {

      this.sales_revenue_data = data;
      this.cashService.resetEnableState();


      this.JustAmount = this.sales_revenue_data.map((item) => item.grossSale);
      this.JustDates = this.sales_revenue_data.map((item) =>
        this.formatDate(item.openingTime)
      );

      const summatory = this.JustAmount.reduce((itemPrevius, itemCurrent) => {
        return itemPrevius + itemCurrent;
      }, 0);

      this.averageSales = report?.financialReport.averageSale;
      this.maxSales = report?.financialReport.highestSale;
      this.minSales = report?.financialReport.lowestSale;

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

    //}
  }

  onClickSalesRevenue() {
    this.router.navigate(['/home/layout/reports/rptsalesrevenue']);
  }

  formatDate(date: string) {
    return date.slice(0, 10);
  }
}
