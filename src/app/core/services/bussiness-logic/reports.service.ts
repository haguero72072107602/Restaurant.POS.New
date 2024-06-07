import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {User} from "@models/user.model";
import {PaidOut} from "@models/paid-out.model";
import {IInvoicesByStates} from "@models/invoices-by-user.model";
import {Payment} from "@models/payment.model";
import {CloseBatch} from "@core/utils/close.batch.enum";
import {Report} from "@models/report.model";
import {IPositionModel} from "@models/employeed.model";
import {baseURL} from "@core/utils/url.path.enum";
import {AdminOperationService} from "@core/services/api/admin.operation.service";
import {FinancialDaily} from "@models/financials";
import {AuthService} from "@core/services/api/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private url = baseURL;

  constructor(
    private adminOpeService: AdminOperationService,
    private authService: AuthService
  ) {
  }

  getApplicationUsers(): Observable<User[]> {
    return this.adminOpeService.getApplicationUsers(this.url)
  }

  addPaidOut(paidOut: PaidOut): Observable<any> {
    console.log('paid out:', paidOut);
    return this.adminOpeService.addPaidOut(this.url, paidOut);
  }

  getInvoiceByUserAndDate(id: string, date: any, status?: string, paymentMethod?: number): Observable<IInvoicesByStates> {
    return this.adminOpeService.getInvoiceByUserAndDate(this.url, id, date, status, paymentMethod);
  }

  getPaymentByType(): Observable<Payment[]> {
    return this.adminOpeService.getPaymentByType(this.url);
  }

  printInvoiceByUser(id: string, date?: any, status?: string): Observable<any> {
    return this.adminOpeService.printInvoiceByUser(this.url, id, date, status);
  }

  printPaymentByType(): Observable<any> {
    return this.adminOpeService.printPaymentByType(this.url);
  }

  closeBatch(closeBatch: CloseBatch): Observable<any> {
    return this.adminOpeService.closeBatch(this.url, closeBatch);
  }

  sendAck(msg: string): Observable<any> {
    return this.adminOpeService.sendAck(this.url, msg);
  }

  getCloseBatchReport(closeBatch: CloseBatch): Observable<Report> {
    return this.adminOpeService.getCloseBatchReport(this.url, closeBatch);
  }

  getWeeklyClosePrint(close: any, from: any, to: any): Observable<Report> {
    return this.adminOpeService.getWeeklyClosePrint(this.url, close, from, to);
  }

  getRangeClosePrint(from: string, to: string): Observable<Report> {
    return this.adminOpeService.getRangeClosePrint(this.url, from, to);
  }

  getCloseReportsByDate(from: string, to?: string) {
    return this.adminOpeService.getCloseReportsByDate(this.url, from, to);
  }

  getCloseReport(from: any, to: any) {
    return this.adminOpeService.getCloseReport(this.url, from, to);
  }

  getCloseReportDaily(from: any, to: any) {
    return this.adminOpeService.getCloseReportDaily(this.url, from, to);
  }

  getDayClose(close: boolean, date?: string): Observable<Report> {
    return this.adminOpeService.getDayClose(this.url, close, date);
  }

  cashierCloseShift(close: boolean, emp: string, date?: string): Observable<Report> {
    return this.adminOpeService.cashierCloseShift(this.url, close, emp, date);
  }

  getCashierCloseShiftReportsByDate(emp: string, fromDate?: string, toDate?: string): Observable<Report> {
    return this.adminOpeService.getCashierCloseShiftReportsByDate(this.url, emp, fromDate, toDate);
  }

  getCashierCloseShiftReportsAll(fromDate?: string, toDate?: string): Observable<Report> {
    return this.adminOpeService.getCashierCloseShiftReportsAll(this.url, fromDate, toDate);
  }

  getCloseDay(fromDate?: string, toDate?: string, print : boolean = false): Observable<Report> {
    return this.adminOpeService.getCloseDay(this.url, fromDate!, toDate!, print)
  }

  cashierCloseShiftPrint(close: boolean, print: boolean, idCashier: string, fromDate?: string, toDate?: string): Observable<Report> {
    return this.adminOpeService.cashierCloseShiftPrint(this.url, close, print, idCashier, fromDate, toDate)
  }

  getReportsRangeDateByUser(fromDate: string, toDate: string, userId: string): Observable<Report> {
    return this.adminOpeService.getReportsRangeDateByUser(this.url, fromDate, toDate, userId);
  }

  notSale(): Observable<any> {
    return this.adminOpeService.notSale(this.url);
  }

  getUsersPosition(): Observable<IPositionModel[]> {
    return this.adminOpeService.getUsersPosition(this.url);
  }

  getFinancialDaily(from: any, to: any): Observable<FinancialDaily[]> {
    return this.adminOpeService.getFinancialDaily(this.url, from, to);
  }

  getCloseDayReportsByDate(from: any, to: any): Observable<any> {
    return this.adminOpeService.getCloseDayReportsByDate(this.url, from, to)
  }

  getBestSelledProuct(dateFrom: string, dateTo: string, topNumber: number = 10) {
    return this.adminOpeService.getBestSelledProuct(this.url, dateFrom, dateTo, topNumber)
  }

  getAllReportsByDate(from: string, to: string): Observable<any> {
    return this.adminOpeService.getAllReportsByDate(this.url, from!, to);
  }

  getProductsReportByDate(from: string, to: string): Observable<any> {
    return this.adminOpeService.getProductsReportByDate(this.url, from!, to);
  }


}
