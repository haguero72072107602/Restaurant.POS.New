import {SchedulerTime} from "@models/scheduler-time.model";
import {SchedulerProduct} from "@models/scheduler-product.model";
import {SchedulerDepartment} from "@models/scheduler-department.model";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

export interface Scheduler {
  id: string;
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  schedulerFrequency: number;
  schedulerType: SchedulerType;
  schedulerApplyTo: number;
  schedulerDiscountType: number;
  isActive: boolean;
  quantity: number;
  price: number;
  schedulerTimes: SchedulerTime[];
  schedulerProducts: SchedulerProduct[];
  schedulerDepartments: SchedulerDepartment[];
  buyX: number;
  payY: number;
  beginDate?: Date,
  endDate?: Date
}

