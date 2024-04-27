import {EApplyDiscount} from "@core/utils/apply-discount.enum";

export interface DiscountEvent {
  amount: number,
  operation: EApplyDiscount
}
