/**
 * Created by tony on 23/10/2018.
 */
import {IAggregateProduct} from "@models/options.model";
import {GroupDetail} from "@models/group.detail";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

export interface ProductOrder {
  id: string;
  quantity: number;
  unitCost: number;
  total: number;
  tax: number;
  subTotal: number;
  productId: string;
  productUpc: string;
  productName: string;
  foodStamp: boolean;
  isRefund?: boolean;
  discount?: number;
  scalable?: boolean;
  sides?: Array<IAggregateProduct>;
  extraSides?: Array<IAggregateProduct>;
  preparationMode?: any /*Array<Option>*/
  ;
  restaurantDetails?: boolean;
  openSides?: Array<IAggregateProduct>;
  position: number;
  note?: string;
  saved?: number;
  /*productDetailsDto? : ProductDetailsDto;*/
  groupDetails?: Array<GroupDetail>;
  isStar: boolean;
  currentPrice: number;

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


export class AAProductOrder /*implements IProductOrder*/ {
  id!: string;

  constructor(public quantity: number,
              public unitCost: number,
              public total: number,
              public tax: number,
              public subTotal: number,
              public productId: string,
              public productUpc: string,
              public productName: string,
              public foodStamp: boolean,
              public isRefund?: boolean,
              public discount?: number,
              public scalable?: boolean,
              public sides?: Array<IAggregateProduct>,
              public extraSides?: Array<IAggregateProduct>,
              public preparationMode?: any /*Array<Option>*/,
              public restaurantDetails?: boolean,
              public openSides?: Array<IAggregateProduct>,
              public position: number = 0,
              public note?: string,
              public saved?: number,
              public groupDetails?: Array<GroupDetail>,
              public isStar: boolean = false,
              public starPrice: number = 0,
              public currentPrice: number = 0,
              public isHappyHour: boolean = false,
              public schedulerActive: boolean = false,
              public schedulerPrice: number = 0,
              public schedulerType: number = 0,
              public starHappyHourPrice: number = 0,
              public firstFree: boolean = false
  ) {
  }


}
