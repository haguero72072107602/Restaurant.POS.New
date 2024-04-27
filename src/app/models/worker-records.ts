import {EClockType} from "@core/utils/clock-type.enum";

export interface WorkerRecords {
  clockType: EClockType;
  clockTime: string;
  username: string;
  applicationUserId: string;
}
