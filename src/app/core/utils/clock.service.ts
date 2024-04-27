import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import dayjs from "dayjs/esm";

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  private dateSystem: Date = dayjs().toDate();
  private dateSystemObservable$: Subject<Date> = new BehaviorSubject<Date>(dayjs().toDate());
  private changeDateDayObservable$: Subject<Date> = new BehaviorSubject<Date>(dayjs().toDate());

  constructor() {
    setInterval(() => {
      this.dateSystem = dayjs().toDate();
      this.dateSystemObservable$.next(this.dateSystem)
    }, 1000);
  }

  get getDate() {
    return this.dateSystemObservable$.asObservable();
  }

  get getDateChangeDay() {
    return this.changeDateDayObservable$.asObservable();
  }

}
