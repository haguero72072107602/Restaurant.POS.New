import {Injectable} from '@angular/core';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LocalLayout} from "@models/local.layout.model";
import {Table} from "@models/table.model";

@Injectable({
  providedIn: 'root'
})
export class LocalLayoutService {
  path = '/locallayout';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getLocalLayout(url: string): Observable<LocalLayout[]> {
    return this._http.get<LocalLayout[]>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getLocalLayoutByUser(url: string, posUserId: string): Observable<LocalLayout[]> {
    return this._http.get<LocalLayout[]>(url + this.path + "/posUserId/" + posUserId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


}

