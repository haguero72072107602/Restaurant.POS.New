import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMSgService {

  constructor() {
  }

  public handleError(response: HttpErrorResponse | any) {
    console.error('handleError', response);
    let errMsg: string;

    if (response.status === 504 || (response.status === 0 && response.statusText === 'Unknown Error')) {
      //errMsg = 'Timeout trying connect with server. Please review server status or contact to support team.';
      return throwError('');
    } else if (response.status === 403 || response.statusText === 'Forbidden') {
      errMsg = 'Operation not allowed.';
    } else if (response.status === 401) {
      errMsg = 'Expired token. Start new session';
    } else if (response.error instanceof ErrorEvent) {
      errMsg = response.error.message;
    } else if (response.error && response.error.message) {
      errMsg = response.error.message;
    } else if (typeof response.error === 'string') {
      errMsg = response.error;
    } else {
      errMsg = `${response.statusText || ''} ${response.message}`;
    }
    return throwError(errMsg);
  }
}
