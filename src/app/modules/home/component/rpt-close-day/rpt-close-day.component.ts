import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ColDef, FirstDataRenderedEvent, ValueFormatterParams} from "ag-grid-community";

import dayjs from "dayjs/esm";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {FinancialCloseDayModel} from "@models/financials/FinancialCloseDay.model";
import {ButtonsCloseDay} from "@modules/home/component/buttons-closeday/buttons-closeday";
import {CardDateComponent} from "@modules/home/component/card-date/card-date.component";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {FinancialsComponent} from '../financials/financials.component';
import {Subscription} from "rxjs";
import {ICashSales, IFunctions, ISales} from "@models/financials";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {DateRange} from "@angular/material/datepicker";
import {fnFormatDate, fnSetRangeDate} from "@core/utils/functions/functions";

@Component({
  selector: 'app-rpt-close-day',
  templateUrl: './rpt-close-day.component.html',
  styleUrls: ['./rpt-close-day.component.css'],

})
export class RptCloseDayComponent implements OnInit {
  @ViewChild("dateRangePicker", {static: true}) dateRangePicker!: ElementRef;
  @ViewChild("financials") financials?: FinancialsComponent;
  @Input() fromDate?: string;
  @Input() toDate?: string;
  public sales?: ISales;
  public cash?: ICashSales;
  public functions?: IFunctions;
  public reportStartDate!: string;
  public reportEndDate!: string;
  public selected!: DateRange<Date>;
  maxDate?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  lines?: any[];
  mediaPayments?: any[];
  mediaSales?: any[];
  showReport: boolean = false;
  loading: boolean = false;
  public rowData: undefined | FinancialCloseDayModel[] = [];
  public columnDefs: undefined | ColDef[] = [];
  rowClass: string = "text-[14px] text-poppins font-normal";
  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true
  };
  protected readonly RangeDateOperation = RangeDateOperation;
  private subscription: Subscription[] = new Array<Subscription>();

  constructor(private reportService: ReportsService,
              private cashService: CashService,
              private dialogService: DialogService,
              private operationService: OperationsService) {

  }

  ngOnInit(): void {
    this.onColumnDefs();

    this.selected = fnSetRangeDate(RangeDateOperation.ThisMonth);

    this.maxDate = dayjs();

    this.onRefreshData(fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!));

    this.operationService.resetInactivity(true);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  formatDate(date: string) {
    return date.slice(0, 10);
  }

  GFG_sortFunction(a: any, b: any) {
    let dateA = new Date(a.closeTime)/*.getTime()*/;
    let dateB = new Date(b.closeTime)/*.getTime()*/;
    return dateA < dateB ? 1 : -1;
  };

  onRefreshData(startDate: string, endDate: string) {


    console.log("Fecha incial ", startDate);
    console.log("Fecha final ", endDate);
    this.loading = true;
    this.reportService.getCloseDayReportsByDate(startDate, endDate)
      .subscribe((nextReport: any) => {

        this.rowData = [];

        nextReport.forEach((item: any) => {
          this.rowData?.push({
            date: this.formatDate(item.closeTime),
            closeTime: item.closeTime,
            openingTime: item.openingTime,
            cashDue: item.cashDue,
            netSale: item.saleTax - item.cashDue,
            taxSale: item.taxSale,
            readingChange: item.readingChange,
            tipAmount: item.tipAmount,
            saleTax: item.saleTax,
            userName: item.userName,
            userId: item.userId,
            isManager: true
          });

          this.rowData = this.rowData!.sort(this.GFG_sortFunction)

          this.loading = false;
        })
        console.log("report", nextReport)
        console.log("data", this.rowData);
      }, error => {
        this.loading = false;
        this.dialogService.openGenericInfo("Error", error)
      })

  }

  closeDay() {
    this.dialogService.dialog.open(CardDateComponent, {
      width: '648px', height: '360px',
      data: {title: "Close day"},
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
      if (next) {

        const dialog =
          this.dialogService.openDialog(ProgressSpinnerComponent, "", "289px", "316px");

        this.reportService.getDayClose(next.closeDay, next.day).subscribe((nextClose: any) => {
          dialog.close();
          this.onRefreshData(fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!));
        }, error => {
          dialog.close();
          this.dialogService.openGenericInfo("Error", error)
        })
      }
    });
  }

  onDateUpdate($event?: DateRange<Date>) {
    this.selected = $event!;

    this.onRefreshData(fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!));
  }

  private onColumnDefs() {

    this.columnDefs = [
      {
        headerName: 'T. AMMOUNT',
        minWidth: 120,
        field: 'saleTax',
        valueFormatter: this.AmountFormat,
        type: 'rightAligned'
      },
      {headerName: 'CASH', field: 'cashDue', valueFormatter: this.AmountFormat, type: 'rightAligned'},
      {headerName: 'CARD', field: 'netSale', valueFormatter: this.AmountFormat, type: 'rightAligned'},
      {headerName: 'TIPS', field: 'tipAmount', valueFormatter: this.AmountFormat, type: 'rightAligned'},
      {headerName: 'DATE', field: 'date', type: 'rightAligned'},
      //{headerName: 'USER', field: 'userName',type: 'rightAligned' },
      //{minWidth: 225, maxWidth: 250, cellRenderer: ButtonsCloseDay}
      {minWidth: 225, maxWidth: 250, cellRenderer: ButtonsCloseDay}
    ];
  }
}
