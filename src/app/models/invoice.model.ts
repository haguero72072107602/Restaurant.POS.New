import {ProductOrder} from './product-order.model';
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {PaymentStatus} from "@core/utils/payment-status.enum";
import {ETXType} from "@core/utils/delivery.enum";
import {Order} from "@models/order.model";

export interface IInvoice {
  id: string;
  receiptNumber: string;
  status: InvoiceStatus;
  total: number;
  productOrders: ProductOrder[];
  applicationUserId?: string;
  applicationUserName?: string;
  clientAge?: number;
  subTotal?: number;
  tax?: number;
  isRefund?: boolean;
  isRefundSale?: boolean;
  fsTotal?: number;
  date?: Date;
  productsCount?: number;
  paymentStatus?: PaymentStatus;
  tip?: number;
  tipAmount?: number;
  balance?: number;
  type?: ETXType;
  orderInfo?: string;
  order?: Order;
  change?: number;
  isPromotion?: boolean;
  totalPromo?: number;
  isDiscount?: boolean;
  note?: string;
  prepareNote?: string;
  subCharge?: number;
  payments: any;
  labelTable?: string;
}

export class Invoice implements IInvoice {
  id!: string;

  constructor(public receiptNumber: string,
              public status = InvoiceStatus.IN_PROGRESS,
              public total = 0,
              public productOrders = new Array<ProductOrder>(),
              public applicationUserId?: string,
              public applicationUserName?: string,
              public clientAge?: number,
              public subTotal?: number,
              public tax?: number,
              public isRefund?: boolean,
              public isRefundSale?: boolean,
              public fsTotal?: number,
              public date?: Date,
              public productsCount?: number,
              public paymentStatus?: PaymentStatus,
              public tip?: number,
              public tipAmount?: number,
              public balance?: number,
              public type = ETXType.DINEIN,
              public orderInfo?: string,
              public order?: Order,
              public change?: number,
              public isPromotion?: boolean,
              public totalPromo?: number,
              public isDiscount?: boolean,
              public note?: string,
              public prepareNote?: string,
              public subCharge?: number,
              public payments: any = [],
              public labelTable?: string
  ) {
  }
}


