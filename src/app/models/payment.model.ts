import {PaymentMethodEnum} from "@core/utils/operations/payment-method.enum";

export interface Payment {
  type: PaymentMethodEnum;
  name: string;
  total: number;
}
