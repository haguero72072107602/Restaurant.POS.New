import {PaymentOpEnum} from "@core/utils/operations";

export interface ICashPayment {
  receiptNumber: string;
  total: number;
  amount: number;
  type: PaymentOpEnum;
  tip: number;
}

export class CashPaymentModel implements ICashPayment {
  constructor(public receiptNumber: string, public total: number,
              public amount: number, public type: PaymentOpEnum, public tip: number) {
  }
}
