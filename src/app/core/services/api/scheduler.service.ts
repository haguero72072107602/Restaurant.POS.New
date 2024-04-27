import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";
import {catchError} from "rxjs/operators";
import {Scheduler} from "@models/scheduler.models";
import {Observable} from "rxjs";
import {SchedulerTime} from "@models/scheduler-time.model";
import {SchedulerProduct} from "@models/scheduler-product.model";
import {SchedulerNotification} from "@models/scheduler-notification.model";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  path = '/schedulers';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getScheduler(url: string, activeModule: SchedulerType): Observable<Scheduler[]> {
    let params = new HttpParams();
    params = params.append('schedulerType', activeModule);

    return this._http.get<Scheduler[]>(url + this.path, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  createScreduler(url: string, scheduler: Scheduler): Observable<Scheduler> {
    return this._http.post<Scheduler>(url + this.path, scheduler)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteScreduler(url: string, id: string): Observable<Scheduler[]> {
    return this._http.delete<Scheduler[]>(url + this.path + "/" + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateScheduler(url: string, scheduler: Scheduler) {
    return this._http.put<Scheduler[]>(url + this.path + "/" + scheduler.id, scheduler)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  createScredulerTime(url: string, schedulerTime: SchedulerTime): Observable<Scheduler> {
    return this._http.post<Scheduler>(url + this.path + "/schedulerTime", schedulerTime)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteSchedulerTime(url: string, schedulerTime: SchedulerTime) {
    return this._http.delete<Scheduler>(url + this.path + "/schedulerTime/" + schedulerTime.id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addSchedulerProduct(url: string, schedulerProduct: SchedulerProduct) {
    return this._http.post<Scheduler>(url + this.path + "/schedulerProduct", schedulerProduct)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteSchedulerProduct(url: string, schedulerProduct: SchedulerProduct) {
    return this._http.delete<Scheduler>(url + this.path + "/schedulerProduct/" + schedulerProduct.id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  forceExecutionScheduler(url: string): Observable<SchedulerNotification[]> {
    return this._http.get<SchedulerNotification[]>(url + this.path + "/toFront")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
