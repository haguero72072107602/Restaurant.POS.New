import {Component, Input} from '@angular/core';
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

import {ClientProductOrders, ProductOrders} from "@models/info-user.model";
import {PaymentMethodEnum} from "@core/utils/operations/payment-method.enum";

@Component({
  selector: 'app-order-customer',
  standalone: true,
  imports: [],
  templateUrl: './order-customer.component.html',
  styleUrl: './order-customer.component.css'
})
export class OrderCustomerComponent {
  @Input() order!: ClientProductOrders;

  constructor() {
  }

  productsConsumed(productsOrder: ProductOrders[]) {
    let products: string = "";
    productsOrder.forEach(p => {
      products += p.productName + ", "
    });
    return products.length > 0 ? products.trim().slice(0, -1) : "";
  }

  methodPaid(payMethod: PaymentMethodEnum): string {
    let strPaid: string = "";
    switch (payMethod) {
      case PaymentMethodEnum.CASH :
        strPaid += " Cash";
        break;
      case PaymentMethodEnum.CREDIT_CARD :
        strPaid += " Credit card";
        break;
      case PaymentMethodEnum.DEBIT_CARD :
        strPaid += " Debit card";
        break;
      case PaymentMethodEnum.EBT_CARD :
        strPaid += " EBT card";
        break;
      case PaymentMethodEnum.OTHER :
        strPaid += " Other";
        break;
      case PaymentMethodEnum.EBT_CASH :
        strPaid += " EBT Cash";
        break;
      case PaymentMethodEnum.ACCOUNT_CHARGE :
        strPaid += " Account";
        break;
      case PaymentMethodEnum.CHECK :
        strPaid += " Check";
        break;
      case PaymentMethodEnum.TRANSFER :
        strPaid += " Transfer";
        break;
      case PaymentMethodEnum.GIFT_CARD :
        strPaid += " GIFT Card";
        break;
      case PaymentMethodEnum.Online :
        strPaid += " Online";
        break;
    }
    return strPaid
  }

  onDialogReorder() {

  }

  onDialogView() {

  }
}
