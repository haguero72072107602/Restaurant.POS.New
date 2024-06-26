import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {catchError} from 'rxjs/operators';
import {PaymentMethodEnum} from "../../utils/operations/payment-method.enum";
import {CardManualPayment} from "@models/credit-card.model";
import {CheckPayment} from "@models/check.model";
import {TransferPayment} from "@models/transfer.model";
import {Invoice} from "@models/invoice.model";
import {GiftCardModel, IGiftModel} from "@models/gift-card.model";
import {Customer} from "@models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  path = '/clients';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getClients(url: string): Observable<Customer[]> {
    return this._http.get<any[]>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getClientById(url: string, id: string): Observable<any> {
    return this._http.get<any>(url + this.path + '/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  setClient(url: string, client: Customer): Observable<any> {
    console.log('setClient', client);
    return this._http.post<any>(url + this.path, client)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


  acctCharge(url: string, client: string, amount: number, receiptNumber: string): Observable<any> {
    console.log('acctCharge', client, amount, receiptNumber);
    return this._http.post<any>(url + this.path + '/chargeAccount', {
      clientId: client,
      receiptNumber: receiptNumber,
      amount: amount
    })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  acctPayment(url: string, client: string, payment: CardManualPayment | CheckPayment | TransferPayment, paymentMethod: PaymentMethodEnum) {
    console.log('acctPayment', payment);
    let params = new HttpParams();
    params = params.append('paymentMethod', paymentMethod + '');
    return this._http.post<Invoice>(url + this.path + '/' + client + '/chargeAccount/payment', payment, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  printAcctBalance(url: string, client: string) {
    return this._http.get<Invoice>(url + this.path + '/' + client + '/info')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  setCredit(url: string, client: string, credit: number) {
    return this._http.post<any>(url + this.path + '/' + client + '/creditLimit/' + credit, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  giftCard(url: string, gift: IGiftModel): Observable<any> {
    return this._http.put<any>(url + this.path + '/' + gift.clientId + '/giftCard', {amount: gift.amount})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  validGiftCard(url: string, client: string, card: GiftCardModel) {
    return this._http.post<any>(url + this.path + '/' + client + '/giftCard', card)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
