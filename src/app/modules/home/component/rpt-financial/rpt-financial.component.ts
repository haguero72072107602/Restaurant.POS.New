import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {InformationType} from "@core/utils/information-type.enum";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {initFlowbite} from "flowbite";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import {FinancialsComponent} from "@modules/home/component/financials/financials.component";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";
import {AuthService} from "@core/services/api/auth.service";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {DateRangeComponent} from "@modules/home/component/daterange/daterange.component";
import dayjs from "dayjs/esm";
import {ButtonDateRangeComponent} from "@modules/home/component/button-date-range/button-date-range.component";
import {DateRange} from "@angular/material/datepicker";
import {fnCreateDateRange, fnFormatDate} from "@core/utils/functions/functions";


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  standalone: true,
  selector: 'app-rpt-financial',
  templateUrl: './rpt-financial.component.html',
  styleUrls: ['./rpt-financial.component.css'],
  imports: [
    DateRangeComponent,
    FinancialsComponent,
    ButtonDateRangeComponent
  ],
  providers: [{provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}]
})
export class RptFinancialComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("financials", {static: true}) financials?: FinancialsComponent;
  public cashierId!: string;
  public isManager: boolean = true;
  public selected!: DateRange<Date>;
  maxDate?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  showDateRangeReport: boolean = true;
  protected readonly RangeDateOperation = RangeDateOperation;
  private subscription: Subscription[] = new Array<Subscription>();

  constructor(private dialogService: DialogService,
              private cashService: CashService,
              private reportService: ReportsService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private operationService: OperationsService,
              public varGlobalService: VariableGlobalService
  ) {
  }

  ngOnInit(): void {

    this.maxDate = dayjs();

    this.cashierId = this.authService.token!.user_id;
    this.isManager = this.authService.token!.rol in [UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR];

    const params = this.route.queryParams.subscribe((params: Params) => {
      console.log("params reports ->", params);
      this.cashierId = params["userId"];
      this.isManager = params["isManager"];

      this.selected = fnCreateDateRange(params["openingTime"], params["closeTime"]);

      this.showDateRangeReport = false;

      this.onReportView(params["openingTime"], params["closeTime"], this.isManager, this.cashierId);
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  onReportView(fromDate: string, endDate: string, isManager: boolean, IduserName?: string) {
    this.financials?.onGenerateReport(fromDate, endDate, isManager, IduserName);
  }

  onReportPrint() {
    this.onGenerateReport(fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!));
  }

  onGenerateReport(startDate: string, endDate: string) {
    this.operationService.resetInactivity(true);
    const dialogLoading = this.dialogService.openGenericInfo(InformationType.INFO, "Getting close reports...");

    this.subscription.push(this.reportService.getRangeClosePrint(startDate, endDate).subscribe(
      (next: any) => {
        console.log(next);
        dialogLoading?.close();
        this.cashService.resetEnableState();
      },
      err => {
        console.error(err);
        dialogLoading?.close();
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.map(sub => sub.unsubscribe());
  }

  onDateUpdate($event?: DateRange<Date>) {
    this.selected = $event!;

    this.onReportView(
      fnFormatDate(this.selected.start!), fnFormatDate(this.selected.end!),
      this.isManager, this.cashierId
    );
  }

  getDateStart() {
    return this.selected.start!
    //return dateRangeISO(removeTFromISODate(this.selected.start.format('YYYY-MM-DD')), true);
  }

  getDateEnd() {
    return this.selected.end!;
    //return dateRangeISO(removeTFromISODate(this.selected.end.format('YYYY-MM-DD')), false);
  }
}
