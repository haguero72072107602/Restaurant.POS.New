import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {Station} from "@models/station.model";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  path = '/stations';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getStatus(url: string): Observable<Array<Station>> {
    return this._http.get<any>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
