import {ModifiersGroup} from "@models/modifier.model";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

export interface Product {
  id?: string;
  upc?: string;
  name?: string;
  format?: string;
  unitInStock?: number;
  generic?: boolean;
  unitCost?: number;
  applyTax?: boolean;
  followDepartment?: boolean;
  departmentId?: string;
  ageVerification?: boolean;
  ageAllow?: number;
  foodStamp?: boolean;
  isRefund?: boolean;
  scalable?: boolean;
  tax: number;
  wic?: boolean;
  prefixIsPrice: boolean;
  preparation?: string[];
  sides?: string[];
  selected?: boolean;
  restaurantDetails?: boolean;
  color?: string;
  image: string;
  hasAggregates: boolean;
  price: Number;
  isStar: boolean;
  description?: string;
  currentPrice: number;
  groupDetails?: ModifiersGroup[];
  measureId?: string;
  measure?: string;

  starPrice: number;
  schedulerPrice: number;
  schedulerActive: boolean;
  schedulerType: SchedulerType;

  printFinancial: boolean;
  visible: boolean;

  buyX: number;
  payY: number;

  isHappyHour: boolean;
  firstFree: boolean;
}

export interface IProductUpdate {
  id: string;
  upc: string;
  price?: number;
  color?: string;
}

export class ProductUpdate implements IProductUpdate {
  constructor(public id: string, public upc: string, public price?: number, public color?: string) {
  }
}
