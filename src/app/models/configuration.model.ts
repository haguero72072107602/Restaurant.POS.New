import {CompanyType} from "@core/utils/company-type.enum";
import {BreakTextEnum} from "@core/utils/breaktext.enum";
import {PAXConnTypeEnum} from "@core/utils/pax-conn-type.enum";

export interface Configuration {
  posNumber?: number;
  allowClear?: boolean;
  allowAddMiscellany?: boolean;
  companyType?: CompanyType;
  externalScale?: boolean;
  allowCardSplit?: boolean;
  fullRefund?: boolean;
  allowEBT?: boolean;
  breakText?: BreakTextEnum;
  paxTimeout?: number;
  allowAddProdGen?: boolean;
  paxConnType?: PAXConnTypeEnum;
  inactivityTime?: number;
  closeChange?: boolean;
  allowGiftCard?: boolean;
  allowLastProdClear?: boolean;
  allowPromotion?: boolean;
  allowFoodStampMark?: boolean;
  allowApplyDiscount?: boolean;
  allowClock?: boolean;
  allowChangePrice?: boolean;
  changePriceBySelection?: boolean;
  closeAuth?: boolean;
  debitAsCreditCard?: boolean;
  closeDayAutomatic?: boolean;
  restartDayAutomatic?: boolean;
  printVoid?: boolean;
  printHold?: boolean;
  printInitTicket?: boolean;
  printMerchantTicket?: boolean;
  printTicket?: boolean;
  printTicketInProgress?: boolean;
  printCloseDayAutomatic?: boolean;
  limitSides?: number;
  allowMarketCafeteria?: boolean;
  allowPayment?: boolean;
  allowUserPrepareOrder?: boolean;
  prepareOrderToHoldInvoice?: boolean;
  printDefaultAggregates?: boolean;
  allowClientUpdate?: boolean;
  debounceTime?: number;
  language?: string;
  removeTax?: boolean;
  themes?: string;
  applyMerchantFee?: boolean;
  percentMerchantFee?: number;
  allowRetailInRestaurant?: boolean;
  tipWithoutAuth?: boolean;
  allowAuth?: boolean;
  allowTip?: boolean;
  printFinancialOnlyByOwner?: boolean;
  allowDelivery?: boolean;
  allowDineIn?: boolean;
  allowPickUp?: boolean;
  allowToGo?: boolean;
  allowOpenPriceNote?: boolean;
  sidesFree?: number;
  allowHappyHour?: number;
  allowSubCharge?: boolean;
  allowUserOpenPrice?: boolean;
  companyId?: string;
  checkCashierInTable?: boolean;
}
