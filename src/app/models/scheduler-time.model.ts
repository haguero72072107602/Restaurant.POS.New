import {Time} from "@angular/common";

export interface SchedulerTime {
  id: string;
  schedulerId: string;
  fromTime: Time;
  toTime: Time;
  isDelete: boolean;
}
