import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
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

@Component({
  standalone: true,
  selector: 'app-block-rpt-menu-items-bestseller',
  templateUrl: './block-rpt-menu-items-bestseller.component.html',
  imports: [
    NgApexchartsModule
  ],
  styleUrl: './block-rpt-menu-items-bestseller.component.css'
})
export class BlockRptMenuItemsBestsellerComponent implements OnInit, AfterViewInit {
  @Input({required: true}) reportStartDate?: string;
  @Input({required: true}) reportEndDate?: string;
  @Input() showPrint?: boolean = true;
  @Input() cashierId: string = "";
  @Input() closeDay?: boolean = true;

  @Output() evtProgress = new EventEmitter<boolean>();
  optionsSalesTypesChart: any;
  showReport: boolean = false;
  timePicker: boolean = true;
  maxDate?: Date;
  events: string[] = [];
  optionsItemsMenu: ChartOptions | any;
  public items_menu: any = [];
  private subscription: Subscription[] = new Array<Subscription>();

  constructor(
    private dialogService: DialogService,
    private cashService: CashService,
    private reportService: ReportsService,
    private operationService: OperationsService,
    private dataStorage: DataStorageService,
    private router: Router,
  ) {
    const JustAmount = this.items_menu.map((item: any) => item.quantity);
    const JustDates = this.items_menu.map((item: any) => item.productName);

    this.optionsItemsMenu = {}
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  ngOnInit(): void {
    this.showReport = true;
    this.maxDate = new Date();
  }

  onGenerateReport(startDate: string, endDate: string) {
    console.log('getFullReport');
    this.dataStorage.getBestSellers(startDate, endDate, 20).subscribe(
      (next: any) => {
        console.log("Products bestsseller ->", next);
        this.onSetDataReport(next);
        this.showReport = true;
      },
      (err) => {
        console.error(err);
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
      }
    )
  }

  onSetDataReport(data: any) {
    if (data) {
      this.items_menu = data;
      this.optionsItemsMenu = {
        series: [
          {
            name: 'Best seller products',
            data: this.items_menu.map((item: any) => item.quantity),
          },
        ],
        chart: {
          height: 550,
          type: 'bar',
        },
        title: {
          text: 'Sales revenue',
        },
        xaxis: {
          categories: this.items_menu.map((item: any) => item.productName),
        },
        fill: {},
        plotOptions: {
          bar: {
            borderRadius: 5,
            horizontal: true,
            distributed: true
          }
        },
        legend: {
          show: false,
        },
        labels: []
      }
    }
  }

  onClickSalesRevenue() {
    this.router.navigate(["/home/layout/reports/rptclockshift"]);
  }
}

