import {FinancialOpEnum, PaymentOpEnum, TotalsOpEnum} from '../operations';
import {AdminOpEnum} from '../operations/admin-op.enum';
import {EFieldType} from '../field-type.enum';
import {Report} from "@models/report.model";
import {ReportSummary} from "@models/report-detail.model";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import dayjs from "dayjs/esm";
import {DateRange} from "@angular/material/datepicker";
import moment from "moment";

declare var DateRangePicker: any;

export function leaveFocusOnButton(ev: any) {
  (ev.target.tagName !== 'BUTTON') ? ev.target.parentElement.blur() : ev.target.blur();
}

export function transformCBReport(report: any): Report {
  const arrTmp = new Array<ReportSummary>();
  const arrTmp1 = ['cash', 'credit', 'debit', 'ebt'];
  arrTmp1.map(type => arrTmp.push(transformReportSummary(report, type)));
  return new Report(report.message, report.total, report.resultCode, report.resultTxt, arrTmp,
    report.reportDetailLookups);
}

export function transformReportSummary(report: any, type: string): ReportSummary {
  return new ReportSummary(
    report[type + 'Amount'],
    report[type + 'Count'],
    type.toUpperCase()
  );
}

export const operationsWithClear = [FinancialOpEnum.REVIEW, FinancialOpEnum.REPRINT, TotalsOpEnum.FS_SUBTOTAL,
  TotalsOpEnum.SUBTOTAL, PaymentOpEnum.CASH, PaymentOpEnum.EBT_CARD, AdminOpEnum.CANCEL_CHECK, AdminOpEnum.REMOVE_HOLD,
  AdminOpEnum.CHANGE_PRICES];

export function dataValidation(type: EFieldType): any {
  switch (type) {
    case EFieldType.ADDRESS:
      return {max: 120};
    case EFieldType.NAME:
      return {max: 60};
    case EFieldType.PHONE:
      return {max: 12, mask: '(000) 000-0000'};
    case EFieldType.DESC:
      return {min: -1, max: 200};
    case EFieldType.CARD_NUMBER:
      return {max: 16, mask: '0000 0000 0000 0000'};
    case EFieldType.EXPDATE:
      return {max: 4, mask: '00/00'};
    case EFieldType.CVV:
      return {max: 4};
    case EFieldType.ZIPCODE:
      return {max: 5};
    case EFieldType.PASSWORD:
      return {min: 4, max: 10, type: 'password'};
  }
}

export function reloadBrowser() {
  location.reload();
}

export function toFloat(value: number): number {
  return value
}

export function floatToDecimal(x: any, decimalDigits = 2): number {
  x = Number(x);
  decimalDigits = Number(decimalDigits);

  x = x * (10 ** decimalDigits);
  x = x - x % 1;
  x = x / (10 ** decimalDigits);

  return x;
}

export function fnSetRangeDate(typeRange: RangeDateOperation): DateRange<Date> {
  let start = new Date();
  let end = new Date();

  switch (typeRange) {
    case RangeDateOperation.Day:
      break;
    case RangeDateOperation.Yestarday:
      start = moment().subtract(1, 'day').toDate();
      end = moment().subtract(1, 'day').toDate();
      break;
    case RangeDateOperation.LastDay:
      start = moment().subtract(1, 'day').toDate();
      break;
    case RangeDateOperation.Last7Days:
      start = moment().subtract(7, 'day').toDate();
      break;
    case RangeDateOperation.ThisMonth:
      start = moment().startOf('month').toDate();
      break;
    case RangeDateOperation.LastMonth:
      start = moment().subtract(1, 'month').toDate();
      break;
    case RangeDateOperation.Last3Month:
      start = moment().subtract(3, 'month').toDate();
      break;
    case RangeDateOperation.Year:
      start = moment().startOf('year').toDate();
      break;
  }

  return new DateRange<Date>(
    new Date(Date.parse(moment(start).format("MM-DD-yyyy") + " 00:00")),
    new Date(Date.parse(moment(end).format("MM-DD-yyyy") + " 23:59")),
  );
}

export function fnCreateDateRange(param1: any, param2: any): DateRange<Date> {
  return new DateRange(new Date(Date.parse(param1)), new Date(Date.parse(param1)));
}

export function fnFormatDate(param: Date, isTime: boolean = true): string {
  return isTime ? moment(param).format("MM-DD-yyyy HH:mm") : moment(param).format("MM-DD-yyyy");
}

export function fnPhaserDateFormat(param: string): string {
  return fnFormatDate(new Date(Date.parse(param)), false);
}
