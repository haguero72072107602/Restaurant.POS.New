// import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor, HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';

import {AuthService} from "../services/api/auth.service";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  token: string | undefined = '';

  constructor(private auth: AuthService,
              private operationService: OperationsService) {
  }

  requestWithToken = (token: any, request: HttpRequest<any>, next: HttpHandler) => {
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
    return next.handle(request);
  }

  chooseRequestMode = (token: any, request: HttpRequest<any>, next: HttpHandler) => {
    return !!token ? this.requestWithToken(token, request, next) : next.handle(request);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('token', this.token, 'auth.token', this.auth.token);

    this.auth.loadUser();
    console.log('token', this.token, 'auth.token', this.auth.token);

    if (this.auth.token) {
      this.token = this.auth.token.fullToken;
    }

    this.operationService.resetInactivity(true);

    return this.chooseRequestMode(this.token, request, next)
      .pipe(
        catchError((error: HttpErrorResponse) => {

          if ([401, 403].includes(error.status) || error.error.code === 'EXPIRED') {
            this.operationService.logoutOpResponse();
            return throwError(error);
          }

          return throwError(error);
        })
      );
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === HttpStatusCode.Unauthorized || err.status === 403) {
      return this.auth.refreshToken();
    }
    return of(err);
  }

}
