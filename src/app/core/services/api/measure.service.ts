import {Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";
import {Measure} from "@models/measure.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  path = '/measure';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getMeasures(url: string) {
    return this._http.get<Measure[]>(url + this.path + '/')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getAssociatedMeasures(url: string, idMeasure: string): Observable<Measure[]> {
    return this._http.get<Measure[]>(url + this.path + '/' + idMeasure + '/associatedMeasures')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
