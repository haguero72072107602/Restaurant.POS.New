import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {DaterangepickerDirective} from 'ngx-daterangepicker-material';
import type {DropdownInterface, DropdownOptions} from 'flowbite';
import {Dropdown, initFlowbite} from 'flowbite';
import {dateRangeISO, getFormatOnlyDate, removeTFromISODate,} from '@core/utils/functions/transformers';
import {SearchService} from '@core/services/bussiness-logic/search.service';
import dayjs from 'dayjs/esm';
import {PageSidebarEnum} from '@core/utils/page-sidebar.enum';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {
  BlockRptMenuItemsBestsellerComponent
} from '../block-rpt-menu-items-bestseller/block-rpt-menu-items-bestseller.component';
import {ColDef, FirstDataRenderedEvent, ValueFormatterParams} from 'ag-grid-community';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {InformationType} from '@core/utils/information-type.enum';
import {ReportsService} from '@core/services/bussiness-logic/reports.service';
import {Subscription} from 'rxjs';
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {DateRange} from "@angular/material/datepicker";
import {fnFormatDate, fnSetRangeDate} from "@core/utils/functions/functions";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

declare var DateRangePicker: any;


@Component({
  selector: 'app-rpt-menu-items-sales',
  templateUrl: './rpt-menu-items-sales.component.html',
  styleUrl: './rpt-menu-items-sales.component.css'
})
export class RptMenuItemsSalesComponent implements OnInit, AfterViewInit {

  @Output() evtProgress = new EventEmitter<boolean>();
  @ViewChild(DaterangepickerDirective, {static: false}) pickerDirective?: DaterangepickerDirective;
  @ViewChild('menuitems', {static: true}) menuitems?: BlockRptMenuItemsBestsellerComponent;
  loading: boolean = true;

  public selected!: DateRange<Date>;
  maxDate?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  $targetEl?: HTMLElement;
  $triggerEl?: HTMLElement;
  public rowData: undefined | any[] = [];
  public columnDefs: undefined | ColDef[] = [];
  rowClass: string = "text-[14px] text-poppins font-normal";
  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true
  };
  filterName: string = '';
  protected selectMovement: number = 0;
  protected readonly RangeDateOperation = RangeDateOperation;
  private subscription: Subscription[] = new Array<Subscription>();

  constructor(
    private router: Router,
    private searchService: SearchService,
    private dialogService: DialogService,
    private reportService: ReportsService,
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

  ngAfterViewInit(): void {
    //this.pickerDirective!.minDate = dayjs();
    this.$targetEl = document.getElementById('dropdownToggle')!;

    // set the element that trigger the dropdown menu on click
    this.$triggerEl = document.getElementById('dropdownToggleButton')!;

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,

      onHide: () => {
        console.log('dropdown has been hidden');
      },
      onShow: () => {
        console.log('dropdown has been shown');
      },
      onToggle: () => {
        console.log('dropdown has been toggled');
      },
    };

    const dropdown: DropdownInterface = new Dropdown(
      this.$targetEl,
      this.$triggerEl,
      options
    );
    this.onGetData();
    this.onColumnDefs();
  }

  ngOnInit(): void {
    this.selected = fnSetRangeDate(RangeDateOperation.ThisMonth);
    this.maxDate = dayjs();
  }

  onBackOrder() {
    this.router.navigateByUrl('/home/layout/reports');
  }

  selectedAll($event: Event) {
    console.log('input', $event);
    console.log(this.selectMovement);

    this.onDateUpdate();
  }

  onDateUpdate($event?: DateRange<Date>) {

    this.selected = $event!;
    this.menuitems!.onGenerateReport(fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!));
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onChangeFilterProduct($event: any) {

    console.log("Filter by", this.filterName);
    const filtrered_data = this.rowData?.filter((item) =>
      item.productName.includes(this.filterName) || item.departmentName.includes(this.filterName)
      || item.averagePrice.includes(this.filterName)
    );
    this.rowData = filtrered_data;
  }

  private onGetData() {

    //this.subscription.push(
    //  this.reportService.getProductsReportByDate(getFormatOnlyDateMMDDYY(this.selected.start.toDate()),
    //  getFormatOnlyDateMMDDYY(this.selected.end.toDate())).subscribe(

    this.subscription.push(
      this.reportService
        .getProductsReportByDate(fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!))
        .subscribe((next: any) => {
            this.rowData = [];

            console.log("All products reports: ", next);
            this.rowData = this.onPrepareData(next);
            console.log("All products reports: ", this.rowData);
            this.evtProgress.emit(true);

            this.loading = false;
          },
          err => {
            console.error(err);
            this.dialogService.openGenericInfo(InformationType.ERROR, err);
          }
        ));
  }

  private onPrepareData(data: any) {
    const dataPrepared = data.map((item: any) => {
      const exist = this.alreadyExistThatProduct(item.productName);
      console.log("Exist", exist);
      if (exist && exist > 0) {
        if (this.rowData) {
          const newData = {
            productName: this.rowData[exist].productName,
            quantity: this.rowData[exist].quantity + item.quantity,
            departmentName: this.rowData[exist].departmentName,
            averagePrice: this.rowData[exist].averagePrice,
            netRevenue: this.rowData[exist].netRevenue + item.netRevenue,
            isStar: this.rowData[exist].isStar,
            grossRevenue: this.rowData[exist].grossRevenue + item.grossRevenue,
            itemDiscCount: this.rowData[exist].itemDiscCount + item.itemDiscCount,
            itemDiscAmount: this.rowData[exist].itemDiscAmount + item.itemDiscAmount,
          };
          this.rowData[exist] = newData
        }
      } else {
        if (this.rowData) {
          const newData = {
            productName: item.productName,
            quantity: item.quantity,
            departmentName: item.departmentName,
            averagePrice: item.averagePrice,
            netRevenue: item.netRevenue,
            isStar: item.isStar,
            grossRevenue: item.grossRevenue,
            itemDiscCount: item.itemDiscCount,
            itemDiscAmount: item.itemDiscAmount,
          };
          this.rowData.push(newData);
        }
      }
    });
    console.log("RowData", this.rowData);
    return this.rowData;
  }

  private alreadyExistThatProduct(product: string) {
    return this.rowData?.findIndex((item: any) => item.productName == product);
  }

  private onColumnDefs() {

    this.columnDefs = [
      {headerName: 'PRODUCT', field: 'productName', type: 'centerAligned'},
      {headerName: 'DEPARMENT', field: 'departmentName', type: 'centerAligned'},
      {headerName: 'QUANTITY SALED', field: 'quantity', type: 'centerAligned'},
      {headerName: 'NET REVENUE', field: 'netRevenue', type: 'centerAligned'},
      {headerName: 'GROSS REVENUE', field: 'grossRevenue', type: 'centerAligned'},
      {headerName: 'PRICE', field: 'averagePrice', valueFormatter: this.AmountFormat, type: 'centerAligned'},

      //{headerName: 'USER', field: 'userName', type: 'rightAligned' },

    ];
  }
}

