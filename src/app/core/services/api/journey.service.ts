import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Journey} from 'src/app/models/journey.model';
import {catchError} from 'rxjs/operators';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {

  path = '/journeys';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  registryOperation(url: string, journey: Journey): Observable<any> {
    console.log('Put', journey);
    return this._http.post<any>(url + this.path + '/operation', journey)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
