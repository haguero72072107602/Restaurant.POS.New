import {IAggregateProduct, Option} from './options.model';
import {GroupDetail} from "@models/group.detail";

export interface IProductRestaurantDetails {
  sides?: Array<IAggregateProduct>;
  extraSides?: Array<IAggregateProduct>;
  openSides?: Array<IAggregateProduct>;
  preparationModes?: Array<Option>;
  groupDetails?: Array<GroupDetail>;
}

export class ProductRestaurantDetails implements IProductRestaurantDetails {
  constructor(public sides?: Array<IAggregateProduct>, public extraSides?: Array<IAggregateProduct>,
              public preparationModes?: Array<Option>, public openSides?: Array<IAggregateProduct>,
              public groupDetails?: Array<GroupDetail>) {
  }
}
