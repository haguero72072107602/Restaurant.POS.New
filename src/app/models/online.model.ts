import {PaymentOpEnum} from "@core/utils/operations";

export interface IOnlinePayment {
  receiptNumber: string,
  amount?: number,
  total?: number,
  tip?: number,
  paymentMethod?: string,
  confirmationCode?: string,
  type?: PaymentOpEnum
}

export class OnlinePayment implements IOnlinePayment {
  constructor(
    public amount: number,
    public receiptNumber: string,
    public confirmationCode?: string,
    public paymentMethod?: string,
    public tip?: number,
    public total?: number,
    public type?: PaymentOpEnum) {
  }
}
