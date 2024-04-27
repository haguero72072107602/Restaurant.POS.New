import {Injectable} from '@angular/core';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LocalLayout} from "@models/local.layout.model";
import {ITable, Table} from "@models/table.model";

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  path = '/tables';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  setTable(url: string, table: Table): Observable<Table> {
    return this._http.post<Table>(url + this.path + "/location", table)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateTable(url: string, id: string, table: Table): Observable<any> {
    return this._http.put<Table>(url + this.path + "/" + id + "/location", table)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getTable(url: string, id: string): Observable<Table> {
    return this._http.get<Table>(url + this.path + "/" + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getTableByUser(url: string, idUser: string): Observable<Table[]> {
    return this._http.get<Table[]>(url + this.path + "/" + idUser)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getTableAllUser(url: string): Observable<Table[]> {
    return this._http.get<Table[]>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateAllTable(url: string, table: Table[]): Observable<Table[]> {
    return this._http.put<Table[]>(url + this.path, table)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getTablesLocationUser(url: string, layout: string, userId: string): Observable<Table[]> {
    return this._http.get<Table[]>(url + this.path + "/location/" + layout + "/user/" + userId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getTablesLocation(url: string, layout: string): Observable<Table[]> {
    return this._http.get<Table[]>(url + this.path + "/location/" + layout)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateStateTable(url: string) {
    return this._http.get<any>(url + this.path + "/updateStates")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}

