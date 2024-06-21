import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CellClassParams, ColDef, FirstDataRenderedEvent, ValueFormatterParams} from "ag-grid-community";

import {dateFormatter, dateRangeISO, removeTFromISODate} from "@core/utils/functions/transformers";
import dayjs from "dayjs/esm";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {FinancialCloseDayModel} from "@models/financials/FinancialCloseDay.model";
import {ButtonsCloseDay} from "@modules/home/component/buttons-closeday/buttons-closeday";
import {CardDateComponent} from "@modules/home/component/card-date/card-date.component";
import {AuthService} from "@core/services/api/auth.service";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {UserList} from '@models/userList';
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {DateRange} from "@angular/material/datepicker";
import {fnFormatDate, fnSetRangeDate} from "@core/utils/functions/functions";

declare var DateRangePicker: any;

//import DateRangePicker from 'flowbite';

@Component({
  selector: 'app-rpt-clock-shift',
  templateUrl: './rpt-clock-shift.component.html',
  styleUrls: ['./rpt-clock-shift.component.css'],

})
export class RptClockShiftComponent implements OnInit {
  @ViewChild("dateRangePicker", {static: true}) dateRangePicker! : ElementRef;
  @ViewChild("selectStatus", {static: true}) selectStatus! : ElementRef;

  loading: boolean = false;

  public rowData: undefined | FinancialCloseDayModel[] = [];
  public rowDataOriginal: undefined | FinancialCloseDayModel[] = [];
  public columnDefs: undefined | ColDef[] = [];
  rowClass: string = "text-[14px] text-poppins font-normal";
  dateSelected?: Date;
  maxDate: Date = new Date();

  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true
  };
  rangeDate!: DateRange<Date>;

  orderTypes: any[] = [];
  payMethods: any[] = [];

  userList: UserList[] = [];
  isUserAdmin: boolean = false;
  filterUser: number = -99;
  protected readonly RangeDateOperation = RangeDateOperation;

  constructor(private reportService: ReportsService,
              private cashService: CashService,
              private authService: AuthService,
              private operationService: OperationsService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.onColumnDefs();

    this.rangeDate = fnSetRangeDate(RangeDateOperation.Last7Days);

    this.onRefreshData(fnFormatDate(this.rangeDate.start!), fnFormatDate(this.rangeDate.end!));

    this.isUserAdmin = (this.authService.token.rol === UserrolEnum.ADMIN) ||
      (this.authService.token.rol === UserrolEnum.SUPERVISOR);

    if (this.isUserAdmin) {
      this.authService.getUsersList()
        .subscribe((next: UserList[]) => {
          console.log("User list: ", next);
          this.userList = next;
        }, error => {
          this.dialogService.openGenericInfo("Error", error)
        })
    }

    this.operationService.resetInactivity(true);

    this.orderTypes = [
      {
        value: 1,
        label: "Dine In",
      },
      {
        value: 2,
        label: "Pick Up",
      },
      {
        value: 3,
        label: "Delivery",
      },
      {
        value: 4,
        label: "To Go",
      }
    ];
    this.payMethods = [
      {
        value: 'Cash',
        label: 'Cash',
      },
      {
        value: 'Online',
        label: 'Online',
      },
      {
        value: 'Card',
        label: "Card",
      },

    ]
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

  onChangeRangeDate($event: DateRange<Date>) {
    this.rangeDate = $event;

    this.onRefreshData(fnFormatDate(this.rangeDate.start!), fnFormatDate(this.rangeDate.end!));
  }

  onRefreshData(startDate: string, endDate: string) {

    console.log("Fecha incial ", startDate);
    console.log("Fecha final ", endDate);

    this.loading = true;

    const userId = this.authService!.token!.user_id!;

    const adminRole = [UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR];

    let report = adminRole.includes(this.authService.token!.rol) ?
      this.reportService.getCashierCloseShiftReportsAll(startDate, endDate) :
      this.reportService.getCashierCloseShiftReportsByDate(userId, startDate, endDate)

    report.subscribe((nextReport: any) => {

      console.log("list close financials", nextReport)

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
          userId: item.applicationUserId,
          isManager: false
        });
      })
      this.rowData = this.rowData!.sort(this.GFG_sortFunction);
      this.rowDataOriginal = this.rowData;
      this.onFilterData(this.selectStatus!.nativeElement.value);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.dialogService.openGenericInfo("Error", error)
    })

  }

  closeShift() {
    this.dialogService.dialog.open(CardDateComponent, {
      width: '648px', height: '360px',
      data: {title: "Close shift"},
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
      if (next) {

        const dialog =
          this.dialogService.openDialog(ProgressSpinnerComponent, "", "289px", "316px");

        this.reportService.cashierCloseShift(next.closeDay, this.authService.token!.user_id!, next.date)
          .subscribe((nextClose: any) => {
            //this.cashService.openGenericInfo("Information", "Successful closing process...");
            dialog.close();
            this.onRefreshData(fnFormatDate(this.rangeDate.start!), fnFormatDate(this.rangeDate.end!));
          }, error => {
            dialog.close();
            this.dialogService.openGenericInfo("Error", error)
          })
      }
    });
  }

  onChangeSelectRole(event: any) {
    this.onFilterData(event.target.value);
  }

  onFilterData( filter : string )
  {
    this.rowData = filter === "-99" ? this.rowDataOriginal :
      this.rowDataOriginal?.filter((item) => item.userName?.includes(filter));
  }

  /*
  onChangeSelectTotalAmount(event: any) {
    console.log("Filter total amount:", event.target.value);
    const newData = this.rowDataOriginal?.filter((item) => item.saleTax > (event.target.value));
    this.rowData = newData;
  }
  */

  cellStyle(params: CellClassParams<any, any>) {
    return {
      /*color: (params.data.unitInStock < 0) ? '#EA5252' : 'black',*/
      display: "flex",
      alignItems: "center",
      justifyContent: "right"
    };
  }

  private onColumnDefs() {

    this.columnDefs = [
      {
        headerName: 'T. AMMOUNT',
        field: 'saleTax',
        minWidth: 120,
        valueFormatter: this.AmountFormat,
        cellStyle: this.cellStyle,
      },
      {headerName: 'CASH', field: 'cashDue', valueFormatter: this.AmountFormat, cellStyle: this.cellStyle},
      {headerName: 'CARD', field: 'netSale', valueFormatter: this.AmountFormat, cellStyle: this.cellStyle},
      {headerName: 'TIPS', field: 'tipAmount', valueFormatter: this.AmountFormat, cellStyle: this.cellStyle},
      {headerName: 'USER', field: 'userName', cellStyle: this.cellStyle},
      {headerName: 'DATE', field: 'date', cellStyle: this.cellStyle},
      {minWidth: 225, maxWidth: 250, cellRenderer: ButtonsCloseDay}
    ];
  }
}
