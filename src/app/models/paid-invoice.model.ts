import {PaymentOpEnum} from "@core/utils/operations";
import {Invoice} from "@models/invoice.model";

export interface PaidInvoice {
  invoice?: Invoice,
  payment?: PaymentOpEnum
  paidInvoice?: number
}
