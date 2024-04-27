import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaymentInvoice} from "@models/financials/payment-invoice.model";
import {PaymentMethodEnum} from "@core/utils/operations/payment-method.enum";

@Component({
  selector: 'app-card-adjust',
  templateUrl: './card-adjust.component.html',
  styleUrls: ['./card-adjust.component.css']
})
export class CardAdjustComponent {
  @Input({required: true}) paymentInvoice?: PaymentInvoice;
  @Input({required: true}) selectedCard?: PaymentInvoice;
  @Output() evtSelected = new EventEmitter<PaymentInvoice>()

  get getTextCard() {
    /*
    switch (parseFloat(this.paymentInvoice!.paymentMethod))
    {
      case PaymentMethodEnum.CASH:
        return 'CASH'
        break;
      case PaymentMethodEnum.DEBIT_CARD:
        return 'DEBIT'
        break
      case PaymentMethodEnum.CREDIT_CARD:
        return 'CREDIT'
        break
      case PaymentMethodEnum.GIFT_CARD:
        return 'ZELLE'
        break
      default:
        return 'CASH'
    }
    */
    return this.paymentInvoice!.card/*.substring(0,6)*/
  }

  get getCardAmount() {
    return this.paymentInvoice!.amount.toFixed(2)
  }

  onSelected() {
    this.evtSelected!.emit(this.paymentInvoice!)
  }

  isSelected() {
    return (this.selectedCard) ? this.selectedCard?.paymentId === this.paymentInvoice?.paymentId : false;
  }

}
