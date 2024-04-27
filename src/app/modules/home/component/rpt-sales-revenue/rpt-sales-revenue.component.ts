import {Component, ViewChild,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {DaterangepickerDirective} from 'ngx-daterangepicker-material';
import {initFlowbite} from 'flowbite';
import {dateRangeISO, removeTFromISODate,} from '@core/utils/functions/transformers';
import {SearchService} from '@core/services/bussiness-logic/search.service';
import dayjs from 'dayjs/esm';
import {PageSidebarEnum} from '@core/utils/page-sidebar.enum';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {BlockRptSalesRevenueComponent} from '../block-rpt-sales-revenue/block-rpt-sales-revenue.component';
import {FinancialCloseDayModel} from '@models/financials/FinancialCloseDay.model';
import {ColDef, FirstDataRenderedEvent, ValueFormatterParams} from 'ag-grid-community';
import {Subscription} from 'rxjs';
import {InformationType} from '@core/utils/information-type.enum';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {DateRange} from "@angular/material/datepicker";
import {fnFormatDate, fnSetRangeDate} from "@core/utils/functions/functions";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

declare var DateRangePicker: any;

@Component({
  selector: 'app-rpt-sales-revenue',
  templateUrl: './rpt-sales-revenue.component.html',
  styleUrl: './rpt-sales-revenue.component.css',
})
export class RptSalesRevenueComponent {
  @ViewChild(DaterangepickerDirective, {static: false})
  pickerDirective?: DaterangepickerDirective;
  @ViewChild('salesrevenues', {static: true}) sales_revenes_block?: BlockRptSalesRevenueComponent;

  loading: boolean = true;
  showReport: boolean = false;

  public selected!: DateRange<Date>;

  maxDate?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;


  $targetEl?: HTMLElement;
  $triggerEl?: HTMLElement;
  public rowData: undefined | FinancialCloseDayModel[] = [];
  public columnDefs: undefined | ColDef[] = [];
  rowClass: string = "text-[14px] text-poppins font-normal";
  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true
  };
  protected selectMovement: number = 0;
  protected readonly RangeDateOperation = RangeDateOperation;
  private subscription: Subscription[] = new Array<Subscription>();

  constructor(
    private router: Router,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private dataStorage: DataStorageService,
    private dialogService: DialogService,
    private operationService: OperationsService
  ) {
    initFlowbite();
    this.searchService.setActivePage(PageSidebarEnum.ORDERS);
  }

  get reportEndDate() {
    return fnFormatDate(this.selected.end!)
  }

  get reportStartDate() {
    return fnFormatDate(this.selected.start!)
  }

  onBackOrder() {
    this.router.navigateByUrl('/home/layout/reports');
  }

  ngOnInit(): void {

    this.onColumnDefs();
    this.maxDate = dayjs();

    this.selected = fnSetRangeDate(RangeDateOperation.ThisMonth);
  }

  async onGenerateReport(startDate: string, endDate: string) {

    this.subscription.push(
      this.dataStorage.getCloseDayReportsByDate(startDate, endDate).subscribe(
        (next: any) => {
          console.log(next);
          this.sales_revenes_block?.onSetDataReport(next);
          if (next.length > 0) {
            this.showReport = true;
            this.rowData = next;
          } else
            this.showReport = false;

        },
        (err: any) => {
          console.error(err);
          this.dialogService.openGenericInfo(InformationType.ERROR, err);
        }
      ));
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  formatDate(params: ValueFormatterParams) {
    return params.value.slice(0, 10);
  }

  GFG_sortFunction(a: any, b: any) {
    let dateA = new Date(a.closeTime)/*.getTime()*/;
    let dateB = new Date(b.closeTime)/*.getTime()*/;
    return dateA < dateB ? 1 : -1;
  };

  onDateUpdate($event: DateRange<Date>) {
    this.selected = $event;

    //this.selected.start.toDate().toISOString()
    this.onGenerateReport(fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!));
  }

  private onColumnDefs() {

    this.columnDefs = [
      {headerName: 'T. AMOUNT', field: 'saleTax', valueFormatter: this.AmountFormat, type: 'rightAligned'},
      {headerName: 'CASH', field: 'cashDue', valueFormatter: this.AmountFormat, type: 'rightAligned'},
      {headerName: 'CARD', field: 'netSale', valueFormatter: this.AmountFormat, type: 'rightAligned'},
      {headerName: 'TIPS', field: 'tipAmount', valueFormatter: this.AmountFormat, type: 'rightAligned'},
      {headerName: 'DATE', field: 'openingTime', type: 'rightAligned', valueFormatter: this.formatDate},
    ];
  }
}
