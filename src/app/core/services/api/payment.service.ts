import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICashPayment} from 'src/app/models/cash-payment.model';
import {CardManualPayment, CreditCard} from 'src/app/models';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {catchError} from 'rxjs/operators';
import {PaymentMethodEnum} from "../../utils/operations/payment-method.enum";
import {Invoice} from "@models/invoice.model";
import {CheckPayment} from "@models/check.model";
import {IGiftCardPaymentModel} from "@models/gift-card.model";
import {ITransferPayment} from "@models/transfer.model";
import {IOnlinePayment} from "@models/online.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  path = '/invoices';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  paidByCash(url: string, cashPayment: ICashPayment): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/cash', cashPayment)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByOnline(url: string, onlinePayment: IOnlinePayment): Observable<any> {
    console.log("Pago online", onlinePayment);
    return this._http.post<any>(url + this.path + '/payment/online', onlinePayment)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByCreditCard(url: string, cashPayment: CreditCard): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/credit', cashPayment)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByDebitCard(url: string, cashPayment: CreditCard): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/debit', cashPayment)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByEBTCard(url: string, cashPayment: CreditCard, type: number): Observable<any> {
    console.log(cashPayment);
    let params = new HttpParams();
    params = params.append('type', type + '');
    return this._http.post<any>(url + this.path + '/payment/ebt', cashPayment, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  ebtInquiry(url: string) {
    return this._http.get<any>(url + this.path + '/payment/ebt')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paymentExternalCardReader(url: string, cardManualPayment: CardManualPayment, paymentMethod?: PaymentMethodEnum): Observable<Invoice> {
    console.log('paymentExternalCardReader', cardManualPayment, paymentMethod);
    let params = new HttpParams();
    params = params.append('paymentMethod', (paymentMethod ? paymentMethod : 2) + '');
    params = params.append('transferType', cardManualPayment.transferType + '');
    params = params.append('receiptNumber', cardManualPayment.receiptNumber);
    return this._http.post<Invoice>(url + this.path + '/payment/external', cardManualPayment, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPaymentMedia(url: string): Observable<any> {
    return this._http.get<any[]>(url + this.path + '/payment/media')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByCheck(url: string, check: CheckPayment) {
    return this._http.post<Invoice>(url + this.path + '/payment/check', check)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByGift(url: string, receiptNumber: string, gift: IGiftCardPaymentModel) {
    let params = new HttpParams();
    params = params.append('receiptNumber', receiptNumber);
    return this._http.post<Invoice>(url + this.path + '/payment/giftcard', gift, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByTransfer(url: string, transfer: ITransferPayment) {
    return this._http.post<Invoice>(url + this.path + '/payment/transfer', transfer)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
