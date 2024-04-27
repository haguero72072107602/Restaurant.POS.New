import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";
import {Inventory} from "@models/inventory";
import {catchError} from "rxjs/operators";
import {ComponentSubmayor} from "@models/component-submayor.model";
import {Observable} from "rxjs";
import {ProductSubmajor} from "@models/product.submajor";

@Injectable({
  providedIn: 'root'
})
export class InventorySubmajorService {
  path = '/InventorySubmajor';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getProductSubmajor(url: string, productId: string, startDate: string, endDate: String): Observable<ComponentSubmayor[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.append('fromDate', startDate + '');
    }
    if (endDate) {
      params = params.append('toDate', endDate + '');
    }

    params.append('pageNumber', '0 ');
    params.append('pageSize', '0 ');

    return this._http.get<ComponentSubmayor[]>(
      url + this.path + '/daterange/component/' + productId,
      {params: params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMenuSubmajor(url: string, productId: string, startDate: string, endDate: String): Observable<ProductSubmajor[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.append('fromDate', startDate + '');
    }
    if (endDate) {
      params = params.append('toDate', endDate + '');
    }

    params.append('pageNumber', '0 ');
    params.append('pageSize', '0 ');

    return this._http.get<ProductSubmajor[]>(
      url + this.path + '/daterange/product/' + productId,
      {params: params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
