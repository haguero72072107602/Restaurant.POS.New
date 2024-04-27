import {Injectable} from "@angular/core";
import {Scheduler} from "@models/scheduler.models";
import {Observable} from "rxjs";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {SchedulerTime} from "@models/scheduler-time.model";
import {SchedulerProduct} from "@models/scheduler-product.model";
import {SchedulerNotification} from "@models/scheduler-notification.model";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  constructor(
    private dataStorage: DataStorageService
  ) {
  }

  public getScheduler(activeModule: SchedulerType): Observable<Scheduler[]> {
    return this.dataStorage.getScheduler(activeModule);
  }

  createScreduler(scheduler: Scheduler): Observable<Scheduler> {
    return this.dataStorage.createScreduler(scheduler);
  }

  deleteScheduler(id: string): Observable<Scheduler[]> {
    return this.dataStorage.deleteScreduler(id);
  }

  updateScheduler(scheduler: Scheduler): Observable<Scheduler[]> {
    return this.dataStorage.updateScheduler(scheduler);
  }

  createScredulerTime(schedulerTime: SchedulerTime): Observable<Scheduler> {
    return this.dataStorage.createScredulerTime(schedulerTime);
  }

  deleteSchedulerTime(schedulerTime: SchedulerTime): Observable<Scheduler> {
    return this.dataStorage.deleteSchedulerTime(schedulerTime);
  }

  addSchedulerProduct(schedulerProduct: SchedulerProduct) {
    return this.dataStorage.addSchedulerProduct(schedulerProduct);
  }

  deleteSchedulerProduct(schedulerProduct: SchedulerProduct) {
    return this.dataStorage.deleteSchedulerProduct(schedulerProduct);
  }

  forceExecutionScheduler(): Observable<SchedulerNotification[]> {
    return this.dataStorage.forceExecutionScheduler();
  }
}
