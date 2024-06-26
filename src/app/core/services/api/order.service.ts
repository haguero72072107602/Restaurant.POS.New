import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {Table} from "@models/table.model";
import {Order} from "@models/order.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  path = '/orders';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getTables(url: string) {
    return this._http.get<Table[]>(url + '/tables')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  update(url: string, order: Order) {
    return this._http.put<Order>(url + this.path + '/' + order.invoiceId, order)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getByInvoice(url: string, invoiceId: string) {
    return this._http.get<Order>(url + this.path + '/invoice/' + invoiceId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
