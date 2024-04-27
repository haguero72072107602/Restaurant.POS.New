import {Table} from "./table.model";
import {ETXType} from "@core/utils/delivery.enum";


export interface IClient {
  id?: string;
  name: string;
  telephone: string;
  address?: string;
}

export interface IOrder {
  id?: string;
  invoiceId: string;
  orderType: ETXType;
  clientId?: string,
  client?: IClient,
  tableId?: string,
  table?: Table,
  deliveryDate?: Date;
  description?: string
}

export class Client implements IClient {
  constructor(public name: string, public telephone: string, public address?: string, public id?: string) {
  }
}

export class Order implements IOrder {
  id!: string;

  constructor(public invoiceId: string, public orderType: ETXType,
              public clientId?: string,
              public client?: IClient,
              public tableId?: string,
              public table?: Table,
              public deliveryDate?: Date,
              description?: string) {
  }
}
