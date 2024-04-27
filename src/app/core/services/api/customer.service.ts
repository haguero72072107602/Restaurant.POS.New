import {HttpClient, HttpParams} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {InfoCustomer} from "@models/info-user.model";
import {Customer} from "@models/customer.model";
import {fnPhaserDateFormat} from "@core/utils/functions/functions";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  path = '/clients';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getAllCustomer(url: string): Observable<Customer[]> {
    return this._http.get<any>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getCustomer(url: string, idCustomer: string): Observable<Customer> {
    return this._http.get<any>(url + this.path + `/${idCustomer}`)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteCustomer(url: string, idCustomer: string): Observable<Customer> {
    return this._http.delete<any>(url + this.path + `/${idCustomer}`)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addCustomer(url: string, customer: Customer): Observable<Customer[]> {
    return this._http.post<Customer[]>(url + this.path, customer)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateCustomer(url: string, customer: Customer): Observable<Customer[]> {
    return this._http.put<Customer[]>(url + this.path + "/" + customer.id, customer)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  customerSalesReport(url: string, id: string, fromDate: string, toDate: string): Observable<InfoCustomer> {
    let params = new HttpParams();
    params = params.append('fromDate', fromDate + '');
    params = params.append('toDate', toDate + '');
    params = params.append('id', id + '');

    return this._http.get<InfoCustomer>(url + this.path + "/" + id + "/SalesReport", {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


}
