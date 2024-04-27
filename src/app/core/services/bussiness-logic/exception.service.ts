import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {InformationType} from "@core/utils/information-type.enum";
import {StockService} from "@core/services/bussiness-logic/stock.service";

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {

  constructor(private stockService: StockService) {
  }

  catchBadResponse: (errorResponse: any) => Observable<any> = (
    errorResponse: any
  ) => {
    let res = <HttpErrorResponse>errorResponse;
    let err = res;
    let emsg = err
      ? err.error
        ? err.error
        : JSON.stringify(err)
      : res.statusText || 'unknown error';
    console.log(`Error - Bad Response - ${emsg}`);

    this.stockService.utils.openGenericInfo(InformationType.ERROR, emsg)

    return of(false);
  };
}
