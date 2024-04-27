import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Configuration} from 'src/app/models/configuration.model';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {baseURL} from '@core/utils/url.path.enum';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  path = '/configurations';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getAll(url: string): Observable<Configuration> {
    return this._http.get<Configuration>(url + '/Configurations')
      .pipe(map(data => data));
    //.pipe(catchError(this.processHttpMsgService.handleError));
  }

  setAll(config: Configuration): Observable<Configuration> {
    return this._http.post<Configuration>(baseURL + this.path, config)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
