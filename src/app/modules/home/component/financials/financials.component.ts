import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {
  CashSales,
  Functions,
  ICashSales,
  IFunctions,
  ISales,
  Sales,
} from '@models/financials';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {CashService} from '@core/services/bussiness-logic/cash.service';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';
import {removeTFromISODate} from '@core/utils/functions/transformers';
import {InformationType} from '@core/utils/information-type.enum';
import {ReportsService} from '@core/services/bussiness-logic/reports.service';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {CurrencyPipe, DatePipe, NgClass} from "@angular/common";
import {AgChartsAngularModule} from "ag-charts-angular";
import {IInventorySubmajor} from "@models/inventory-submajor";
import {SubmayorProductComponent} from "@modules/home/component/financials/submayor-product/submayor-product.component";
import {fnFormatDate} from "@core/utils/functions/functions";


@Component({
  standalone: true,
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css'],
  imports: [
    AgChartsAngularModule,
    CurrencyPipe,
    NgClass,
    SubmayorProductComponent
  ]
})
export class FinancialsComponent implements OnInit, OnDestroy {
  @Input({required: true}) reportStartDate?: Date;
  @Input({required: true}) reportEndDate?: Date;
  @Input() showPrint?: boolean = true;
  @Input() cashierId: string = '';
  @Input() closeDay?: boolean = true;
  @Output() evtProgress = new EventEmitter<boolean>();
  public sales?: ISales;
  public cash?: ICashSales;
  public functions?: IFunctions | any;
  lines?: any[];
  mediaPayments?: any[];
  mediaSales?: any[];
  showReport: boolean = false;
  cardsSales: any[] = [];
  selectDate: string = '';
  optionsPaymentsChart: any;
  optionsCardsChart: any;
  totals: any = {};
  widthFunctions: any = {};
  inventorySubmajor: IInventorySubmajor[] = []


  private subscription: Subscription[] = new Array<Subscription>();

  constructor(
    private route: ActivatedRoute,
    private dataStorage: DataStorageService,
    private cashService: CashService,
    private operationService: OperationsService,
    private reportService: ReportsService,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
  }

  onGenerateReport(startDate: string, endDate: string, isManager: boolean, idUserName?: string) {

    this.selectDate =
      'From ' + startDate.slice(0, 10) + ' to ' + endDate.slice(0, 10);

    this.evtProgress.emit(true);

    const serviceExecute = (String(isManager) == "true")
      ? this.reportService.getCloseDay(startDate, endDate)
      : this.reportService.cashierCloseShiftPrint(
        false,
        false,
        idUserName ? idUserName : this.cashierId,
        startDate,
        endDate
      );

    this.subscription.push(
      serviceExecute.subscribe(
        (next: any) => {
          console.log(next);

          this.onSetDataReport(next);
          this.cashService.resetEnableState();
          this.showReport = true;
          this.evtProgress.emit(false);
        },
        (err) => {
          console.error(err);
          this.evtProgress.emit(false);
          this.dialogService.openGenericInfo(InformationType.ERROR, err);
        }
      )
    );
  }

  onSetDataReport(data: any) {

    if (data) {
      this.sales = new Sales(
        data.financialReport.saleTax,
        data.financialReport.taxSale,
        data.financialReport.grossSale,
        data.financialReport.refunds,
        data.financialReport.taxRefunds,
        data.financialReport.accountChargeTotal,
        data.financialReport.accountPaymentTotal,
        data.financialReport.netSale,
        undefined,
        data.financialReport.tipAmount,
        data.financialReport.merchantFee
      );

      this.cash = new CashSales(
        data.financialReport.cashSale,
        data.financialReport.cashAccountPayment,
        data.financialReport.paidOut,
        data.financialReport.paidIn,
        data.financialReport.cashDue,
        data.financialReport.ticketsCount,
        data.financialReport.avgTickets
      );

      this.functions = new Functions(
        data.financialReport.refunds,
        data.financialReport.openChecks,
        data.financialReport.voidTickets,
        data.financialReport.paidOut,
        data.financialReport.paidIn,
        data.financialReport.discounts
      );

      this.totals.functions =
        this.functions?.refund +
        this.functions?.voids +
        this.functions?.openCheck +
        this.functions?.paidIn +
        Math.abs(this.functions?.paidOut);

      Object.keys(this.functions).map((item: string) => {
        if (this.functions) {
          /*
          const porciento = Math.round( this.totals.functions != 0
                                      ? (this.functions[item] * 100) / this.totals.functions
                                      : 0);

          this.widthFunctions[item] = (this.functions[item] > 0 ? `w-[${porciento}%]` : 'w-0');
          */

          const widthActual = (((this.functions[item] / this.totals.functions) * 5) < 1)
            ? (((this.functions[item] / this.totals.functions) === 0 ? 0 : 1))
            : ((this.functions[item] / this.totals.functions) * 5);

          this.widthFunctions[item] = (Math.abs(widthActual) > 0 ? `w-${Math.round(Math.abs(widthActual))}/5` : 'w-0');
        }
      });

      this.lines = data.stationDataViewModels;
      this.mediaPayments = data.paymentsDataViewModels;
      this.mediaSales = data.mediaDataViewModels;
      this.inventorySubmajor = data.inventorySubmajorReport;

      this.cardsSales = [
        {
          title: 'Total Sales',
          amount: this.sales.saleTax,
        },
        {
          title: 'Gross Sales',
          amount: this.sales.grossSale,
        },
        {
          title: 'Sales Tax',
          amount: this.sales.saleWithTax,
        },
      ];


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
              fontSize: '14px',
            },

            fills: ['#9B8AE6', '#4350E3', '#CBCED4'],
            strokes: ['#9B8AE6', '#4350E3', '#CBCED4'],
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
              fontSize: '14px',
            },
            fills: [
              '#9B8AE6',
              '#4350E3',
              '#CBCED4',
              '#DDEAF3',
              '#32C5FF',
              '#597393',
            ],
            strokes: [
              '#9B8AE6',
              '#4350E3',
              '#CBCED4',
              '#DDEAF3',
              '#32C5FF',
              '#597393',
            ],
          },
        ],
      };


    }
  }

  printFinancialReport() {
    const dialogPrinting = this.dialogService.openGenericInfo(
      InformationType.INFO,
      'Printing Range Close Report...'
    );

    this.subscription.push(
      this.dataStorage
        .rangeClosePrint(fnFormatDate(this.reportStartDate!), fnFormatDate(this.reportEndDate!))
        .subscribe(
          (next) => {
            console.log('printRangeCloseReport', next);
            dialogPrinting!.close();
          },
          (err) => {
            dialogPrinting!.close();
            this.dialogService.openGenericInfo(InformationType.ERROR, err);
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.map((sub) => sub.unsubscribe());
  }
}
